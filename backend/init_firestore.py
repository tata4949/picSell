import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timezone

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

now = datetime.now(timezone.utc)
uid = "sample_uid"
assessment_id = "sample_assessment"
question_id = "sample_question"

# usersコレクション（サンプル1件）
db.collection("users").document(uid).set({
    "uid": uid,
    "email": "test@example.com",
    "display_name": "テストユーザー",
    "plan": "free",
    "created_at": now,
    "updated_at": now,
})

# assessmentsコレクション（サンプル1件）
db.collection("assessments").document(assessment_id).set({
    "uid": uid,
    "photo_url": "https://storage.example.com/sample.jpg",
    "product_name": "Nike Air Max 90",
    "brand": "Nike",
    "condition": "良好",
    "estimated_price_min": 8000,
    "estimated_price_max": 12000,
    "suggestion": "flea",
    "suggestion_reason": "状態が良く高値が期待できます",
    "created_at": now,
    "updated_at": now,
})

# assessments/{assessment_id}/questions サブコレクション（サンプル1件）
db.collection("assessments").document(assessment_id).collection("questions").document(question_id).set({
    "id": question_id,
    "uid": uid,
    "question": "箱は付属していますか？",
    "answer": "箱あり、説明書なしです",
    "created_at": now,
    "updated_at": now,
})

print("Firestore初期データ作成完了！")