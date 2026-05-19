# PicSell

## 目次

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

```env
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
