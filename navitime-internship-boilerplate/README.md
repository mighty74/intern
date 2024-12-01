# インターンシップ課題

## 開発への入り方

下記リンクを参考に推奨拡張機能をインストールしてください。

https://qiita.com/otsuky/items/f46f5ee9eb11b3a9a4ba#%E6%8E%A8%E5%A5%A8%E6%8B%A1%E5%BC%B5%E6%A9%9F%E8%83%BD%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B

下記のいずれかの方法で Live Server が起動したら開発開始です。

1. ステータスバーの「Go Live」をクリック。
   右記のディレクトリに画像があるので、それを参考に。`/.vscode/howto/vscode-live-serve-statusbar.jpeg`
2. Explorer ウィンドウの index.html を右クリックして、「Open with Live Server」をクリック。
3. index.html を開いて、「alt + L を押しながら O（オー）」（Win）または「Cmd + L を押しながら O（オー）」（Mac）

---

## ディレクトリ構成

【.vscode】

- VS Code の設定系ファイルが配置してあります。特に弄る必要はありません。

【assets】

- 画像等のリソースファイルを配置するためのディレクトリです。

【css】

- CSS ファイルを配置するためのディレクトリです。

【js】

- JavaScript ファイルを配置するためのディレクトリです。

【js/lib】

- JavaScript のライブラリファイルを配置するためのディレクトリです。特に弄る必要はありません。

```
.
├── .vscode
│   ├── extensions.json
│   └── settings.json
├── assets
│   └── img
├── css
│   └── index.css
├── js
│   ├── lib
│   │   ├── axios.min.js
│   │   └── jquery-3.6.0.min.js
│   ├── index.js
│   └── util.js
├── index.html
└── README.md
```

---

## 拡張機能について

追加している拡張機能

【サーバー系】

- Live Server: 簡易的なローカルサーバを立てることができる

【HTML 系】

- Auto Close Tag: HTML で開始タグを打ち終わったときに自動的に終了タグを生成してくれる
- Auto Rename Tag: HTML の開始タグを修正したときに、自動的に対になる終了タグを修正してくれる

【CSS 系】

- IntelliSense for CSS class names in HTML: CSS クラスを指定するときに、入力補完してくれる

【JavaScript 系】

- Bracket Pair Colorizer: 対応する括弧を色分けして表示してくれる
- Prettier: ソースコードを解析して、ルールに応じてコーディングスタイルを適用してくれるコードフォーマッター
- VS Code ESLint: JavaScript のための静的検証ツールです。コードを実行する前に明らかなバグを見つけたり、括弧やスペースの使い方などのスタイルを統一したりする

【API 系】

- VS Code 上で HTTP リクエストを送信し、VS Code 上でレスポンスを確認できる
