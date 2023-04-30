# Logseq Plugin: Weekdays and Weekends (Templates)

- Plugin for switching journal templates for weekdays and weekends. And possible to tie templates together.

> Development stage 👷🚧

[![latest release version](https://img.shields.io/github/v/release/YU000jp/logseq-plugin-weekdays-and-weekends)](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/releases)
[![License](https://img.shields.io/github/license/YU000jp/logseq-plugin-weekdays-and-weekends?color=blue)](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/LICENSE)
[![Downloads](https://img.shields.io/github/downloads/YU000jp/logseq-plugin-weekdays-and-weekends/total.svg)](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/releases)

## Demo

![someautomaticmarkdownlink (9)](https://user-images.githubusercontent.com/111847207/233831285-ee263e62-31e4-4d89-8403-7b6e8ae57dc3.gif)

## Function

- On pages other than journal, rendering waits. When loaded as today's journal, the designated template is reflected. And, as usual, the template can be called manually at any time.

## Setup 🖥️

<details><summary>Summary</summary>

1. Edit config.edn and replace (Press [---] on the top right toolbar to open [Settings])

```text
 :default-templates
{:journals "Journal"}
```

![image](https://user-images.githubusercontent.com/111847207/233831919-33624f5f-2012-4df7-ab1d-d5f4e0f3cd1a.png)
 > Be found around the 20th line.

2. Build templates

- Open templates page or any. Execute a slash command. `Create sample for weekdays renderer`
  
![image](https://user-images.githubusercontent.com/111847207/233832456-2faba8a4-fede-4caf-8af8-439ff4684ced.png)
> In the sample, both Template-A and Template-B will be created.

3. Edit Template A and B

- Contents of both Template-A and Template-B is free spaces and open to interpretation by you. By right-clicking on the bullet, a context menu will appear, allowing you to select the color and font size.

4. Perform check

- As usual, possible to either wait for the date to change or delete the current day's journal. To delete it, right-click on the date title and select "Delete" from the context menu.

5. Change to specific days of the week (Option)

   Open the page that was built. Click on the area to the right of WAITING labels to edit the renderer.
   1. Specify days of week in 3 letters like "Sun" and separate them with an "&". And possible to select 'All'. This is for bundling templates together.
   1. It is possible to replicate renderers, not limited to Template-A and Template-B. And manually change the names of Template-A and Template-B as they are just names of the templates. A block can have a maximum of seven renderings, but if the weekdays overlap, only one of them will be executed. During runtime, the block with renderings be removed.

 ![someautomaticmarkdownlink (12)](https://user-images.githubusercontent.com/111847207/233835850-e9cebb43-fc8a-4a9e-a13d-5a32dd06f38f.gif)

</details>

## Questions

- Always turn on this plugin to execute rendering when the journal template is called. For Logseq mobile version, please manually call the template.
- We cannot create a template specifically for holidays at this time. There is a plan to allow for holiday templates to be set up by excluding holidays, but it will take some time to implement. I'm sure that by then, the name of this plugin will have changed to holidays, jokingly of course.☺️
- At the moment, integration with existing plugins such as smart-blocks is not possible. We plan to address this in future updates.

## Plugin Changes Due to @logseq/libs Upgrade

- This plugin utilizes the @logseq/libs plugin API library. Due to the recent release of the latest version of the library, v0.0.15, breaking changes may be implemented in this plugin. This will enable integration with existing plugins such as smart-blocks. There is a possibility that changes in usage and the need for resetting configuration items may occur.

## Install from Marketplace (Coming👷🚧)

- Press [---] on the top right toolbar to open [Plugins]
- Select marketplace
- Type 'week' in the search field, select it from the search results and install

## Link

- [Ramses Oudt/ How to Set Up an Automated Daily Template in Logseq](https://thinkstack.club/how-to-set-up-an-automated-daily-template-in-logseq/)

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

Not Support - **TODO:**
- [stdword/ Full House Templates](https://github.com/stdword/logseq13-full-house-plugin)
- [hkgnp/ powerblocks](https://github.com/hkgnp/logseq-powerblocks-plugin)
- [sawhney17/ SmartBlocks](https://github.com/sawhney17/logseq-smartblocks)

### Icon

- [icooon-rainbow.com](https://icon-rainbow.com/%e3%82%a4%e3%83%93%e3%82%ad%e3%82%92%e3%81%8b%e3%81%84%e3%81%a6%e5%af%9d%e3%81%a6%e3%82%8b%e4%ba%ba%e3%81%ae%e3%82%a2%e3%82%a4%e3%82%b3%e3%83%b3%e7%b4%a0%e6%9d%90/)
