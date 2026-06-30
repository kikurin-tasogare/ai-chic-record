# アイシックレコード（AI Chic Record）

「アイ（AI）シックレコード」— アカシックレコード風UIの用語辞典アプリ。

検索で用語を調べると、**初級・中級・上級**の3段階で学べます。

## v0.1 の機能

- アカシックレコード風デザイン（落ち着いた学術感 + AIアクセント）
- 用語検索・カテゴリフィルター
- 用語カードを開くと初級 → 中級 → 上級タブで段階的に学習
- 静的JSONのみ使用（APIキー不要）

## ファイル構成

```
ai-chic-record/
├── index.html       # メインHTML
├── styles.css       # スタイルシート
├── app.js           # 検索・フィルター・UI制御
├── data/
│   └── terms.json   # 用語データ
├── .gitignore
└── README.md
```

## 使い方

### ローカルで開く

静的ファイルのため、ブラウザで `index.html` を直接開くか、簡易サーバーで配信してください。

```bash
# Python 3
python3 -m http.server 8080

# Node.js (npx)
npx serve .
```

ブラウザで `http://localhost:8080` にアクセスします。

> **Note:** `fetch` で JSON を読み込むため、`file://` プロトコルでは動作しない場合があります。簡易サーバーの利用を推奨します。

## 用語データの形式

`data/terms.json` の各エントリ:

| フィールド | 説明 |
|-----------|------|
| `name` | 用語名 |
| `category` | カテゴリ（索引フィルターに使用） |
| `levels.beginner` | 初級の説明 |
| `levels.intermediate` | 中級の説明 |
| `levels.advanced` | 上級の説明 |
| `example` | 佑哉さん向けの例え |

## v0.1 収録用語

- GitHub（開発基盤）
- Vercel（デプロイ）
- Node.js（ランタイム）

## セキュリティ

- APIキー不要
- 外部API呼び出しなし
- 静的JSONのみ

## ライセンス

MIT
