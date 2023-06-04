# Logseq Plugin: Weekdays and Holidays (Templates) 🛌

- Plugin for switching journal templates for weekdays and weekends, public holidays. It is possible to set templates for each day of the week.  Also, support private holidays (or annual leave) max 6 dates.
> This plugin is capable of corresponding to holidays in various countries around the world, thanks to [date-holidays](https://github.com/commenthol/date-holidays) library.

[![latest release version](https://img.shields.io/github/v/release/YU000jp/logseq-plugin-weekdays-and-weekends)](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/releases)
[![License](https://img.shields.io/github/license/YU000jp/logseq-plugin-weekdays-and-weekends?color=blue)](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/LICENSE)
[![Downloads](https://img.shields.io/github/downloads/YU000jp/logseq-plugin-weekdays-and-weekends/total.svg)](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/releases) Published 2023/05/04 ([日本語README](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/blob/main/readme_ja.md) / [ドキュメント](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/wiki/%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88)📝)
 
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

## Demo

   ![image](https://user-images.githubusercontent.com/111847207/235460001-a731d9eb-8b45-4c55-8789-d73e24bb655a.gif)

---

## Getting Started

### Install from Logseq Marketplace

- Press [`---`] on the top right toolbar to open [`Plugins`]
- Select `Marketplace`
- Type `week` in the search field, select it from the search results and install

   ![image](https://user-images.githubusercontent.com/111847207/236143556-6404ec21-5e5f-457f-9193-f89f00330ff0.png)

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

#### Manual:

- [templates (Logseq documents)](https://docs.logseq.com/#/page/templates)
- [Ramses Oudt / How to Set Up an Automated Daily Template in Logseq](https://thinkstack.club/how-to-set-up-an-automated-daily-template-in-logseq/)

#### Publish template:

- [Tempate Gallery plugin](https://github.com/dangermccann/logseq-template-gallery)

---

## Showcase / Questions / Ideas / Help

> Go to the [discussion](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/discussions) tab to ask and find this kind of things.

## Author

- GitHub: [YU000jp](https://github.com/YU000jp)

## Prior art & Credit

### Library

- [@logseq/libs](https://logseq.github.io/plugins/) v.0.0.15 (Thanks! [xyhp915](https://github.com/xyhp915))
- [date-holidays](https://github.com/commenthol/date-holidays)
- [SweetAlert2](https://sweetalert2.github.io/)
- [logseq-L10N](https://github.com/sethyuan/logseq-l10n)

### Logseq Plugin

- [stdword / Full House Templates](https://github.com/stdword/logseq13-full-house-plugin)
- [hkgnp / powerblocks](https://github.com/hkgnp/logseq-powerblocks-plugin)
- [sawhney17 / SmartBlocks](https://github.com/sawhney17/logseq-smartblocks)

### Icon

- [icooon-rainbow.com](https://icon-rainbow.com/%e3%82%a4%e3%83%93%e3%82%ad%e3%82%92%e3%81%8b%e3%81%84%e3%81%a6%e5%af%9d%e3%81%a6%e3%82%8b%e4%ba%ba%e3%81%ae%e3%82%a2%e3%82%a4%e3%82%b3%e3%83%b3%e7%b4%a0%e6%9d%90/)

---

<a href="https://www.buymeacoffee.com/yu000japan" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-violet.png" alt="🍌Buy Me A Coffee" style="height: 42px;width: 152px" ></a>
