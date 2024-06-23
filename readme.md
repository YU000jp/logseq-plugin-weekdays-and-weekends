# Logseq Plugin: *More journal templates* 🛌

- A plugin for rendering on the journal template and using templates for each day of the week.

<div align="right">

[English](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends)/[日本語](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/blob/main/readme_ja.md) [![latest release version](https://img.shields.io/github/v/release/YU000jp/logseq-plugin-weekdays-and-weekends)](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/releases)
[![License](https://img.shields.io/github/license/YU000jp/logseq-plugin-weekdays-and-weekends?color=blue)](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/LICENSE)
[![Downloads](https://img.shields.io/github/downloads/YU000jp/logseq-plugin-weekdays-and-weekends/total.svg)](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/releases) Published 20230504 <a href="https://www.buymeacoffee.com/yu000japan"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a pizza&emoji=🍕&slug=yu000japan&button_colour=FFDD00&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=ffffff" /></a>
</div>

---

## Overview

- In the journal template block, place the code for the "renderer" call.
- The renderer is executed when the journal template is called. The template is then applied according to the conditions.

- Rendering the journal template
  1. templates for each day of the week
     - Monday template, Tuesday template .... Apply the template according to the day of the week, such as.

### Optional functions

- Configuration items in the plugin settings.
  - It is possible to add modification operations at the time of rendering.
  1. holiday settings.
     > Select whether to use the template for holidays when they are public holidays.
  1. bi-weekly function
     > "On a given day of the week, select a template for that week" operation can be performed.
  1. setting up holiday workdays and personal leave (annual leave)
     > 'On a specific day of the week, select a template' operation

---

## Getting Started

### Install from Logseq Marketplace

- Press [`---`] on the top right toolbar to open [`Plugins`]. Select `Marketplace`. Type `more` in the search field, select it from the search results and install.

### Usage

- In this plugin, initial setup by the user is required once.
   > By default, several items are set to "off" in the initial configuration in the plugin settings.

- *[Setup document (English)](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/wiki/English-document)*

---

## Showcase / Questions / Ideas / Help

> Go to the [Discussions](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/discussions) tab to ask and find this kind of things.

- Always turn on this plugin for execute rendering when journal template is called.
   > For Logseq mobile version, please manually call the template.
- Note: The plugin settings are shared across all graphs.
- In Logseq core, If the date is before today, the journal template will not be loaded and rendering will not be possible.
  - One of the following solutions is available.
    1. Use "Completion of journal template" feature of [Default Template plugin](https://github.com/YU000jp/logseq-plugin-default-template)
    1. Manually type the slash command `/template` as usual and select `Journal`.
- Integration with existing [Full House Templates plugin](https://github.com/stdword/logseq13-full-house-plugin), [powerblocks plugin](https://github.com/hkgnp/logseq-powerblocks-plugin), [SmartBlocks plugin](https://github.com/sawhney17/logseq-smartblocks), and [Side Block plugin](https://github.com/YU000jp/logseq-plugin-side-block) , and [Dynamic variables](https://mschmidtkorth.github.io/logseq-msk-docs/#/page/dynamic%20variables) of Logseq standard is possible.
  > Template gallery: [Template Gallery plugin](https://github.com/dangermccann/logseq-template-gallery)
- Document link
  1. [templates (Logseq documents)](https://docs.logseq.com/#/page/templates)

## Prior art & Credit

- Library
   1. [@logseq/libs](https://logseq.github.io/plugins/) v.0.0.15 [@xyhp915](https://github.com/xyhp915)
   1. [date-holidays](https://github.com/commenthol/date-holidays)
      > This plugin is capable of corresponding to holidays in various countries around the world, thanks to [date-holidays](https://github.com/commenthol/date-holidays) library.
   1. [logseq-L10N](https://github.com/sethyuan/logseq-l10n)
- Icon > [icooon-rainbow.com](https://icon-rainbow.com/%e3%82%a4%e3%83%93%e3%82%ad%e3%82%92%e3%81%8b%e3%81%84%e3%81%a6%e5%af%9d%e3%81%a6%e3%82%8b%e4%ba%ba%e3%81%ae%e3%82%a2%e3%82%a4%e3%82%b3%e3%83%b3%e7%b4%a0%e6%9d%90/)
- Author > [@YU000jp](https://github.com/YU000jp)
