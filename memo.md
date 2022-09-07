# 📝 2022/09/07

##  module わけたい

- レイアウト
- 引数乗せるやつ

と、色々考えなきゃ

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

## `twigl` のバグ？

`300 es` だと、`for` のインクリメントの`++` を一つ消してもエラー取得しない？

`Fragmen.MODE_CLASSIC` だと、検知する

## `memo.md` を追加

ノイズになりそうだっけど、やはり書き捨てのメモ必要と感じ追加
