[日本語](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/blob/main/readme_ja.md)

# Logseq Plugin: *More journal templates* 🛌

- A plugin for switching daily templates by setting templates for each day of the week.

[![latest release version](https://img.shields.io/github/v/release/YU000jp/logseq-plugin-weekdays-and-weekends)](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/releases)
[![License](https://img.shields.io/github/license/YU000jp/logseq-plugin-weekdays-and-weekends?color=blue)](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/LICENSE)
[![Downloads](https://img.shields.io/github/downloads/YU000jp/logseq-plugin-weekdays-and-weekends/total.svg)](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/releases) Published 2023/05/04

---

## Features

- A mechanism for calling the functions of this plugin is achieved by placing what is called renderings in journal template.
- On pages other than journal, rendering waits. When loaded as today's journal, the designated template is reflected. And, as usual, the template can be called manually at any time.

#### Offer 4 templates:

1. Weekdays template `Main-Template`
1. Main/Sub template `Sub-Template`
1. weekends template `Weekends-Template`
1. Public holiday template `Holidays-Template`
> It is possible to specify conditions using multiple templates and change days of a week.

#### Offer 2 options:

3. Private holiday (or annual leave)
4. Working on holidays

---

## Getting Started

### Install from Logseq Marketplace

- Press [`---`] on the top right toolbar to open [`Plugins`]. Select `Marketplace`. Type `more` in the search field, select it from the search results and install.

### Usage

- In this plugin, initial setup by the user is required once.
   > By default, several items are set to "off" in the initial configuration.

#### Setup 🖥️

- [English document](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/wiki/English-document)📝
- [日本語ドキュメント](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/wiki/%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88)📝

---

## Questions

- Always turn on this plugin for execute rendering when journal template is called. For Logseq mobile version, please manually call the template.
- Integration with existing [Full House Templates](https://github.com/stdword/logseq13-full-house-plugin), [powerblocks](https://github.com/hkgnp/logseq-powerblocks-plugin), and [SmartBlocks](https://github.com/sawhney17/logseq-smartblocks) is possible.
- Support [Dynamic variables](https://mschmidtkorth.github.io/logseq-msk-docs/#/page/dynamic%20variables) of Logseq standard.
- It is possible to also place the renderer as a journal template in other graphs, but please note that the plugin settings are shared across all graphs.

---

## Links

- [templates (Logseq documents)](https://docs.logseq.com/#/page/templates)
- [@Ramses Oudt/ How to Set Up an Automated Daily Template in Logseq](https://thinkstack.club/how-to-set-up-an-automated-daily-template-in-logseq/)

### Logseq Plugin

- [Side Block plugin](https://github.com/YU000jp/logseq-plugin-side-block)
  - Place child blocks next to the parent block.

#### Template Gallery

- [@dangermccann/ Template Gallery plugin](https://github.com/dangermccann/logseq-template-gallery)

#### Rendering

- [@stdword/ Full House Templates plugin](https://github.com/stdword/logseq13-full-house-plugin)
- [@hkgnp/ powerblocks plugin](https://github.com/hkgnp/logseq-powerblocks-plugin)
- [@sawhney17/ SmartBlocks plugin](https://github.com/sawhney17/logseq-smartblocks)

---

## Showcase / Questions / Ideas / Help

> Go to the [discussion](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/discussions) tab to ask and find this kind of things.

## Prior art & Credit

Library

- [@logseq/libs](https://logseq.github.io/plugins/) v.0.0.15 [@xyhp915](https://github.com/xyhp915)
- [date-holidays](https://github.com/commenthol/date-holidays)
  > This plugin is capable of corresponding to holidays in various countries around the world, thanks to [date-holidays](https://github.com/commenthol/date-holidays) library.
- [logseq-L10N](https://github.com/sethyuan/logseq-l10n)

Icon > [icooon-rainbow.com](https://icon-rainbow.com/%e3%82%a4%e3%83%93%e3%82%ad%e3%82%92%e3%81%8b%e3%81%84%e3%81%a6%e5%af%9d%e3%81%a6%e3%82%8b%e4%ba%ba%e3%81%ae%e3%82%a2%e3%82%a4%e3%82%b3%e3%83%b3%e7%b4%a0%e6%9d%90/)

Author > [@YU000jp](https://github.com/YU000jp)

<a href="https://www.buymeacoffee.com/yu000japan" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-violet.png" alt="🍌Buy Me A Coffee" style="height: 42px;width: 152px" ></a>
