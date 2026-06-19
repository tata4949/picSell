import os
import json
import time
import httpx
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key={GEMINI_API_KEY}"


def _call_gemini_disposal(prompt: str) -> str:
    body = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.3}
    }
    for attempt in range(3):
        with httpx.Client(timeout=60.0) as client:
            response = client.post(GEMINI_URL, json=body)
        if response.status_code == 429:
            wait = 10 * (attempt + 1)
            time.sleep(wait)
            continue
        response.raise_for_status()
        text = response.json()["candidates"][0]["content"]["parts"][0]["text"]
        return text.strip().replace("```json", "").replace("```", "").strip()
    raise Exception("Gemini API rate limit exceeded after retries")


def suggest_disposal(
    price_avg: int | None,
    condition: str,
    product_name: str,
    brand: str | None,
    category: str,
) -> dict:
    if price_avg is None:
        method = "買取店"
        price_context = "相場データなし"
    elif price_avg >= 5000 and condition in ["良好", "普通"]:
        method = "フリマアプリ"
        price_context = f"相場{price_avg:,}円・状態{condition}"
    elif price_avg >= 5000 and condition == "やや傷あり":
        method = "買取店"
        price_context = f"相場{price_avg:,}円・状態{condition}"
    elif price_avg >= 1000:
        method = "買取店"
        price_context = f"相場{price_avg:,}円・状態{condition}"
    else:
        method = "処分"
        price_context = f"相場{price_avg:,}円・状態{condition}"

    brand_text = brand if brand else "ブランド不明"
    prompt = f"""
以下の不用品の手放し方として「{method}」を提案します。
その理由を50〜80文字で具体的に説明してください。

商品情報：
- 商品名：{product_name}
- ブランド：{brand_text}
- カテゴリ：{category}
- {price_context}

【ルール】
- です・ます調で書く
- 商品の特性やカテゴリに合わせた具体的な理由を書く
- 必ず以下のJSON形式のみで返す（説明文不要）：

{{"reason": "理由のテキスト"}}
"""

    try:
        text = _call_gemini_disposal(prompt)
        result = json.loads(text)
        reason = result.get("reason", "")
    except Exception:
        reason = _fallback_reason(method, price_avg, condition)

    return {
        "method":  method,
        "reason":  reason,
        "options": ["フリマアプリ", "買取店", "処分"]
    }


def _fallback_reason(method: str, price_avg: int | None, condition: str) -> str:
    if price_avg is None:
        return "相場の判断が難しいため、専門家に査定してもらうことをおすすめします"
    if method == "フリマアプリ":
        return f"相場が{price_avg:,}円と高く状態も良いのでフリマで高値が狙えます"
    if method == "買取店":
        return f"相場は{price_avg:,}円です。買取店への持ち込みが効率的です"
    return f"相場が{price_avg:,}円と低く、処分をおすすめします"