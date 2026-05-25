import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# usersコレクション（サンプル1件）
db.collection("users").document("sample_uid").set({
    "uid": "sample_uid",
    "email": "test@example.com",
    "display_name": "テストユーザー",
    "plan": "free",
    "created_at": datetime.now()
})

# assessmentsコレクション（サンプル1件）
db.collection("assessments").document("sample_assessment").set({
    "uid": "sample_uid",
    "photo_url": "https://storage.example.com/sample.jpg",
    "product_name": "Nike Air Max 90",
    "brand": "Nike",
    "condition": "良好",
    "estimated_price_min": 8000,
    "estimated_price_max": 12000,
    "suggestion": "flea",
    "suggestion_reason": "状態が良く高値が期待できます",
    "created_at": datetime.now()
})

# questionsコレクション（サンプル1件）
db.collection("questions").document("sample_question").set({
    "assessment_id": "sample_assessment",
    "question": "商品の状態を教えてください",
    "answer": "使用感少なめ、目立った傷なし",
    "created_at": datetime.now()
})

print("Firestore初期データ作成完了！")