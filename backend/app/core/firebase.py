import os
from pathlib import Path
from typing import Optional
import firebase_admin
from firebase_admin import credentials, firestore, storage

def _get_credential_path() -> Path:
    default_path = Path(__file__).resolve().parents[3] / "serviceAccountKey.json"
    configured_path = os.getenv("FIREBASE_CREDENTIALS_PATH") or os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if configured_path:
        return Path(configured_path)
    return default_path

def _get_env_service_account() -> Optional[dict]:
    project_id = os.getenv("FIREBASE_PROJECT_ID")
    client_email = os.getenv("FIREBASE_CLIENT_EMAIL")
    private_key = os.getenv("FIREBASE_PRIVATE_KEY")
    private_key_id = os.getenv("FIREBASE_PRIVATE_KEY_ID")
    token_uri = os.getenv("FIREBASE_TOKEN_URI", "https://oauth2.googleapis.com/token")
    if not (project_id and client_email and private_key):
        return None
    private_key = private_key.strip().strip('"')
    private_key = private_key.replace("\\n", "\n")
    service_account = {
        "type": "service_account",
        "project_id": project_id.strip().strip('"'),
        "client_email": client_email.strip().strip('"'),
        "private_key": private_key,
        "token_uri": token_uri,
    }
    if private_key_id:
        service_account["private_key_id"] = private_key_id.strip().strip('"')
    return service_account

def _initialize_app() -> None:
    if not firebase_admin._apps:
        cred_path = _get_credential_path()
        storage_bucket = os.getenv("FIREBASE_STORAGE_BUCKET", "picsell-ad150.firebasestorage.app")
        if cred_path.exists():
            cred = credentials.Certificate(str(cred_path))
        else:
            env_service_account = _get_env_service_account()
            if env_service_account is None:
                raise FileNotFoundError(
                    f"Firebase credentials not found at {cred_path} and env vars are missing"
                )
            cred = credentials.Certificate(env_service_account)
        firebase_admin.initialize_app(cred, {
            "storageBucket": storage_bucket
        })

_initialize_app()
db = firestore.client()
bucket = storage.bucket()