import { IBatchBlock } from '@logseq/libs/dist/LSPlugin.user'
import { t } from "logseq-l10n"

//end
export function insertSampleTemplates(uuid): Promise<void> {
  return new Promise((resolve) => {
    const batch: IBatchBlock[] = [
      {
        content: t("### Weekdays and Holidays (Templates)"),
        properties: {
          comment: t("Always turn on Weekdays and holidays (Templates) plugin for execute rendering when journal template is called.\n[English document]") + "(" + t("https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/wiki/English-document") + ")",
        },
        children: [
          {
            content: t("#### Journal: Template Settings"),
            properties: {
              template: "Journal",
              "template-including-parent": "false",
              comment: t("Edit config.edn `:default-templates {:journals \"Journal\"}` When load as journal template, the renderings are executed. During runtime, the block with renderings be removed. A block can have a maximum of seven renderings, but if the weekdays overlap, only one of them will be executed."),
              "background-color": "yellow",
            },
            children: [
              {
                content: "{{renderer :Weekdays, Main-Template, Mon&Tue&Wed&Thu&Fri}}\n{{renderer :Weekdays, Weekends-Template, Sat&Sun}}"
              },
              {
                content: ""
              }
            ],
          },
          {
            content: t("#### Main-Template > "),
            properties: {
              template: "Main-Template",
              "template-including-parent": "false",
              "background-color": "gray",
            },
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
              }, {
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
          }, {
            content: t("#### Sub-Template > "),
            properties: {
              template: "Sub-Template",
              "template-including-parent": "false",
              "background-color": "gray",
            },
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
              }, {
                content: `#### PM`,
                children: [
                  {
                    content: ``,
                  }, {
                    content: ``,
                  },
                ],
              },
            ]
          }, {
            content: t("#### Weekends-Template > "),
            properties: {
              template: "Weekends-Template",
              "template-including-parent": "false",
              "background-color": "gray",
            },
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
              }, {
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
          }, {
            content: t("#### Holidays-Template > "),
            properties: {
              template: "Holidays-Template",
              "template-including-parent": "false",
              "background-color": "gray",
            },
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
              }, {
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
    ]
    logseq.Editor.insertBatchBlock(uuid, batch)
    resolve()
  })
}//insertTemplateBlock


export async function insertTemplateBlock(blockUuid, template: string) {
  // @logseq/lib v0.0.15導入
  // ブロックではなく、テンプレートとして読み込む。SmartBlocksなどのプラグインも動作するようになる。Dynamic variablesも動作する
  //https://github.com/logseq/logseq/blob/a5e31128a6366df002488203406684f78d80c7e3/libs/src/LSPlugin.ts#L449


  logseq.Editor.updateBlock(blockUuid, "")
  const exist = await logseq.App.existTemplate(template) as boolean
  if (exist === true) {
    logseq.UI.showMsg(`${t("Insert template")} "${template}"`, "success", { timeout: 2200 })
    const newBlock = await logseq.Editor.insertBlock(blockUuid, "", { sibling: true, isPageBlock: true, before: true, focus: false })
    if (newBlock) {
      logseq.App.insertTemplate(newBlock.uuid, template).finally(() => {
        console.log(`Render insert template ${template}`)
        logseq.Editor.removeBlock(blockUuid)
        setTimeout(() => logseq.Editor.exitEditingMode(), 100)
      })
    }
  } else {
    logseq.UI.showMsg(t("The Template not found."), "warming", { timeout: 5000 })
    console.warn(`Template "${template}" not found.`)
  }


}

