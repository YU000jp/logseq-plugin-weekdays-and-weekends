# Logseq プラグイン: More journal templates 🛌

- 日誌テンプレートをレンダリングして、曜日ごとにテンプレートを設定するためのプラグインです。

> [!NOTE]
>このプラグインはLogseq DBモデルで動作します。(mdグラフ限定)

<div align="right">

[English](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends)/[日本語](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/blob/main/readme_ja.md) [![latest release version](https://img.shields.io/github/v/release/YU000jp/logseq-plugin-weekdays-and-weekends)](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/releases)
[![License](https://img.shields.io/github/license/YU000jp/logseq-plugin-weekdays-and-weekends?color=blue)](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/LICENSE)
[![Downloads](https://img.shields.io/github/downloads/YU000jp/logseq-plugin-weekdays-and-weekends/total.svg)](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/releases) Published 20230504 <a href="https://www.buymeacoffee.com/yu000japan"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a pizza&emoji=🍕&slug=yu000japan&button_colour=FFDD00&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=ffffff" /></a>
</div>

---

## 概要

- 日誌テンプレート内の行に、「レンダラー」という呼び出しのためのコードを配置します。
- 日誌テンプレートが呼び出されたときに、レンダラーが実行され、スイッチングがおこなわれ、テンプレートが適用されます。

- 日誌テンプレートのレンダリング
  1. 曜日ごとのテンプレート
     - 月曜日のテンプレート、火曜日のテンプレート....など曜日ごとにテンプレートを作成することができます。

### オプション機能

- プラグイン設定での設定項目
  - レンダリングのタイミングで、修正操作を加えることが可能です。
  1. 祝日の設定
     > 祝日のときに、祝日用のテンプレートを使うか選択できます。
  - ⚠️**Logseq ファイルベース モデルのみ**
    1. 隔週機能
       > 「指定した曜日に、その1週間のテンプレートを選択する」操作ができます。
    1. 休日出勤日、個人休暇(年休)の設定
       > 「特定の日に、テンプレートを選択する」操作ができます。

---

### Logseqマーケットプレースからインストール

- 右上にあるツールバーの[`---`]を押して[`Plugins`]を開き、マーケットプレースを選択。検索欄に`more`と入力してください。

## 初期設定

- プラグインを使用するには、ユーザーによる初期設定が必要です。
  > デフォルトでは、いくつかの機能もオフになっています。

- *[セットアップ ドキュメント (日本語)](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/wiki/%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88)*

## 備考

- 日誌テンプレートが呼び出されたときに、レンダリングが実行されるには、プラグインがオンの状態である必要があります。
  > Logseq モバイル版の場合は、手動でテンプレートを呼び出してください。
- プラグインの設定項目に関しては、グラフ毎ではなく全てのグラフ共通になっています。ご注意してください。
- 今日より前の日付の場合は、日誌テンプレートが適用されないためレンダリングがおこなえません。
  - 次のいずれかの解決方法があります。
    1. [Default Template プラグイン](https://github.com/YU000jp/logseq-plugin-default-template)のジャーナルテンプレート補完機能を使う
    1. 手動にてスラッシュコマンド `/template`を打ち、ジャーナルテンプレートを選択する
- 既存の各プラグイン [Full House Templates](https://github.com/stdword/logseq13-full-house-plugin)、[powerblocks](https://github.com/hkgnp/logseq-powerblocks-plugin)、[SmartBlocks](https://github.com/sawhney17/logseq-smartblocks)、[Side Block](https://github.com/YU000jp/logseq-plugin-side-block) との統合が可能です。Logseqの動的変数も動作します。

## クレジット

- アイコン > [icooon-rainbow.com](https://icon-rainbow.com/%e3%82%a4%e3%83%93%e3%82%ad%e3%82%92%e3%81%8b%e3%81%84%e3%81%a6%e5%af%9d%e3%81%a6%e3%82%8b%e4%ba%ba%e3%81%ae%e3%82%a2%e3%82%a4%e3%82%b3%e3%83%b3%e7%b4%a0%e6%9d%90/)
- 製作者 > [@YU000jp](https://github.com/YU000jp)
