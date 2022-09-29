# 📝 2022/09/29

## es300

300 一本でいく、`selcet` 剥ぐ

# 📝 2022/09/14

## インデント

[#commands.indentSelection | CodeMirror Reference Manual](https://codemirror.net/docs/ref/#commands.indentSelection)

`↹`, `᳅`


## 1行選択

[#commands.selectLine | CodeMirror Reference Manual](https://codemirror.net/docs/ref/#commands.selectLine)


# 📝 2022/09/10

## `commands` の発見

キーボード操作系のやりたいことは、ほぼできそうな感じになっていた。

全体的に書き換え。

スワイプだけは、両端で止まって欲しいので、自己実装の方を採用

## シンタックスハイライト系

コメントアウトができるようになったので、言語系を入れた

以前は、Javascript としていたが、`autocompletion` 等々まだ未実装として、`cpp` にしてみた

# 📝 2022/09/07

## module わけたい

- レイアウト
- 引数乗せるやつ

と、色々考えなきゃ

とりあえず分けたけど、ひっどい

隠蔽工作としか考えられん

## touch デバイス分岐

ちゃんと分ける

## 擬似キー

やっぱり無理かなぁ

# 📝 2022/09/06

## カーソル移動

行を跨がないようにしてみたい

`viewportLineBlocks`
`moveToLineBoundary`

## テスト用コード

``` .js

document.addEventListener('keydown', () => {
  console.log('hoge');
  const range = editor.state.selection.main;
  console.log(range);
  console.log('true');
  console.log(editor.moveToLineBoundary(range, 1));
  console.log('false');
  console.log(editor.moveToLineBoundary(range, 0));
});

```

# 📝 2022/09/05

## ~`twigl` のバグ？~

`300 es` だと、`for` のインクリメントの`++` を一つ消してもエラー取得しない？

`Fragmen.MODE_CLASSIC` だと、検知する

### 違う (2022/09/10)

Win のChrome なら補足できてるから

iOS とmacOS 側の問題かと



## `memo.md` を追加

ノイズになりそうだっけど、やはり書き捨てのメモ必要と感じ追加
