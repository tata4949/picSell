# PicSell
<<<<<<< HEAD
=======

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
>>>>>>> origin/main-backend

## 主要なパス

<<<<<<< HEAD
- [概要](#概要)
- [前提](#前提)
- [環境ファイル](#環境ファイル)
- [Docker で起動する](#docker-で起動する)
- [ローカルで起動する](#ローカルで起動する)
- [サービス確認](#サービス確認)

## 概要

このリポジトリは、React/Vite ベースのフロントエンドと FastAPI ベースのバックエンドを含みます。`docker/docker-compose.yml` で両方を同時に起動できます。

## 前提

- Docker がインストールされていること
- Node.js / npm を使ってローカル起動する場合は、Node.js がインストールされていること
- Python を使ってバックエンドをローカル起動する場合は、Python 3.11 以上がインストールされていること

## 環境ファイル

### `frontend` の環境ファイル

- `frontend/.env.local` を作成します
- 例:
=======
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
>>>>>>> origin/main-backend

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
<<<<<<< HEAD
VITE_API_BASE_URL=http://localhost:8000
```

このファイルは `frontend` フォルダ直下に配置します。

### `backend` の環境ファイル

- `backend/.env` を作成またはコピーします
- 例: `backend/.env.example` を参考にして必要な値を設定します

最低限、Docker で動かすだけなら以下を設定しておくと良いです:

```env
USE_MOCK=true
```

`backend/.env` は `backend` フォルダ直下に配置します。

## Docker で起動する

1. プロジェクトルートへ移動します:

```bash
cd picSell
```

2. `frontend/.env.local` を作成します:

```bash
cat > frontend/.env.local << 'EOF'
VITE_API_BASE_URL=http://localhost:8000
EOF
```

3. `backend/.env` を用意します。必要に応じて `backend/.env.example` をコピーして編集します。

4. Docker Compose で起動します:

```bash
docker compose -f docker/docker-compose.yml up --build
```

5. バックグラウンドで起動する場合:

```bash
docker compose -f docker/docker-compose.yml up --build -d
```

### ポート

- フロントエンド: `http://localhost:5173`
- バックエンド: `http://localhost:8000`

## ローカルで起動する

### 1. バックエンド

```bash
cd picSell/backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1   # PowerShell
# または .\.venv\Scripts\activate.bat  for cmd
pip install -r requirements.txt
```

`backend/.env` を用意したら、次のように起動します:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. フロントエンド

```bash
cd picSell/frontend
npm install
```

`frontend/.env.local` を用意したら、次のように起動します:

```bash
npm run dev
```

## サービス確認

- バックエンド確認:
  - `http://localhost:8000/`
  - 期待するレスポンス: `{"message":"PicSell API is running"}`

- フロントエンド確認:
  - `http://localhost:5173/`
  - ブラウザでアクセスしてページが表示されることを確認します

## 注意

- `frontend/.env.local` が存在しないと、Docker Compose は現在の構成では起動に失敗します
- `backend/.env` は `backend/.env.example` を参考にしてください
- `USE_MOCK=true` を設定すると、実サービスの API キーが不要なモック構成で起動しやすくなります
=======
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
>>>>>>> origin/main-backend
