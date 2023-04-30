import '@logseq/libs'; //https://plugins-doc.logseq.com/
import { IBatchBlock, SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user';
let renderingOnChanged = false; //rendering OnChanged flag
import Swal from 'sweetalert2'; //https://sweetalert2.github.io/

/* main */
const main = async (checkDemo) => {


  //check demo graph
  if (!checkDemo) {
    //check current graph
    let demo: boolean = false;
    logseq.App.getCurrentGraph().then((graph) => {
      if (!graph) {//デモグラフの場合は返り値がnull
        demo = true;
      }
    });
    if (demo !== false) {
      //graph changed
      logseq.App.onCurrentGraphChanged(() => {
        logseq.App.getCurrentGraph().then((graph) => {
          if (graph) { //デモグラフの場合は返り値がnull
            main(true);
          }
        });
      });
      return;
    }
  }
  //end


  //get theme color (For SweetAlert2)
  //color: sweetAlert2color
  //background: sweetAlert2background
  //別途、checkboxなどはCSSで上書きする必要あり
    let sweetAlert2background = "#ffffff";
    let sweetAlert2color = "#000000";
    const root = parent.document.querySelector(":root");
    if (root) {
      const rootStyles = getComputedStyle(root);
      sweetAlert2background = rootStyles.getPropertyValue("--ls-block-properties-background-color");
      sweetAlert2color = rootStyles.getPropertyValue("--ls-primary-text-color");
    }

    logseq.App.onThemeModeChanged(() => {
      const root = parent.document.querySelector(":root");
      if (root) {
        const rootStyles = getComputedStyle(root);
        sweetAlert2background = rootStyles.getPropertyValue("--ls-block-properties-background-color");
        sweetAlert2color = rootStyles.getPropertyValue("--ls-primary-text-color");
      }
    });



  /* user setting */
  // https://logseq.github.io/plugins/types/SettingSchemaDesc.html
  const settingsTemplate: SettingSchemaDesc[] = [
    {
      key: "",
      title: "[Option] Switch to Sub-Template for week",
      type: "heading",
      description: "",
      default: "Possible to switch templates on specific days of the week.",
    },
    {
      key: "switchMainTemplateName",
      title: "Name of Main-Template (to switch to Sub-Template)",
      type: "string",
      description: "",
      default: "",
    },
    {
      key: "switchSubTemplateName",
      title: "Name of Sub-Template (to switch from Main-Template)",
      type: "string",
      description: "",
      default: "",
    },
    {
      key: "switchSetTemplate",
      title: "Name of current set template",
      type: "string",
      description: "No editing is needed. For editing manually.",
      default: "",
    },
    {
      key: "switchAlertDay",
      title: "Alert day for switch Main/Sub Template",
      type: "enum",
      enumChoices: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      description: "",
      default: "Mon",
    }
  ];
  logseq.useSettingsSchema(settingsTemplate);


  /* slash command */
  let processingSlashCommand = false;
  logseq.Editor.registerSlashCommand("Create sample for weekdays renderer", async (e) => {
    if (processingSlashCommand) { return; }
    const check = await checkJournals();//ジャーナルでは許可しない
    if (check === true) {
      logseq.UI.showMsg("This is journal page. ", "error");
      return;
    }
    processingSlashCommand = true;
    const titleBlock = await logseq.Editor.insertBlock(e.uuid, "### Weekdays and Weekends", {
      sibling: true,
      properties: { comment: "require [Weekdays and weekends plugin](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends)" }
    });
    if (titleBlock) {
      const templateBlock = await logseq.Editor.insertBlock(titleBlock.uuid, "#### Journal: Template Settings", {
        properties: {
          template: "Journal",
          "template-including-parent": "false",
          Comment: 'Edit config.edn `:default-templates {:journals "Journal"}`` During runtime, the block with renderings be removed. A block can have a maximum of seven renderings, but if the weekdays overlap, only one of them will be executed.',
          "background-color": "yellow",
        },
        sibling: false,
      });
      if (templateBlock) {
        const rendererBlock = await logseq.Editor.insertBlock(templateBlock.uuid, "{{renderer :Weekdays, Template-A, Mon&Tue&Wed&Thu&Fri}} {{renderer :Weekdays, Template-B, Sat&Sun}} ", {
          sibling: false,
        });
        if (rendererBlock) {
          await logseq.Editor.insertBlock(templateBlock.uuid, "", {
            sibling: true,
          });
          const templateA = await logseq.Editor.insertBlock(templateBlock.uuid, "#### Template-A: Weekdays", {
            properties: {
              template: "Template-A",
              "template-including-parent": "false",
              Comment: " [default] Mon&Tue&Wed&Thu&Fri",
              "background-color": "yellow",
            },
            sibling: true,
          });
          if (templateA) {
            const weekdays = await logseq.Editor.insertBlock(templateA.uuid, "### Weekdays", { sibling: false, properties: { "background-color": "gray", }, });
            if (weekdays) {
              await templateBlank(weekdays.uuid, "AM");
              await templateBlank(weekdays.uuid, "PM");
            }
            const templateB = await logseq.Editor.insertBlock(templateA.uuid, "#### Template-B: Weekends", {
              properties: {
                template: "Template-B",
                "template-including-parent": "false",
                Comment: " [default] Sat&Sun",
                "background-color": "yellow",
              },
              sibling: true,
            });
            if (templateB) {
              const weekends = await logseq.Editor.insertBlock(templateB.uuid, "### Weekends", { sibling: false, properties: { "background-color": "gray", }, });
              if (weekends) {
                await templateBlank(weekends.uuid, "AM");
                await templateBlank(weekends.uuid, "PM");
              }
            }
          }
        }
      }
    }
    processingSlashCommand = false;
  });
  //end


  logseq.Editor.registerSlashCommand("Add :Weekdays-renderer at Editing cursor", async (event) => {
    await logseq.Editor.insertAtEditingCursor(
      `{{renderer :Weekdays, Template-C, Sat&Sun}} `
    );
  });


  let rendering = ""; //rendering flag
  //rendering
  logseq.App.onMacroRendererSlotted(async ({ slot, payload }) => {
    if (rendering === slot) { return; }
    rendering = slot;
    const [type, template, weekdays] = payload.arguments as string[];

    if (type === ":Weekdays") {//:weekdays

      const check = await checkJournals();//ジャーナルだったらレンダリング実行
      if (template && weekdays && check === true) {
        //switchMainTemplateName
        //switchSubTemplateName
        //switchAlertDay
          if (logseq.settings?.switchMainTemplateName === template && logseq.settings?.switchSubTemplateName) {
            if (logseq.settings?.switchAlertDay && checkWeekday(logseq.settings?.switchAlertDay) === true) {
              //アラート日の場合
              //dialog
              const subTemplateName = logseq.settings?.switchSubTemplateName;
              logseq.showMainUI();
              /* inputOptions can be an object or Promise */
              await Swal.fire({
                icon: 'question',
                input: 'radio',
                inputOptions: {
                  main: template,
                  sub: subTemplateName,
                },
                color: sweetAlert2color,
                background: sweetAlert2background,
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                html: `<p>Select Main/Sub Template for this week</p>
              <style>
                div.swal2-container div.swal2-radio {
                  color: unset;
                  background: unset;
                }
              </style>`,
              }).then(async (select) => {
                if (select) {
                  if (select.value) {
                    let selectTemplate = template; //main
                    if (select.value === "sub") { //sub
                      selectTemplate = subTemplateName;
                      logseq.updateSettings({ switchSetTemplate: subTemplateName });
                    }
                    insertTemplateDialog(selectTemplate, false);
                    await insertTemplateBlock(payload.uuid, selectTemplate);
                    logseq.updateSettings({ switchSetTemplate: selectTemplate }); //選択したテンプレートを設定項目へセット
                  } else {
                    logseq.UI.showMsg("Cancel", "warning");
                  }
                }
              }).finally(() => {
                logseq.hideMainUI();
              });
              setTimeout(() => {
                rendering = "";
              }, 1000);
              return;
            } else {
              let setTemplate;
              if (logseq.settings?.switchSetTemplate) {
                setTemplate = logseq.settings?.switchSetTemplate;
              } else {
                setTemplate = template;
              }
              //セットされたテンプレートを挿入
              insertTemplateDialog(setTemplate, true);
              await insertTemplateBlock(payload.uuid, setTemplate);
              setTimeout(() => {
                rendering = "";
              }, 1000);
              return;
            }
          } else if (weekdays === "ALL" || checkWeekday(weekdays) === true) {
            insertTemplateDialog(template, true);
            await insertTemplateBlock(payload.uuid, template);
            setTimeout(() => {
              rendering = "";
            }, 1000);
            return;
          }
      }

      await logseq.provideUI({
        key: `${slot}`,
        reset: true,
        slot,
        template: `<label title="Waiting renderer"> WAITING: ${template}, ${weekdays} </label>`,
        style: {
          color: "var(--ls-link-ref-text-hover-color)",
          border: "2px solid var(--ls-link-ref-text-hover-color)",
          paddingTop: "0.2em",
          paddingBottom: "0.2em",
          margin: "0.2em",
          borderRadius: "5px",
        }
      });

    }
  });


  //Credit: hkgnp
  //https://github.com/hkgnp/logseq-calview-plugin/blob/dc1716781b594d973c3d97fdf2475ad11f71a795/src/utils.tsx#LL3C1-L16C3
  //page..journalDay
  const getJournalDayFormat = (journalDayInNumber: number) => {
    if (journalDayInNumber) {
      const journalDay = journalDayInNumber.toString();
      return (
        journalDay.slice(0, 4) +
        "-" +
        journalDay.slice(4, 6) +
        "-" +
        journalDay.slice(6)
      );
    } else {
      console.error("journalDayInNumber is undefined");
    }
  };

  //sweetAlert2 https://sweetalert2.github.io/#mixin
  async function insertTemplateDialog(TemplateName: string, MainUI: boolean) {
    if (MainUI === true) {
      logseq.showMainUI();
    }
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 4200,
      timerProgressBar: true,
    });
    await Toast.fire({
      icon: 'success',
      title: `Insert ${TemplateName}`,
      color: sweetAlert2color,
      background: sweetAlert2background,
    });
    if (MainUI === true) {
      logseq.hideMainUI();
    }
  }


  async function insertTemplateBlock(blockUuid, template) {

    await logseq.Editor.updateBlock(blockUuid, "");//remove renderer block

    //TODO: holiday
    //テンプレートを取得する

    // @logseq/lib v0.0.15(未公開) TODO:
    // ブロックではなく、テンプレートとして読み込む。SmartBlocksなどのプラグインも動作するようになる。Dynamic variablesも動作する (README.mdを書き換える TODO:)
    //https://github.com/logseq/logseq/blob/a5e31128a6366df002488203406684f78d80c7e3/libs/src/LSPlugin.ts#L449

    //insertTemplate: (target: BlockUUID, name: string) => Promise<any>
    // logseq.App.getTemplate(blockUuid, template).then(async (event) => {
    //   if (event) {
    //         logseq.Editor.moveBlock(blockUuid, event.uuid);
    //         logseq.UI.showMsg(`Rendered ${template}`, "success", { timeout: 3000 });
    //   } else {
    //     logseq.UI.showMsg(`Template ${template} not found.`);
    //   }
    // });


    //クエリーで取得 @logseq/lib v0.0.14用
    const query = `[:find (pull ?b [*])
      :where
      [?b :block/properties ?p]
      [(get ?p :template) ?ty]
      [(= "${template}" ?ty)]]`;
    const ret = await logseq.DB.datascriptQuery(query);
    const results = ret?.flat();
    if (results && results.length > 0) {
      const Block = await logseq.Editor.getBlock(results[0].uuid, {
        includeChildren: true,
      });
      if (Block) {
        renderingOnChanged = true;
        const batchBlock = await logseq.Editor.insertBatchBlock(blockUuid, Block.children as IBatchBlock[], { before: true, sibling: true, });
        if (batchBlock) {
          setTimeout(() => {
            renderingOnChanged = false;
          }, 30);
        }
      }
    } else {
      logseq.UI.showMsg(`Template ${template} not found.`, "error");
    }
    //end

    //Full House Template (https://github.com/stdword/logseq13-full-house-plugin) Outlines unsupported
    //logseq.Editor.insertBlock(blockUuid, `{{renderer :template, ${template}}}`,{before:true});
  }


  //Fix(bug): replace block property backgroundcolor&backgroundColor === background-color
  logseq.DB.onChanged(async (e) => {
    if (renderingOnChanged === false) { return; } //レンダリング中のみ実行
    e.blocks.forEach(async (block) => {
      //backgroundcolorを削除する
      if (block.properties?.backgroundcolor) { //backgroundcolorプロパティが存在するバグ
        setTimeout(async () => {
          await logseq.Editor.removeBlockProperty(block.uuid, "backgroundcolor"); //削除する @logseq/lib v0.0.15(未公開) TODO:
        }, 10);
      }
    });
  });


  // logseq.App.registerUIItem("toolbar", {
  //   key: pluginId,
  //   template: `<div data-on-click="weekdaysOpenToolbar" style="font-size:20px">🛳️</div>`,
  // });
};/* end_main */



async function templateBlank(uuid, amPm) {
  const insert = await logseq.Editor.insertBlock(uuid, `### ${amPm}`, { sibling: false });
  if (insert) {
    for (let i = 0; i < 2; i++) {
      await logseq.Editor.insertBlock(insert.uuid, "", { sibling: false });//空行を追加
    }
  }
}


function checkWeekday(selectWeekday) {
  //曜日指定=ALL以外
  const days = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  const dayArray = selectWeekday.split("&"); // ["Sun", "Sat"]
  const dayNumbers = dayArray.map(day => days[day]); // [0, 6]
  const theDay = new Date();//その日の日付
  const theDayNumber = theDay.getDay(); // 0-6
  if (dayNumbers.includes(theDayNumber)) {
    return true; //一致
  } else {
    return false; //一致しない
  }
}


async function checkJournals() {
  const page = await logseq.Editor.getCurrentPage(); //Journalsの場合はnull
  if (page) {
    if (page["journal?"] === true) { //Journal day
      return true;
    }
    return false; //Non-Journal
  } else {
    return true; //Journals
  }
}


// /* on click open_toolbar */
// const model = {
//   async weekdaysOpenToolbar() {
//     logseq.showSettingsUI();
//   }
// };


logseq.ready(main).catch(console.error); //model