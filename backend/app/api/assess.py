import uuid
import asyncio
import json
import httpx
from io import BytesIO
from concurrent.futures import ThreadPoolExecutor
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from typing import List, Optional
from PIL import Image
from app.services.search import search_price
from app.services.gemini import analyze_product, analyze_product_with_answers, summarize_prices
from app.services.firebase import save_assessment, upload_image, get_assessment, get_assessments, update_assessment, delete_assessment, save_question, get_questions
from app.services.disposal import suggest_disposal

router = APIRouter()
executor = ThreadPoolExecutor()

async def run_in_thread(func, *args):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(executor, func, *args)

def convert_to_jpeg(image_bytes: bytes) -> bytes:
    img = Image.open(BytesIO(image_bytes))
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    output = BytesIO()
    img.save(output, format="JPEG", quality=90)
    return output.getvalue()

def build_assessment_response(doc_id, image_url, product_info, price_summary, disposal):
    return {
        "status": "success",
        "data": {
            "assessment_id": doc_id,
            "image_url":     image_url,
            "brand":         product_info["brand"],
            "product_name":  product_info["product_name"],
            "category":      product_info["category"],
            "condition":     product_info["condition"],
            "search_query":  product_info["search_query"],
            "price": {
                "min":     price_summary["min"],
                "max":     price_summary["max"],
                "avg":     price_summary["avg"],
                "summary": price_summary["summary"],
            },
            "disposal": {
                "method":  disposal["method"],
                "reason":  disposal["reason"],
                "options": ["フリマアプリ", "買取店", "処分"]
            }
        }
    }


# 9番: POST /assessments 査定作成
@router.post("/assessments")
async def assess_item(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="画像ファイルを送信してください")

    image_bytes = await file.read()
    image_bytes = convert_to_jpeg(image_bytes)
    mime_type = "image/jpeg"
    filename = f"{uuid.uuid4()}.jpg"

    product_info, image_url = await asyncio.gather(
        run_in_thread(analyze_product, image_bytes, mime_type),
        run_in_thread(upload_image, image_bytes, filename),
    )

    if product_info.get("needs_more_photos"):
        return {
            "status":           "needs_more_photos",
            "assessment_id":    str(uuid.uuid4()),
            "image_url":        image_url,
            "brand":            product_info["brand"],
            "product_name":     product_info["product_name"],
            "category":         product_info["category"],
            "condition":        product_info["condition"],
            "requested_photos": product_info.get("requested_photos", []),
            "message":          "より正確な査定のため、追加の写真を送ってください"
        }

    if product_info.get("questions"):
        # 逆質問をFirestoreに保存
        assessment_id = str(uuid.uuid4())
        await run_in_thread(
            save_assessment,
            "anonymous",
            image_url,
            product_info,
            {"questions": product_info["questions"]}
        )
        return {
            "status":        "questions",
            "assessment_id": assessment_id,
            "image_url":     image_url,
            "brand":         product_info["brand"],
            "product_name":  product_info["product_name"],
            "category":      product_info["category"],
            "condition":     product_info["condition"],
            "questions":     product_info["questions"],
            "message":       "より正確な査定のため、いくつか教えてください"
        }

    search_results = await run_in_thread(
        search_price,
        product_info["search_query"],
        product_info["category"],
        product_info["condition"],
    )

    price_summary, doc_id = await asyncio.gather(
        run_in_thread(summarize_prices, product_info["search_query"], search_results),
        run_in_thread(save_assessment, "anonymous", image_url, product_info, {}),
    )

    disposal = suggest_disposal(
        price_summary["avg"],
        product_info["condition"],
        product_info["product_name"],
        product_info["brand"],
        product_info["category"],
    )

    return build_assessment_response(doc_id, image_url, product_info, price_summary, disposal)


# 10番: GET /assessments 査定一覧
@router.get("/assessments")
async def list_assessments():
    assessments = await run_in_thread(get_assessments, "anonymous")
    return {"status": "success", "data": assessments}


# 11番: GET /assessments/{id} 査定取得
@router.get("/assessments/{assessment_id}")
async def get_assessment_by_id(assessment_id: str):
    assessment = await run_in_thread(get_assessment, assessment_id)
    if not assessment:
        raise HTTPException(status_code=404, detail="査定が見つかりません")
    return {"status": "success", "data": assessment}


# 12番: PUT /assessments/{id} 査定更新（手放し方のみ）
@router.put("/assessments/{assessment_id}")
async def update_assessment_by_id(assessment_id: str, body: dict):
    # 手放し方以外の更新を禁止
    allowed_keys = {"disposal_method"}
    filtered_body = {k: v for k, v in body.items() if k in allowed_keys}
    
    if not filtered_body:
        raise HTTPException(status_code=400, detail="更新できるのは手放し方（disposal_method）のみです")
    
    updated = await run_in_thread(update_assessment, assessment_id, filtered_body)
    if not updated:
        raise HTTPException(status_code=404, detail="査定が見つかりません")
    return {"status": "success", "data": updated}

# 13番: DELETE /assessments/{id} 査定削除
@router.delete("/assessments/{assessment_id}")
async def delete_assessment_by_id(assessment_id: str):
    await run_in_thread(delete_assessment, assessment_id)
    return {"success": True}


# 追加撮影
@router.post("/assessments/refine")
async def refine_assessment(
    files: List[UploadFile] = File(...),
    assessment_id: Optional[str] = Form(None),
):
    images = []
    for f in files:
        if not f.content_type.startswith("image/"):
            continue
        raw = await f.read()
        images.append(convert_to_jpeg(raw))

    if not images:
        raise HTTPException(status_code=400, detail="有効な画像ファイルがありません")

    filename = f"{uuid.uuid4()}.jpg"

    product_info, image_url = await asyncio.gather(
        run_in_thread(analyze_product, images, "image/jpeg"),
        run_in_thread(upload_image, images[0], filename),
    )

    if product_info.get("questions"):
        return {
            "status":        "questions",
            "assessment_id": assessment_id or str(uuid.uuid4()),
            "image_url":     image_url,
            "brand":         product_info["brand"],
            "product_name":  product_info["product_name"],
            "category":      product_info["category"],
            "condition":     product_info["condition"],
            "questions":     product_info["questions"],
            "message":       "より正確な査定のため、いくつか教えてください"
        }

    search_results = await run_in_thread(
        search_price,
        product_info["search_query"],
        product_info["category"],
        product_info["condition"],
    )

    price_summary, doc_id = await asyncio.gather(
        run_in_thread(summarize_prices, product_info["search_query"], search_results),
        run_in_thread(save_assessment, "anonymous", image_url, product_info, {}),
    )

    disposal = suggest_disposal(
        price_summary["avg"],
        product_info["condition"],
        product_info["product_name"],
        product_info["brand"],
        product_info["category"],
    )

    return build_assessment_response(doc_id, image_url, product_info, price_summary, disposal)


# 逆質問回答
@router.post("/assessments/answer")
async def answer_questions(
    assessment_id: str = Form(...),
    image_url: str = Form(...),
    answers: str = Form(...),
):
    try:
        answers_list = json.loads(answers)
    except Exception:
        raise HTTPException(status_code=400, detail="answersのJSON形式が不正です")

    with httpx.Client(timeout=30.0) as client:
        img_response = client.get(image_url)
    img_response.raise_for_status()
    image_bytes = convert_to_jpeg(img_response.content)

    product_info = await run_in_thread(
        analyze_product_with_answers,
        image_bytes,
        "image/jpeg",
        answers_list,
    )

    search_results = await run_in_thread(
        search_price,
        product_info["search_query"],
        product_info["category"],
        product_info["condition"],
    )

    price_summary, doc_id = await asyncio.gather(
        run_in_thread(summarize_prices, product_info["search_query"], search_results),
        run_in_thread(save_assessment, "anonymous", image_url, product_info, {}),
    )

    disposal = suggest_disposal(
        price_summary["avg"],
        product_info["condition"],
        product_info["product_name"],
        product_info["brand"],
        product_info["category"],
    )

    return build_assessment_response(doc_id, image_url, product_info, price_summary, disposal)

# 16番: POST /assessments/{id}/questions 質問追加
@router.post("/assessments/{assessment_id}/questions")
async def add_question(assessment_id: str, body: dict):
    question = body.get("question")
    answer = body.get("answer")
    if not question or not answer:
        raise HTTPException(status_code=400, detail="questionとanswerは必須です")
    result = await run_in_thread(save_question, assessment_id, question, answer)
    return {"status": "success", "data": result}


# 17番: GET /assessments/{id}/questions 質問一覧
@router.get("/assessments/{assessment_id}/questions")
async def list_questions(assessment_id: str):
    questions = await run_in_thread(get_questions, assessment_id)
    return {"status": "success", "data": questions}