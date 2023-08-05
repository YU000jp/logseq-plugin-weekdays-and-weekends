import { IBatchBlock } from '@logseq/libs/dist/LSPlugin.user';
import { t } from "logseq-l10n";

//end
export function insertSampleTemplates(uuid): Promise<void> {
  return new Promise((resolve) => {
    const batch: IBatchBlock[] = [
      {
        content: "### Weekdays and Holidays (Templates)",
        properties: {
          comment: "Always turn on Weekdays and holidays (Templates) plugin for execute rendering when journal template is called.\n[English document](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/wiki/English-document) / [日本語ドキュメント](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/wiki/%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88)",
        },
        children: [
          {
            content: t("#### Journal: Template Settings"),
            properties: {
              template: "Journal",
              "template-including-parent": "false",
              comment: 'Edit config.edn `:default-templates {:journals "Journal"}` When load as journal template, the renderings are executed. During runtime, the block with renderings be removed. A block can have a maximum of seven renderings, but if the weekdays overlap, only one of them will be executed.',
              "background-color": "yellow",
            },
            children: [
              {
                content: "{{renderer :Weekdays, Main-Template, Mon&Tue&Wed&Thu&Fri}}\n{{renderer :Weekdays, Weekends-Template, Sat&Sun}}"
              },
            ],
          },
          {
            content: t("#### Main-Template:"),
            properties: {
              template: "Main-Template",
              "template-including-parent": "false",
              Comment: " [default] Mon&Tue&Wed&Thu&Fri",
              "background-color": "gray",
            },
            children: [
              {
                content: `### Weekdays (Main)`,
                children: [
                  {
                    content: `#### AM`,
                    children: [
                      {
                        content: ``,
                      }, {
                        content: ``,
                      },
                    ],
                  },
                  {
                    content: `#### PM`,
                    children: [
                      {
                        content: ``,
                      }, {
                        content: ``,
                      },
                    ],
                  },
                ],
              },
            ],
          }, {
            content: t("#### Sub-Template:"),
            properties: {
              template: "Sub-Template",
              "template-including-parent": "false",
              Comment: "switch Main/Sub templates for a week (to plugin settings)",
              "background-color": "gray",
            },
            children: [
              {
                content: `### Weekdays (Sub)`,
                children: [
                  {
                    content: `#### AM`,
                    children: [
                      {
                        content: ``,
                      }, {
                        content: ``,
                      },
                    ],
                  },
                  {
                    content: `#### PM`,
                    children: [
                      {
                        content: ``,
                      }, {
                        content: ``,
                      },
                    ],
                  },
                ],
              },
            ]
          }, {
            content: t("#### Weekends-Template:"),
            properties: {
              template: "Weekends-Template",
              "template-including-parent": "false",
              Comment: " [default] Sat&Sun",
              "background-color": "gray",
            },
            children: [
              {
                content: `### Weekends`,
                children: [
                  {
                    content: `#### AM`,
                    children: [
                      {
                        content: ``,
                      }, {
                        content: ``,
                      },
                    ],
                  },
                  {
                    content: `#### PM`,
                    children: [
                      {
                        content: ``,
                      }, {
                        content: ``,
                      },
                    ],
                  },
                ],
              },
            ],
          }, {
            content: t("#### Holidays-Template:"),
            properties: {
              template: "Holidays-Template",
              "template-including-parent": "false",
              Comment: "Alert holidays (to plugin settings)",
              "background-color": "gray",
            },
            children: [
              {
                content: `### Holidays`,
                children: [
                  {
                    content: `#### AM`,
                    children: [
                      {
                        content: ``,
                      }, {
                        content: ``,
                      },
                    ],
                  },
                  {
                    content: `#### PM`,
                    children: [
                      {
                        content: ``,
                      }, {
                        content: ``,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
    logseq.Editor.insertBatchBlock(uuid, batch);
    resolve();
  });
}//insertTemplateBlock


export async function insertTemplateBlock(blockUuid, template: string) {
  // @logseq/lib v0.0.15導入
  // ブロックではなく、テンプレートとして読み込む。SmartBlocksなどのプラグインも動作するようになる。Dynamic variablesも動作する
  //https://github.com/logseq/logseq/blob/a5e31128a6366df002488203406684f78d80c7e3/libs/src/LSPlugin.ts#L449
  logseq.Editor.updateBlock(blockUuid, "");
  const exist = await logseq.App.existTemplate(template) as boolean;
  if (exist === true) {
    logseq.UI.showMsg(`Insert ${template}`, "success", { timeout: 1800 });
    const newBlock = await logseq.Editor.insertBlock(blockUuid, "", { sibling: true, isPageBlock: true, before: true, focus: false });
    if (newBlock) {
      logseq.App.insertTemplate(newBlock.uuid, template).finally(() => {
        console.log(`Render insert template ${template}`);
        logseq.Editor.removeBlock(blockUuid);
        setTimeout(() => logseq.Editor.exitEditingMode(), 100);
      });
    }
  } else {
    logseq.UI.showMsg(`Template ${template} not found.`, "warming", { timeout: 5000 });
    console.warn(`Template ${template} not found.`);
  }
}

