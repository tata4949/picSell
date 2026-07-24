import os
from firebase_admin import firestore, storage
from app.core.firebase import db, bucket


def upload_image(image_bytes: bytes, filename: str) -> str:
    blob = bucket.blob(f"assessments/{filename}")
    blob.upload_from_string(image_bytes, content_type="image/jpeg")
    blob.make_public()
    return blob.public_url


def save_assessment(user_id: str, image_url: str, product_info: dict, extra: dict = {}) -> str:
    doc_ref = db.collection("assessments").add({
        "user_id":       user_id,
        "image_url":     image_url,
        "brand":         product_info.get("brand"),
        "product_name":  product_info.get("product_name"),
        "category":      product_info.get("category"),
        "condition":     product_info.get("condition"),
        "search_query":  product_info.get("search_query"),
        "questions":     extra.get("questions", []),
        "created_at":    firestore.SERVER_TIMESTAMP,
    })
    return doc_ref[1].id


def get_assessments(user_id: str) -> list:
    docs = db.collection("assessments")\
        .where("user_id", "==", user_id)\
        .order_by("created_at", direction=firestore.Query.DESCENDING)\
        .stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]


def get_assessment(assessment_id: str) -> dict | None:
    doc = db.collection("assessments").document(assessment_id).get()
    if not doc.exists:
        return None
    return {"id": doc.id, **doc.to_dict()}


def update_assessment(assessment_id: str, data: dict) -> dict | None:
    ref = db.collection("assessments").document(assessment_id)
    doc = ref.get()
    if not doc.exists:
        return None
    ref.update(data)
    updated = ref.get()
    return {"id": updated.id, **updated.to_dict()}


def delete_assessment(assessment_id: str) -> None:
    db.collection("assessments").document(assessment_id).delete()

def save_question(assessment_id: str, question: str, answer: str) -> dict:
    doc_ref = db.collection("assessments").document(assessment_id)\
        .collection("questions").add({
            "question": question,
            "answer":   answer,
            "created_at": firestore.SERVER_TIMESTAMP,
        })
    return {"id": doc_ref[1].id, "question": question, "answer": answer}


def get_questions(assessment_id: str) -> list:
    docs = db.collection("assessments").document(assessment_id)\
        .collection("questions")\
        .order_by("created_at")\
        .stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]    