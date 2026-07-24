import os
import httpx
from dotenv import load_dotenv

load_dotenv()

SERPAPI_KEY = os.getenv("SERPAPI_KEY")

CONDITION_QUERY = {
    "良好":       "中古 美品",
    "普通":       "中古",
    "やや傷あり": "中古 傷あり",
    "不明":       "中古",
}


def _search_google_shopping(query: str) -> list:
    url = "https://serpapi.com/search"
    params = {
        "api_key":       SERPAPI_KEY,
        "engine":        "google_shopping",
        "q":             query,
        "gl":            "jp",
        "hl":            "ja",
        "num":           20,
        "google_domain": "google.co.jp",
    }
    response = httpx.get(url, params=params, timeout=30.0)
    response.raise_for_status()
    data = response.json()

    results = data.get("shopping_results", [])
    items = []
    for r in results:
        price = r.get("extracted_price") or r.get("price")
        if price:
            try:
                price_int = int(float(str(price).replace("¥", "").replace(",", "").strip()))
                if 500 <= price_int <= 1_000_000:
                    items.append({
                        "title":  r.get("title", ""),
                        "price":  price_int,
                        "source": r.get("source", "google_shopping"),
                    })
            except (ValueError, TypeError):
                continue
    return items


def _search_mercari(query: str) -> list:
    import re
    url = "https://serpapi.com/search"
    params = {
        "api_key": SERPAPI_KEY,
        "engine":  "google",
        "q":       f"site:mercari.com {query}",
        "gl":      "jp",
        "hl":      "ja",
        "num":     10,
    }
    response = httpx.get(url, params=params, timeout=30.0)
    response.raise_for_status()
    data = response.json()

    items = []
    for r in data.get("organic_results", []):
        text = r.get("snippet", "") + r.get("title", "")
        matches = re.findall(r"[\d,]+(?=円)", text)
        for m in matches:
            try:
                price_int = int(m.replace(",", ""))
                if 500 <= price_int <= 1_000_000:
                    items.append({
                        "title":  r.get("title", ""),
                        "price":  price_int,
                        "source": "mercari",
                    })
            except ValueError:
                continue
    return items


def search_price(search_query: str, category: str = "", condition: str = "不明") -> list:
    condition_kw = CONDITION_QUERY.get(condition, "中古")

    if len(search_query) > 30:
        search_query = search_query[:30]

    query = f"{search_query} {condition_kw}"

    shopping_items = []
    mercari_items = []

    try:
        shopping_items = _search_google_shopping(query)
    except Exception as e:
        print(f"Google Shopping error: {e}")

    try:
        mercari_items = _search_mercari(query)
    except Exception as e:
        print(f"Mercari search error: {e}")

    return shopping_items + mercari_items