# Logseq Plugin: More journal templates 🛌

- 曜日ごとにテンプレートが設定できる、日誌テンプレートを切り替えるためのプラグイン。

[](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/releases)![latest release version](https://img.shields.io/github/v/release/YU000jp/logseq-plugin-weekdays-and-weekends) [](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/LICENSE)![License](https://img.shields.io/github/license/YU000jp/logseq-plugin-weekdays-and-weekends?color=blue) [](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/releases)![Downloads](https://img.shields.io/github/downloads/YU000jp/logseq-plugin-weekdays-and-weekends/total.svg)
 公開日:2023/05/04 /
 [日本語ドキュメント](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/wiki/%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88)📝

---

## 概要

- 日誌テンプレート内の行に、レンダラーと呼ばれる短いコードを配置します。日誌テンプレートが呼び出されたときに、このプラグインのテンプレート機能が実行されます。

1. 曜日ごとに異なるテンプレート
1. 平日用、休日用のテンプレート
1. 祝日アラート (テンプレートを選択)
1. 隔週テンプレート (特定の曜日にテンプレートを選択)
   > 隔週でテンプレートを選択する場合や、勤務パターンが異なる場合に対応しています。つまり、「2交代勤務」のようなパターンにも対応しています。「指定した曜日、たとえば月曜日にテンプレートを選択する画面が出てきて、その週はサブテンプレートにする」といった操作が可能です。
1. 事前設定アラート (個人休暇や休日出勤などの日に、テンプレートを選択)

---

### Logseqマーケットプレースからインストール

- 右上にあるツールバーの[`---`]を押して[`Plugins`]を選択し、その後、マーケットプレースを選択します。検索欄に`more`と入力してください。

## 初期設定

- プラグインを使用するには、ユーザーによる初期設定が必要です。デフォルトでは、プラグイン設定で、いくつかの機能がオフになっています。

- *[セットアップ ドキュメント (日本語)](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/wiki/%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88)*

## 備考

1. 日誌 テンプレートが呼び出されたときにレンダリングを実行する必要があります。常にこのプラグインをオンにしてください。 Logseq モバイル版の場合は、手動でテンプレートを呼び出してください。
1. 既存の[Full House Templates](https://github.com/stdword/logseq13-full-house-plugin)、[powerblocks](https://github.com/hkgnp/logseq-powerblocks-plugin)、[SmartBlocks](https://github.com/sawhney17/logseq-smartblocks)との統合が可能です。
1. Logseq標準の動的変数をサポートします。
1. レンダラーを他のグラフの日誌テンプレートとして配置することもできますが、プラグインの設定はすべてのグラフで共有されることに注意してください。

<a href="https://www.buymeacoffee.com/yu000japan"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a pizza&emoji=🍕&slug=yu000japan&button_colour=FFDD00&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=ffffff" /></a>
