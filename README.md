# PicSell Frontend

## 概要

このフォルダは React + Vite を使ったフロントエンドです。

- フロントエンドのルート: `frontend/`
- フロントエンドのエントリーポイント: `frontend/src/main.jsx`
- メインアプリ: `frontend/src/App.jsx`
- 環境設定ファイル: `frontend/.env.local`

## フォルダ構成

- `frontend/public/`
  - 静的ファイル、公開リソース
- `frontend/src/`
  - アプリコードの実装フォルダ
  - `src/main.jsx`: React アプリの起点
  - `src/App.jsx`: メインコンポーネント
  - `src/pages/`: ページ単位のコンポーネントを置く場所
  - `src/components/`: 再利用可能な UI コンポーネント
  - `src/services/`: API 呼び出しやサービスロジック
  - `src/store/`: 状態管理ロジック
  - `src/hooks/`: カスタムフック
  - `src/utils/`: 共通ユーティリティ関数
  - `src/assets/`: 画像やアイコンなどのアセット
- `frontend/.env.example`
  - 環境変数テンプレート
- `frontend/package.json`
  - npm スクリプトと依存関係
- `frontend/vite.config.js`
  - Vite の設定
- `frontend/eslint.config.js`
  - ESLint の設定

## 重要なファイル

- `frontend/src/main.jsx`
  - React アプリを HTML の `#root` にレンダリングする
- `frontend/src/App.jsx`
  - 現在のアプリのメイン UI。デフォルトの Vite テンプレートが置かれている
- `frontend/.env.local`
  - 実行時の環境変数をここに書く
  - 例: `VITE_API_BASE_URL=http://localhost:8000`

## 起動手順

1. `frontend` フォルダへ移動:

```bash
cd frontend
```

2. 依存関係をインストール:

```bash
npm install
```

3. `.env.local` を作成する:

```bash
cp .env.example .env.local
```

4. 開発サーバーを起動:

```bash
npm run dev
```

5. ブラウザでアクセス:

```text
http://localhost:5173
```

## 実行可能スクリプト

- `npm run dev`
  - 開発用サーバーを起動
- `npm run build`
  - 本番ビルドを作成
- `npm run preview`
  - ビルド後のプレビューを起動
- `npm run lint`
  - ESLint で静的解析を実行

## ルートとコントローラーの関係

このフロントエンドは、バックエンドのような明確なコントローラー層を持ちません。代わりに:

- `src/main.jsx` がアプリのルートエントリ
- `src/App.jsx` がメインの UI コンポーネント
- `src/pages/` にページコンポーネントを置き、将来的にルーティングを追加する
- `src/components/` に UI 部品をまとめる
- `src/services/` に API 連携やデータ取得ロジックをまとめる

## 環境変数について

`frontend/.env.local` に書く例:

```env
VITE_API_BASE_URL=http://localhost:8000
```

他の Firebase 変数が必要な場合は、`frontend/.env.example` を参考に追加してください。

## 注意

- 現在の `src/App.jsx` は Vite のデフォルトテンプレートを使用しています。
- そのため、`src/pages/` などのフォルダは今のところ実行中のルートには直接使われていません。
- ページ構成を使うには、React Router などを導入して `App.jsx` からルーティングを行う必要があります。
