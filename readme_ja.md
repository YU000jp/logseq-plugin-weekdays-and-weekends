# Logseq Plugin: More journal templates 🛌

- 曜日ごとにテンプレートを設定したりして、日誌テンプレートを切り替えるためのプラグイン。

[](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/releases)![latest release version](https://img.shields.io/github/v/release/YU000jp/logseq-plugin-weekdays-and-weekends) [](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/LICENSE)![License](https://img.shields.io/github/license/YU000jp/logseq-plugin-weekdays-and-weekends?color=blue) [](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/releases)![Downloads](https://img.shields.io/github/downloads/YU000jp/logseq-plugin-weekdays-and-weekends/total.svg)
 公開日:2023/05/04 /
 [日本語ドキュメント](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/wiki/%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88)📝

---

## 機能説明

- 日誌テンプレートにレンダラーと呼ぶものを置きます。それによってこのプラグインの機能が呼び出されます。
- 日誌以外のページではレンダリングは実行されません。日誌のページが空で呼び出されたときに、指定したテンプレートが反映されます。

1. 曜日ごとに異なるテンプレートを設定する
1. 平日と休日のテンプレートを設定する
1. 祝日にアラートを出して、テンプレートを選択する
1. 特定の曜日にアラートを出して、隔週でテンプレートを選択する
1. 個人休暇日にアラートを出して、テンプレートを選択する
1. 休日出勤日にアラートを出して、テンプレートを選択する

- 隔週でテンプレートを選択する場合や、勤務パターンが異なる場合にも対応しています。つまり、「2交代勤務」のようなパターンにも対応しています。「指定した曜日、たとえば月曜日にテンプレートを選択する画面が出てきて、その週はサブテンプレートにする」といった操作が可能です。

## デモ

![image](https://user-images.githubusercontent.com/111847207/235460001-a731d9eb-8b45-4c55-8789-d73e24bb655a.gif)

---

- プラグインを使用するには、ユーザーによる初期設定が必要です。
  > デフォルトでは、いくつかの機能がオフになっています。プラグインの設定画面を開いて、設定をオンにしてください。

## 初期設定

- [日本語ドキュメント](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/wiki/%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88)

## Q&A

- 日誌 テンプレートが呼び出されたときにレンダリングを実行する必要があります。常にこのプラグインをオンにしてください。 Logseq モバイル版の場合は、手動でテンプレートを呼び出してください。
- 既存の[Full House Templates](https://github.com/stdword/logseq13-full-house-plugin)、[powerblocks](https://github.com/hkgnp/logseq-powerblocks-plugin)、[SmartBlocks](https://github.com/sawhney17/logseq-smartblocks)との統合が可能です。
- Logseq標準の動的変数をサポートします。
- レンダラーを他のグラフの日誌テンプレートとして配置することもできますが、プラグインの設定はすべてのグラフで共有されることに注意してください。

## Logseqマーケットプレースからインストール

- 右上にあるツールバーの[`---`]を押して[`Plugins`]を選択し、その後、マーケットプレースを選択します。検索欄に`more`と入力してください。
