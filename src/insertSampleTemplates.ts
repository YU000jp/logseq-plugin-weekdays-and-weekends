import { IBatchBlock } from '@logseq/libs/dist/LSPlugin.user'
import { t } from "logseq-l10n"


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

