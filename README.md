# puppeteer-example

Puppeteer を使ってみつつメモなどを残す

## Puppeteer とは

[Puppeteer](https://pptr.dev/)

- Chrome/Chromium を操作する Node.js ライブラリ
- DevTools Protocol を介して制御される
- Chrome DevTools チームがメンテナンスしている
- スクレイピングやテストに活用できる
- Selenium との大きな違いは、Chrome 専用であり Node.js であることによる柔軟性とシンプルさのトレードオフ

## バージョン

これを試している時のバージョン

- Puppeteer : 20.7.4
- Node.js : 16.3.0

## 実行方法

```sh
# node を用意する（nodebrewを使う）
nodebrew install v16.3.0
nodebrew use v16.3.0

# インストール
npm install --save puppeteer

# 実行
node src/sample.js
```

docker も試してみたい。docker だと headless chrome が面倒らしい。

## セレクタでの要素の指定

[Puppeteer 入門](https://www.shuwasystem.co.jp/book/9784798055206.html) を参考に、基本的なことを抜粋してメモ

HTML 上の要素を特定する方法はいくつかあるが、基本的に上から検討

1. id で探す
2. class で探す
3. タグ で探す
4. name で探す
5. 属性名 で探す
6. DOM ツリー で探す

### 1. HTML タグの id

- HTML の規約上「id は同一ページの中に 1 つだけ定義」
- セレクタでの指定は#を付けて `'#id_name'`

### 2. HTML タグの class

- id が指定されていない場合、次に取る手法は CSS の class
- ただし、要素を辿るための id がどこかに含まれる必要がある
- セレクタでの指定は.を付けて `'.class_name'`

```js
await page.waitFor("#head_news .main-article");
await page.waitFor("#head_news .main-article:nth-child(3)");
```

### 3. HTML タグ

- タグは HTML の構成上必ず存在する
- 要素を特定するために class と組み合わせたり工夫が必要
- セレクタでの指定は接頭辞なしで `'tag_name'`

```js
await page.waitForSelector("input .gsc-input");
```

### 4. name 属性

- テキストボックスやセレクトボックスなどの name 属性
- セレクタでの指定
  - テキストボックス `<input>` なら `'input[name="name"]'`
  - セレクトボックス `<select>` なら `'select[name="name"]'`

### 5. name 以外の属性

- name 属性以外にも、他の属性名でも指定できる
- セレクタは、 `'[属性名=値]'`

### 6. DOM ツリー

DOM ツリーは複雑で具体的で緻密すぎて固定的なので、最終手段とする

## ページをたどる

ページを辿る方法は 2 種類

1. URL を指定して goto する
2. waitForNavigation を使う

### 1. goto は直接 URL を指定する方式

```js
// ページを開く
await page.goto("https://xxx.xx.xx");
```

### 2. waitForNavigation() はページの遷移を待つ処理

よくある間違いは、クリックしてから wait する。これではクリックした時点でロードは終わっている可能性がある。

```js
// NG例
// ページを開く
await page.goto("https://xxx.xx.xx");

// リンクをクリック
await page.click("xxx");

// 遷移されてloadを待つ（つもりだが、これはうまくいかない）
await page.waitForNavigation({ waitUntil: "load" });
```

正しくはロードを待たせた状態でクリックをする。

```js
// OK例
// ページを開く
await page.goto("https://xxx.xx.xx");

// ロードを待つのとクリックイベントを並行させる
await Promise.all([
  page.waitForNavigation({ waitUntil: "load" }),
  page.click("xxx"),
]);
```

### ページ遷移の注意事項

ページ遷移には delay を入れたほうがいい。サーバに負荷をかけすぎないため。

```sh
# インストール
npm install delay
```

```js
// コード例
const puppeteer = require("puppeteer");
const delay = require("delay");

async () => {
  // ...省略

  await page.goto("https://xxx.xx.xx");
  await delay(1000);

  await Promise.all([
    page.waitForNavigation({ waitUntil: "load" }),
    page.click("xxx"),
  ]);

  // ...省略
};
```

## waitFor 各種

- waitFor
  - 単純に待ち時間を指定する
- waitForNavigation
  - 画面読み込みを待つ
  - `waitUntil` でどの読み込みイベントまで待つかを細かく指定可能
- waitForSelector
  - 指定したセレクタが描画されるのを待つ
  - SPA などページ遷移しない場合

## 並列処理でクリックした後の画面描画を待つ

```js
// セレクタxxxの表示を待たせておいて、yyyをクリックして、xxxが描画されたら次へ
await Promise.all([
  page.waitForSelector('xxx');
  page.click('yyy');
])
```

## BASIC 認証を通す

```js
// goto top page with BASIC authN
await page.authenticate({ username: "xxx", password: "yyy" });
await page.goto("https://xxx.xx.xx");
```

## スクリーンショットを撮る

```js
// screenshot
await page.screenshot({ path: "sample.png" });
```
