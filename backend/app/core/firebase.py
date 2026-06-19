import os
from pathlib import Path

import firebase_admin
from firebase_admin import credentials, firestore


def _get_credential_path() -> Path:
    default_path = Path(__file__).resolve().parents[3] / "serviceAccountKey.json"
    configured_path = os.getenv("FIREBASE_CREDENTIALS_PATH") or os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if configured_path:
        return Path(configured_path)
    return default_path


def _initialize_app() -> None:
    if not firebase_admin._apps:
        cred_path = _get_credential_path()
        if not cred_path.exists():
            raise FileNotFoundError(f"Firebase credentials not found at {cred_path}")
        cred = credentials.Certificate(str(cred_path))
        firebase_admin.initialize_app(cred)


_initialize_app()

db = firestore.client()
