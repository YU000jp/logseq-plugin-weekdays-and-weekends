# Logseq Plugin: Weekdays and Holidays (Templates) 🛌

- 平日と土日、祝日の日誌テンプレートを切り替えるためのプラグイン。曜日ごとにテンプレートを設定可能。

[](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/releases)![latest release version](https://img.shields.io/github/v/release/YU000jp/logseq-plugin-weekdays-and-weekends) [](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/LICENSE)![License](https://img.shields.io/github/license/YU000jp/logseq-plugin-weekdays-and-weekends?color=blue) [](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/releases)![Downloads](https://img.shields.io/github/downloads/YU000jp/logseq-plugin-weekdays-and-weekends/total.svg)
 公開日:2023/05/04 /
 [日本語ドキュメント](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/wiki/%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88)📝

<hr/>

## 機能説明

- 日誌テンプレートにレンダリングと呼ぶものを置きます。それによってこのプラグインの機能が呼び出されます。
- 日誌以外のページでは、そのレンダリングが待機します。今日の日誌が空で呼び出されたときに、指定したテンプレートが反映されます。

4つのテンプレートを用意:

1. 平日のテンプレート `Main-Template`
2. サブのテンプレート `Sub-Template`
3. 週末のテンプレート `Weekends-Template`
4. 祝日のテンプレート `Holidays-Template`

> 複数のテンプレートによる条件指定や曜日変更が可能
- 個人休暇(年休)、休日出勤日を指定可能 (それぞれ最大6日)

## デモ

![image](https://user-images.githubusercontent.com/111847207/235460001-a731d9eb-8b45-4c55-8789-d73e24bb655a.gif)

<hr/>

- プラグインを使用するには、ユーザーによる初期設定が必要です。またデフォルトでは、いくつかの機能がオフになっています。プラグインの設定画面を開いて、設定をオンにしてください。

## 初期設定

- [Engilsh document](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/wiki/English-document)📝
- [日本語ドキュメント](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/wiki/%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88)📝

## Q&amp;A

- 日誌 テンプレートが呼び出されたときにレンダリングを実行する必要があります。常にこのプラグインをオンにしてください。 Logseq モバイル版の場合は、手動でテンプレートを呼び出してください。
- 既存の[Full House Templates](https://github.com/stdword/logseq13-full-house-plugin)、[powerblocks](https://github.com/hkgnp/logseq-powerblocks-plugin)、[SmartBlocks](https://github.com/sawhney17/logseq-smartblocks)との統合が可能です。
- Logseq標準の動的変数をサポートします。

## Logseqマーケットプレースからインストール

- 右上にあるツールバーの[`---`]を押して[`Plugins`]を選択する
- マーケットプレースを選択する
- 検索欄に`week`と入力。<br>検索結果から探してインストール。

![image](https://user-images.githubusercontent.com/111847207/236143556-6404ec21-5e5f-457f-9193-f89f00330ff0.png)

