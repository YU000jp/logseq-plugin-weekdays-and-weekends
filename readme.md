# Logseq Plugin: Weekdays and Holidays (Templates)

- Plugin for switching journal templates for weekdays and weekends, public holidays. Possible to set templates for each day of the week.

> Development stage 👷🚧

[![latest release version](https://img.shields.io/github/v/release/YU000jp/logseq-plugin-weekdays-and-weekends)](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/releases)
[![License](https://img.shields.io/github/license/YU000jp/logseq-plugin-weekdays-and-weekends?color=blue)](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/LICENSE)
[![Downloads](https://img.shields.io/github/downloads/YU000jp/logseq-plugin-weekdays-and-weekends/total.svg)](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/releases)

## Demo

![someautomaticmarkdownlink (13)](https://user-images.githubusercontent.com/111847207/235460001-a731d9eb-8b45-4c55-8789-d73e24bb655a.gif)

## Function

- On pages other than journal, rendering waits. When loaded as today's journal, the designated template is reflected. And, as usual, the template can be called manually at any time.

Offer four templates:

1. Weekdays templates (possible to specify conditions using multiple templates and change days of a week)
1. Main/Sub templates
1. weekends template
1. Public holiday template

## Setup 🖥️

<details><summary>Summary</summary>

1. Edit config.edn and replace (Press [---] on the top right toolbar to open [Settings])

```text
 :default-templates
{:journals "Journal"}
```

![スクリーンショット 2023-05-01 225619](https://user-images.githubusercontent.com/111847207/235462277-dd42adda-713c-4d21-abb6-5c25e585ab2c.png)
 > Be found around the 20th line.

2. Build templates

- Open templates page or any. Execute a slash command. `Create sample for weekdays renderer`
  
![image](https://user-images.githubusercontent.com/111847207/235462948-8a18ad6e-c0e1-4839-a7b2-a4b436cfc6b3.png)
> In the sample, 4 templates be created.

3. Edit Templates

- Contents of templates is free spaces and open to interpretation by you. By right-clicking on the bullet, a context menu will appear, allowing you to select the color and font size.

4. Perform check

- As usual, possible to either wait for the date to change or delete the current day's journal. To delete it, right-click on the date title and select "Delete" from the context menu. Make a copy in advance, as current journal page be deleted.

5. Change to specific days of the week (Option)

   Open the page that was built. Click on the area to the right of WAITING labels to edit the renderer.
   1. Specify days of week in 3 letters like "Sun" and separate them with an "&". And possible to select 'All'. This is for bundling templates together.
   1. It is possible to replicate renderers, not limited to Template-A and Template-B. And manually change the names of Template-A and Template-B as they are just names of the templates. A block can have a maximum of seven renderings, but if the weekdays overlap, only one of them will be executed. During runtime, the block with renderings be removed.

 ![someautomaticmarkdownlink (14)](https://user-images.githubusercontent.com/111847207/235461336-8e7db7bf-a29a-4796-8599-5ecf659b8d67.gif)

 6. Open plugin settings
 
- By default, two options are turned off.
 
![image](https://user-images.githubusercontent.com/111847207/235469056-e5fd49e0-9b3d-4af9-bff9-5eabcd93c399.png)
 
</details>

## Questions

- Always turn on this plugin for execute rendering when journal template is called. For Logseq mobile version, please manually call the template.
- At the moment, integration with existing plugins such as smart-blocks is not possible. We plan to address this in future updates.
- In the current version, standard Dynamic variables are not supported.
- For those who live every day like a holiday, this plugin may not be necessary.🤣

## Plugin Changes Due to @logseq/libs Upgrade v0.0.15 (Unpublished)

- This plugin utilizes the @logseq/libs plugin API library. Currently, the older version of the SDK is unable to load templates as templates, so they are being loaded simply as block trees. However, there are plans to provide the functionality to load templates as templates in the future. This will enable integration with existing plugins such as smart-blocks. There is a possibility that changes in usage and the need for resetting configuration items may occur.

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

- [@logseq/libs](https://logseq.github.io/plugins/) v.0.0.14
- [date-holidays](https://github.com/commenthol/date-holidays)
- [SweetAlert2](https://sweetalert2.github.io/)

### Logseq Plugin

Not Support - **TODO:**
- [stdword/ Full House Templates](https://github.com/stdword/logseq13-full-house-plugin)
- [hkgnp/ powerblocks](https://github.com/hkgnp/logseq-powerblocks-plugin)
- [sawhney17/ SmartBlocks](https://github.com/sawhney17/logseq-smartblocks)

### Icon

- [icooon-rainbow.com](https://icon-rainbow.com/%e3%82%a4%e3%83%93%e3%82%ad%e3%82%92%e3%81%8b%e3%81%84%e3%81%a6%e5%af%9d%e3%81%a6%e3%82%8b%e4%ba%ba%e3%81%ae%e3%82%a2%e3%82%a4%e3%82%b3%e3%83%b3%e7%b4%a0%e6%9d%90/)
