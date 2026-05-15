# PicSell 📸

**写真を撮って、チェックするだけ。あとはAIが全部やる。**

不用品を写真で撮るだけでAIが査定・手放しルート提案・出品文生成まで全自動。利用者はチェックして選ぶだけ。

---

## 目次

- [概要](#概要)
- [デモ](#デモ)
- [機能一覧](#機能一覧)
- [技術スタック](#技術スタック)
- [ディレクトリ構成](#ディレクトリ構成)
- [環境変数](#環境変数)
- [セットアップ](#セットアップ)
- [開発ルール](#開発ルール)
- [API利用制限](#api利用制限)
- [プラン設計](#プラン設計)
- [メンバー](#メンバー)

---

## 概要

日本の家庭には1人あたり平均約53.2万円の「かくれ資産」（不用品）があると言われていますが、その88.9%はゴミとして処分されています。PicSellはフリマアプリの出品手続きの手間や、買取相場の不透明さを解消し、「撮る → 査定 → 手放す」をワンストップで実現するWebアプリです。

---

## デモ

> 🎥 デモ動画：（URL追加予定）  
> 🌐 プロトタイプURL：（デプロイ後に追加）

---

## 機能一覧

### 無料プラン

| 機能 | 説明 |
|------|------|
| AI写真査定 | 1日1回。Google Vision APIで商品名・ブランド・状態を自動認識 |
| 参考価格表示 | Custom Search APIでフリマ・買取店の公開価格を集計して表示 |
| 手放しルート提案 | フリマ・買取ショップ・ジモティー・廃棄を横断比較 |
| 査定履歴 | 過去の査定結果を一覧表示 |

### 有料プラン（月額800円）

| 機能 | 説明 |
|------|------|
| AI写真査定 | 無制限 |
| 出品文自動生成 | タイトル・説明文をAIが自動生成（コピペで即出品） |

---

## 技術スタック

| 領域 | 技術 |
|------|------|
| フロントエンド | React / Vite |
| スタイリング | Tailwind CSS |
| 認証 | Firebase Authentication |
| データ保存 | Firebase Firestore |
| 画像認識 | Google Cloud Vision API |
| 価格取得 | Google Custom Search API |
| 出品文生成 | Anthropic Claude API |
| デプロイ | Vercel |

---

## ディレクトリ構成

```
picsell/
├── public/
│   └── favicon.ico
│
├── src/
│   ├── assets/               # 画像・アイコン等の静的ファイル
│   │
│   ├── components/           # 再利用可能なUIコンポーネント
│   │   ├── common/           # Button, Badge, Modal など汎用部品
│   │   │   ├── Button.jsx
│   │   │   ├── Badge.jsx
│   │   │   └── Modal.jsx
│   │   ├── camera/           # 撮影・画像選択まわり
│   │   │   ├── CameraView.jsx
│   │   │   └── ImagePreview.jsx
│   │   ├── assessment/       # 査定結果表示まわり
│   │   │   ├── ResultCard.jsx
│   │   │   └── PriceRange.jsx
│   │   └── proposal/         # 手放しルート提案まわり
│   │       ├── RouteCard.jsx
│   │       └── ListingText.jsx
│   │
│   ├── pages/                # 画面単位のコンポーネント（ルーティング対象）
│   │   ├── Home.jsx          # ホーム（撮影起点・履歴）
│   │   ├── Camera.jsx        # 撮影・アルバム選択
│   │   ├── Assessing.jsx     # AI査定中（ローディング）
│   │   ├── Result.jsx        # 査定結果
│   │   ├── Proposal.jsx      # 手放しルート提案
│   │   ├── Listing.jsx       # 出品文生成（有料）
│   │   ├── History.jsx       # 査定履歴一覧
│   │   ├── Plan.jsx          # プラン選択（無料→有料）
│   │   ├── Login.jsx         # ログイン
│   │   └── Register.jsx      # 新規登録
│   │
│   ├── hooks/                # カスタムフック
│   │   ├── useCamera.js      # カメラ・画像取得ロジック
│   │   ├── useAssessment.js  # 査定API呼び出しロジック
│   │   └── useAuth.js        # 認証状態管理
│   │
│   ├── services/             # 外部API・Firebase との通信
│   │   ├── visionApi.js      # Google Cloud Vision API
│   │   ├── searchApi.js      # Google Custom Search API
│   │   ├── claudeApi.js      # Anthropic Claude API（出品文生成）
│   │   └── firebase.js       # Firebase 初期化・Firestore操作
│   │
│   ├── store/                # グローバル状態管理（Context or Zustand）
│   │   ├── authStore.js      # ログイン状態・ユーザー情報
│   │   └── assessmentStore.js# 査定結果・履歴
│   │
│   ├── utils/                # 汎用ユーティリティ
│   │   ├── imageUtils.js     # 画像リサイズ・base64変換
│   │   └── priceUtils.js     # 価格帯の集計・フォーマット
│   │
│   ├── constants/            # 定数定義
│   │   └── routes.js         # ルートパス定数
│   │
│   ├── App.jsx               # ルーティング定義
│   └── main.jsx              # エントリーポイント
│
├── .env.local                # 環境変数（※Gitに含めない）
├── .env.example              # 環境変数のサンプル（Gitに含める）
├── .gitignore
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

---

## 環境変数

`.env.example` をコピーして `.env.local` を作成し、各自のAPIキーを設定してください。

```bash
cp .env.example .env.local
```

```env
# Google Cloud
VITE_GOOGLE_VISION_API_KEY=your_key_here
VITE_GOOGLE_CUSTOM_SEARCH_API_KEY=your_key_here
VITE_GOOGLE_CUSTOM_SEARCH_CX=your_cx_here

# Anthropic
VITE_ANTHROPIC_API_KEY=your_key_here

# Firebase
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> ⚠️ `.env.local` は絶対にGitにコミットしないでください。`.gitignore` に含まれていることを確認してください。

---

## セットアップ

### 必要な環境

- Node.js 18以上
- npm 9以上

### インストール手順

```bash
# 1. リポジトリをクローン
git clone https://github.com/your-org/picsell.git
cd picsell

# 2. 依存パッケージをインストール
npm install

# 3. 環境変数を設定
cp .env.example .env.local
# .env.local を編集して各APIキーを入力

# 4. 開発サーバーを起動
npm run dev
```

ブラウザで `http://localhost:5173` を開いて確認してください。

### ビルド・デプロイ

```bash
# 本番ビルド
npm run build

# ビルド確認（ローカルでプレビュー）
npm run preview
```

Vercelへのデプロイは `main` ブランチへのpushで自動実行されます。Vercelのプロジェクト設定に環境変数を登録してください。

---

## 開発ルール

### ブランチ運用

```
main        # 本番（直接push禁止）
develop     # 統合ブランチ
feature/*   # 機能開発（例：feature/vision-api）
fix/*       # バグ修正
```

### コミットメッセージ

```
feat:   新機能追加
fix:    バグ修正
style:  見た目・スタイルの変更
refactor: リファクタリング
docs:   ドキュメント更新
chore:  設定・依存関係の更新
```

例：`feat: Vision APIのレスポンス整形処理を追加`

### PRルール

- `develop` へのマージはPR必須
- レビュワー：最低1名
- CIが通っていること（Lint・ビルドエラーなし）

---

## API利用制限

開発中はAPIの無料枠を節約するため、**モックデータを優先**してください。

| API | 無料枠 | 注意 |
|-----|--------|------|
| Google Cloud Vision API | 月1,000回 | 本番テスト時のみ使用 |
| Google Custom Search API | 1日100回 | `searchApi.js` にモード切替あり |
| Anthropic Claude API | 従量課金 | 開発中はモックテキストを使用 |

```js
// services/visionApi.js
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
```

`.env.local` に `VITE_USE_MOCK=true` を追加するとモックモードで動作します。

---

## プラン設計

| | 無料プラン | 有料プラン |
|--|-----------|-----------|
| 月額 | 無料 | ¥800 |
| AI査定 | 1日1回 | 無制限 |
| 出品文生成 | ✗ | ✓ |
| 査定履歴 | ✓ | ✓ |
| 手放しルート提案 | ✓ | ✓ |

> 決済機能（Stripe等）はプロトタイプフェーズではモックUIとし、7月10日以降に実装予定。

---

## メンバー

| 名前 | 役割 |
|------|------|
| 牧村 | エンジニアリード / API連携 |
| 丸山 | デザイン / デモ動画 |
| 足立 | デザイン / フロントエンド |
| 金森 | エンジニア / 認証・データ |

---

*PicSell — テーマ③「AIを道具として使いこなす」*
