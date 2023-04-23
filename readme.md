# Logseq Plugin: Weekdays and Weekends

- Plugin for sorting journal templates into weekdays and weekends.

> Development stage 👷🚧

[![latest release version](https://img.shields.io/github/v/release/YU000jp/logseq-plugin-weekdays-and-weekends)](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/releases)
[![License](https://img.shields.io/github/license/YU000jp/logseq-plugin-weekdays-and-weekends?color=blue)](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/LICENSE)
[![Downloads](https://img.shields.io/github/downloads/YU000jp/logseq-plugin-weekdays-and-weekends/total.svg)](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/releases)

## Demo

![someautomaticmarkdownlink (9)](https://user-images.githubusercontent.com/111847207/233831285-ee263e62-31e4-4d89-8403-7b6e8ae57dc3.gif)

## Feature

- When rendering is executed, the template is reflected. Like regular templates, it can also be called manually at any time.

## Setup

1. Edit config.edn and replace (Press [---] on the top right toolbar to open [Settings])

```
 :default-templates
{:journals "Journal"}
```

![image](https://user-images.githubusercontent.com/111847207/233831919-33624f5f-2012-4df7-ab1d-d5f4e0f3cd1a.png)

2. Build templates
  
- Open templates page or any. Execute a slash command. `Create sample for weekdays renderer`
  
![image](https://user-images.githubusercontent.com/111847207/233832456-2faba8a4-fede-4caf-8af8-439ff4684ced.png)

3. Edit Template A and B

- Contents of both Template A and Template B is free spaces and open to interpretation by you.

## Questions

- Always turn on this plugin to execute rendering when the journal template is called. For Logseq mobile version, please manually call the template.
- We cannot create a template specifically for holidays at this time. There is a plan to allow for holiday templates to be set up by excluding holidays, but it will take some time to implement.

## Install from Marketplace (Coming👷🚧)

- Press [---] on the top right toolbar to open [Plugins]
- Select marketplace
- Type 'week' in the search field, select it from the search results and install

## Other Logseq plugins (My products)

- [Sticky Popup](https://github.com/YU000jp/logseq-plugin-sticky-popup)
- [SomeMenuExtender](https://github.com/YU000jp/logseq-plugin-some-menu-extender)
- [Column Layout](https://github.com/YU000jp/Logseq-column-Layout)
- [Panel Coloring](https://github.com/YU000jp/logseq-plugin-panel-coloring)
- [Page-tags and Hierarchy](https://github.com/YU000jp/logseq-page-tags-and-hierarchy)
- [Rakuten-books](https://github.com/YU000jp/logseq-plugin-rakuten-books) (Only for Japanese site)
- [booklog-jp-import](https://github.com/YU000jp/logseq-plugin-booklog-jp-import) (Only for Japanese site)

## Prior art & Credit

### Library

- [@logseq/libs](https://logseq.github.io/plugins/)

### Logseq Plugin

- [stdword/ Full House Templates](https://github.com/stdword/logseq13-full-house-plugin)
- [hkgnp/ powerblocks](https://github.com/hkgnp/logseq-powerblocks-plugin)
- [sawhney17/ SmartBlocks](https://github.com/sawhney17/logseq-smartblocks)

### Icon

- [icooon-mono.com](https://icooon-mono.com/)
