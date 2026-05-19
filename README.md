# PicSell

## このフォルダの構成

このリポジトリは、主に FastAPI バックエンドと Docker 起動構成を含みます。

- `backend/`
  - FastAPI バックエンドのコード
  - `backend/app/main.py` がアプリケーションのルートエントリポイント
  - `backend/app/api/` に API コントローラー（ルート定義）
  - `backend/app/models/` にデータモデルや Pydantic スキーマ
  - `backend/app/services/` にビジネスロジックと外部サービス呼び出し
  - `backend/app/core/` に設定や Firebase 連携の共通コード
  - `backend/.env` に環境変数
  - `backend/.env.example` に環境変数テンプレート
- `docker/`
  - `docker/docker-compose.yml` でバックエンドを起動
  - `docker/Dockerfile.backend` でバックエンド用 Docker イメージを定義

## 主要なパス

- ルートディレクトリ: `picSell/`
- バックエンド実行ルート: `picSell/backend/app/main.py`
- API コントローラー（ルーティング）:
  - `picSell/backend/app/api/assess.py`
  - `picSell/backend/app/api/auth.py`
  - `picSell/backend/app/api/listing.py`
- モデル定義:
  - `picSell/backend/app/models/assessment.py`
  - `picSell/backend/app/models/listing.py`
- サービス層:
  - `picSell/backend/app/services/claude.py`
  - `picSell/backend/app/services/maps.py`
  - `picSell/backend/app/services/search.py`
  - `picSell/backend/app/services/stripe.py`
  - `picSell/backend/app/services/vision.py`
- 共通設定 / コア:
  - `picSell/backend/app/core/config.py`
  - `picSell/backend/app/core/firebase.py`

## Docker で起動する方法

1. プロジェクトルートに移動:

```bash
cd picSell
```

2. `backend/.env` を用意します。

`backend/.env.example` をコピーして、必要に応じて値を設定してください。

3. Docker Compose を起動します:

```bash
docker compose -f docker/docker-compose.yml up --build
```

4. バックグラウンド実行する場合:

```bash
docker compose -f docker/docker-compose.yml up --build -d
```

### 期待される公開ポート

- バックエンド: `http://localhost:8000`

## `backend/.env` について

`backend` の環境変数は `backend/.env` に書きます。たとえば最低限のモック実行用に:

```env
USE_MOCK=true
```

実際に API キーや Firebase、Stripe を使う場合は `backend/.env.example` を参考にして必要な情報を入力します。

## ローカルでバックエンドを起動する

1. `backend` フォルダへ移動:

```bash
cd picSell/backend
```

2. Python 仮想環境を作成して有効化:

```bash
python -m venv .venv
.\.venv\Scripts\Activate.ps1   # PowerShell
# または .\.venv\Scripts\activate.bat  for cmd
```

3. 必要パッケージをインストール:

```bash
pip install -r requirements.txt
```

4. アプリを起動:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## ルートとコントローラーの関係

- `backend/app/main.py` は FastAPI アプリの起点です。
- `backend/app/api/` 内の各ファイルがルート定義（コントローラー）です。
- `backend/app/models/` はリクエスト・レスポンスのスキーマやドメインモデルを定義します。
- `backend/app/services/` は外部 API 呼び出しや処理ロジックをまとめる場所です。

## 補足

この README はバックエンド専用の内容です。フロントエンドに関する設定や起動手順は含みません。
