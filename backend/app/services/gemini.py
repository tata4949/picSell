import os
import json
import time
import base64
import statistics
import httpx
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key={GEMINI_API_KEY}"


def _call_gemini(body: dict) -> str:
    for attempt in range(3):
        with httpx.Client(timeout=60.0) as client:
            response = client.post(GEMINI_URL, json=body)
        if response.status_code == 429:
            wait = 10 * (attempt + 1)
            print(f"429 Rate limit. Waiting {wait}s...")
            time.sleep(wait)
            continue
        response.raise_for_status()
        text = response.json()["candidates"][0]["content"]["parts"][0]["text"]
        return text.strip().replace("```json", "").replace("```", "").strip()
    raise Exception("Gemini API rate limit exceeded after retries")


def analyze_product(image_bytes: bytes | list, mime_type: str = "image/jpeg") -> dict:
    if isinstance(image_bytes, list):
        parts = []
        for img in image_bytes:
            b64 = base64.b64encode(img).decode("utf-8")
            parts.append({"inline_data": {"mime_type": mime_type, "data": b64}})
    else:
        b64 = base64.b64encode(image_bytes).decode("utf-8")
        parts = [{"inline_data": {"mime_type": mime_type, "data": b64}}]

    prompt = """
この画像（複数枚の場合は全て参考にして）に写っている商品を、日本の中古市場で販売する前提で特定してください。

【カテゴリ別の注意点】
- スニーカー：ブランド＋モデル名＋カラーまで特定（例：Nike Air Force 1 '07 ホワイト/ブラック）
- バッグ：ブランド＋ライン名＋素材＋サイズまで特定（例：Louis Vuitton モノグラム ネヴァーフル MM）
- スマートフォン：ブランド＋機種名＋容量＋カラーまで特定（例：iPhone 14 Pro 256GB スペースブラック）
- 家電：ブランド＋型番＋製造年まで特定（例：Dyson V12 Detect Slim）
- アウター：ブランド＋商品名＋素材＋カラー＋サイズまで特定

【共通ルール】
- ロゴ・刻印・タグ・型番など画像内のテキストを最優先で使用する
- 限定モデル・コラボモデルの場合はその情報も含める
- 状態は画像から推定する（傷・汚れ・使用感などを確認）
- 不明な場合はnullではなく「不明」と記載

【追加撮影リクエストのルール】
- 写真では物理的に判別が不可能な場合のみneeds_more_photos: trueにする
- すでに写真に写っている部分は絶対に再度リクエストしない
- 型番・容量・サイズ・カラーなど文字情報が不足している場合は追加撮影ではなく逆質問（questions）を優先する
- needs_more_photosはブランドロゴや商品自体が全く見えない・判別できない場合のみ使用する

【逆質問のルール】
- 価格に直接影響する情報が不足している場合のみ質問する（最大5問）
- 各質問には選択肢を4つ以内で提示する
- 必ず聞く情報：容量・ストレージ・型番・製造年・SIMロック有無
- サイズはブランドバッグのみ質問する（スニーカー・服・アウターは聞かない）
- カラーは原則聞かない。ただし限定カラー・コラボカラーが存在し価格差が大きいと判断できる場合のみ聞く
- 付属品の有無・通常カラーは聞かない
- 商品が完全に特定できている場合はquestionsは空配列にする
- needs_more_photos: trueの場合はquestionsは空配列にする

必ず以下のJSON形式のみで返してください（説明文不要）：

{
  "brand": "ブランド名（不明な場合はnull）",
  "product_name": "商品名・型番（できるだけ具体的に）",
  "category": "カテゴリ（スニーカー・バッグ・アウター・スマートフォン・家電・その他のいずれか）",
  "condition": "状態推定（良好・普通・やや傷あり・不明のいずれか）",
  "search_query": "メルカリやヤフオクで検索するための最適なキーワード（日本語・型番含む）",
  "needs_more_photos": false,
  "requested_photos": [],
  "questions": []
}
"""

    parts.insert(0, {"text": prompt})
    body = {
        "contents": [{"parts": parts}],
        "generationConfig": {"temperature": 0.1}
    }
    text = _call_gemini(body)
    return json.loads(text)


def analyze_product_with_answers(
    image_bytes: bytes | list,
    mime_type: str,
    answers: list[dict],
) -> dict:
    if isinstance(image_bytes, list):
        parts = []
        for img in image_bytes:
            b64 = base64.b64encode(img).decode("utf-8")
            parts.append({"inline_data": {"mime_type": mime_type, "data": b64}})
    else:
        b64 = base64.b64encode(image_bytes).decode("utf-8")
        parts = [{"inline_data": {"mime_type": mime_type, "data": b64}}]

    answers_text = "\n".join([f"- {a['question']}：{a['answer']}" for a in answers])

    prompt = f"""
この画像に写っている商品について、ユーザーから以下の追加情報が提供されました：

{answers_text}

この情報も踏まえて商品を特定し、査定してください。

必ず以下のJSON形式のみで返してください（説明文不要）：

{{
  "brand": "ブランド名（不明な場合はnull）",
  "product_name": "商品名・型番（できるだけ具体的に）",
  "category": "カテゴリ（スニーカー・バッグ・アウター・スマートフォン・家電・その他のいずれか）",
  "condition": "状態推定（良好・普通・やや傷あり・不明のいずれか）",
  "search_query": "メルカリやヤフオクで検索するための最適なキーワード（日本語・型番含む）",
  "needs_more_photos": false,
  "requested_photos": [],
  "questions": []
}}
"""

    parts.insert(0, {"text": prompt})
    body = {
        "contents": [{"parts": parts}],
        "generationConfig": {"temperature": 0.1}
    }
    text = _call_gemini(body)
    return json.loads(text)


def summarize_prices(search_query: str, search_results: list) -> dict:
    if not search_results:
        return {"min": None, "max": None, "avg": None, "summary": "相場データが取得できませんでした"}

    prices = [r["price"] for r in search_results if r.get("price")]

    if not prices:
        return {"min": None, "max": None, "avg": None, "summary": "価格データが取得できませんでした"}

    median = statistics.median(prices)
    filtered = [p for p in prices if median * 0.6 <= p <= median * 1.4]

    if not filtered:
        filtered = prices

    price_min = min(filtered)
    price_max = max(filtered)
    price_avg = int(sum(filtered) / len(filtered))

    snippets = "\n".join([
        f"- {r['title']}：¥{r['price']:,}（{r['source']}）"
        for r in search_results[:10]
    ])

    prompt = f"""
「{search_query}」の中古商品の検索結果です：

{snippets}

この商品の中古相場について一言コメントをしてください。
必ず以下のJSON形式のみで返してください（説明文不要）：

{{
  "summary": "相場の一言コメント（例：状態によって3,000〜8,000円程度）"
}}
"""

    body = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.1}
    }

    text = _call_gemini(body)
    result = json.loads(text)

    return {
        "min":     price_min,
        "max":     price_max,
        "avg":     price_avg,
        "summary": result.get("summary", f"中古相場は¥{price_min:,}〜¥{price_max:,}程度"),
    }