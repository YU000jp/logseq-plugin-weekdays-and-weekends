import { IBatchBlock } from '@logseq/libs/dist/LSPlugin.user'
import { t } from "logseq-l10n"


export function sampleTemplatesWeekdays(uuid): Promise<void> {
  return new Promise((resolve) => {
    const batch: IBatchBlock[] = [
      {
        content: t("### \"More Journal Templates\" plugin >"),
        properties: {
          comment: t("[English document]") + "(" + t("https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/wiki/English-document") + ")",
        },
        children: [
          {
            content: t("#### Journal-template config >"),
            properties: {
              template: "Journal",
              "template-including-parent": "false",
              comment: t("Replace `:default-templates {:journals \"Journal\"}` in the \"config.edn\" file. Rendering occurs when it is loaded as a diary template."),
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
          }, {
            content: t("#### Main-Template > "),
            properties: {
              template: "Main-Template",
              "template-including-parent": "false",
              "background-color": "gray",
            },
            children: [
              {
                content: `#### ${t("AM")}`,
                children: [
                  {
                    content: "",
                  }, {
                    content: "",
                  },
                ],
              }, {
                content: `#### ${t("PM")}`,
                children: [
                  {
                    content: "",
                  }, {
                    content: "",
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
                content: `#### ${t("AM")}`,
                children: [
                  {
                    content: "",
                  }, {
                    content: "",
                  },
                ],
              }, {
                content: `#### ${t("PM")}`,
                children: [
                  {
                    content: "",
                  }, {
                    content: "",
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
                content: `#### ${t("AM")}`,
                children: [
                  {
                    content: "",
                  }, {
                    content: "",
                  },
                ],
              }, {
                content: `#### ${t("PM")}`,
                children: [
                  {
                    content: "",
                  }, {
                    content: "",
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
                content: `#### ${t("AM")}`,
                children: [
                  {
                    content: "",
                  }, {
                    content: "",
                  },
                ],
              }, {
                content: `#### ${t("PM")}`,
                children: [
                  {
                    content: "",
                  }, {
                    content: "",
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
}



export function sampleTemplatesEachDays(uuid): Promise<void> {
  return new Promise((resolve) => {
    const batch: IBatchBlock[] = [
      {
        content: t("### \"More Journal Templates\" plugin >"),
        properties: {
          comment: t("[English document]") + "(" + t("https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/wiki/English-document") + ")",
        },
        children: [
          {
            content: t("#### Journal-template config >"),
            properties: {
              template: "Journal",
              "template-including-parent": "false",
              comment: t("Replace `:default-templates {:journals \"Journal\"}` in the \"config.edn\" file. Rendering occurs when it is loaded as a diary template."),
              "background-color": "yellow",
            },
            children: [
              {
                content: `
{{renderer :Weekdays, Mon-Template, Mon}}
{{renderer :Weekdays, Tue-Template, Tue}}
{{renderer :Weekdays, Wed-Template, Wed}}
{{renderer :Weekdays, Thu-Template, Thu}}
{{renderer :Weekdays, Fri-Template, Fri}}
{{renderer :Weekdays, Sat-Template, Sat}}
{{renderer :Weekdays, Sun-Template, Sun}}
                `
              },
              {
                content: ""
              }
            ],
          }, {
            content: t("#### Mon-Template > "),
            properties: {
              template: "Mon-Template",
              "template-including-parent": "false",
              "background-color": "gray",
            },
            children: [
              {
                content: `#### ${t("AM")}`,
                children: [
                  {
                    content: "",
                  }, {
                    content: "",
                  },
                ],
              }, {
                content: `#### ${t("PM")}`,
                children: [
                  {
                    content: "",
                  }, {
                    content: "",
                  },
                ],
              },
            ],
          }, {
            content: t("#### Tue-Template > "),
            properties: {
              template: "Tue-Template",
              "template-including-parent": "false",
              "background-color": "gray",
            },
            children: [
              {
                content: `#### ${t("AM")}`,
                children: [
                  {
                    content: "",
                  }, {
                    content: "",
                  },
                ],
              }, {
                content: `#### ${t("PM")}`,
                children: [
                  {
                    content: "",
                  }, {
                    content: "",
                  },
                ],
              },
            ]
          }, {
            content: t("#### Wed-Template > "),
            properties: {
              template: "Wed-Template",
              "template-including-parent": "false",
              "background-color": "gray",
            },
            children: [
              {
                content: `#### ${t("AM")}`,
                children: [
                  {
                    content: "",
                  }, {
                    content: "",
                  },
                ],
              }, {
                content: `#### ${t("PM")}`,
                children: [
                  {
                    content: "",
                  }, {
                    content: "",
                  },
                ],
              },
            ]
          }, {
            content: t("#### Thu-Template > "),
            properties: {
              template: "Thu-Template",
              "template-including-parent": "false",
              "background-color": "gray",
            },
            children: [
              {
                content: `#### ${t("AM")}`,
                children: [
                  {
                    content: "",
                  }, {
                    content: "",
                  },
                ],
              }, {
                content: `#### ${t("PM")}`,
                children: [
                  {
                    content: "",
                  }, {
                    content: "",
                  },
                ],
              },
            ]
          }, {
            content: t("#### Fri-Template > "),
            properties: {
              template: "Fri-Template",
              "template-including-parent": "false",
              "background-color": "gray",
            },
            children: [
              {
                content: `#### ${t("AM")}`,
                children: [
                  {
                    content: "",
                  }, {
                    content: "",
                  },
                ],
              }, {
                content: `#### ${t("PM")}`,
                children: [
                  {
                    content: "",
                  }, {
                    content: "",
                  },
                ],
              },
            ]
          }, {
            content: t("#### Sat-Template > "),
            properties: {
              template: "Sat-Template",
              "template-including-parent": "false",
              "background-color": "gray",
            },
            children: [
              {
                content: `#### ${t("AM")}`,
                children: [
                  {
                    content: "",
                  }, {
                    content: "",
                  },
                ],
              }, {
                content: `#### ${t("PM")}`,
                children: [
                  {
                    content: "",
                  }, {
                    content: "",
                  },
                ],
              },
            ]
          }, {
            content: t("#### Sun-Template > "),
            properties: {
              template: "Sun-Template",
              "template-including-parent": "false",
              "background-color": "gray",
            },
            children: [
              {
                content: `#### ${t("AM")}`,
                children: [
                  {
                    content: "",
                  }, {
                    content: "",
                  },
                ],
              }, {
                content: `#### ${t("PM")}`,
                children: [
                  {
                    content: "",
                  }, {
                    content: "",
                  },
                ],
              },
            ]
          }, {
            content: t("#### Main-Template > "),
            properties: {
              template: "Main-Template",
              "template-including-parent": "false",
              "background-color": "gray",
            },
            children: [
              {
                content: `#### ${t("AM")}`,
                children: [
                  {
                    content: "",
                  }, {
                    content: "",
                  },
                ],
              }, {
                content: `#### ${t("PM")}`,
                children: [
                  {
                    content: "",
                  }, {
                    content: "",
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
                content: `#### ${t("AM")}`,
                children: [
                  {
                    content: "",
                  }, {
                    content: "",
                  },
                ],
              }, {
                content: `#### ${t("PM")}`,
                children: [
                  {
                    content: "",
                  }, {
                    content: "",
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
                content: `#### ${t("AM")}`,
                children: [
                  {
                    content: "",
                  }, {
                    content: "",
                  },
                ],
              }, {
                content: `#### ${t("PM")}`,
                children: [
                  {
                    content: "",
                  }, {
                    content: "",
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
                content: `#### ${t("AM")}`,
                children: [
                  {
                    content: "",
                  }, {
                    content: "",
                  },
                ],
              }, {
                content: `#### ${t("PM")}`,
                children: [
                  {
                    content: "",
                  }, {
                    content: "",
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
}

