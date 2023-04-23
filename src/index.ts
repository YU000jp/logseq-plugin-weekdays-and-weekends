import '@logseq/libs'; //https://plugins-doc.logseq.com/
import { IBatchBlock, SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user';
let renderingOnChanged = false; //rendering OnChanged flag

/* main */
const main = async () => {

  /* user setting */
  // https://logseq.github.io/plugins/types/SettingSchemaDesc.html
  // const settingsTemplate: SettingSchemaDesc[]  = [

  // ];
  // logseq.useSettingsSchema(settingsTemplate);

  /* slash command */
  let processingSlashCommand = false;
  logseq.Editor.registerSlashCommand("Create sample for weekdays renderer", async (e) => {
    if (processingSlashCommand) { return; }
    processingSlashCommand = true;
    const titleBlock = await logseq.Editor.insertBlock(e.uuid, "### Weekdays and Weekends", {
      sibling: true,
      properties: { comment: "require [Weekdays and weekends plugin](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends)" }
    });
    if (titleBlock) {
      const templateBlock = await logseq.Editor.insertBlock(titleBlock.uuid, "#### Journal Template Settings", {
        properties: {
          template: "Journal",
          "template-including-parent": "false",
          Comment: '*Edit config.edn `:default-templates {:journals "Journal"`} *During runtime, the block with renderings be removed.',
          "background-color": "yellow",
        },
        sibling: false,
      });
      if (templateBlock) {
        const rendererBlock = await logseq.Editor.insertBlock(templateBlock.uuid, "{{renderer :Weekdays, templateA, Mon&Tue&Wed&Thu&Fri}} {{renderer :Weekdays, templateB, Sat&Sun}} ", {
          sibling: false,
        });
        if (rendererBlock) {
          await logseq.Editor.insertBlock(templateBlock.uuid, "", {
            sibling: true,
          });
          const templateA = await logseq.Editor.insertBlock(templateBlock.uuid, "#### Template A", {
            properties: {
              template: "templateA",
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
              await logseq.Editor.insertBlock(templateA.uuid, `##### [Edit](${templateA.uuid})`, { sibling: false, });
            }
            const templateB = await logseq.Editor.insertBlock(templateA.uuid, "#### Template B", {
              properties: {
                template: "templateB",
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
                await logseq.Editor.insertBlock(templateB.uuid, `##### [Edit](${templateB.uuid})`, { sibling: false, });
              }
            }
          }
        }
      }
    }
    processingSlashCommand = false;
  });

  logseq.App.onMacroRendererSlotted(async ({ slot, payload }) => {
    const [type, template, selectWeekday] = payload.arguments;
    if (type !== ":Weekdays" || !template || !selectWeekday) {
      return;
    }
    if ((await checkTemplate(payload.uuid))) {
      logseq.provideUI({
        key: `${slot}`,
        reset: true,
        slot,
        template: `<label title="Waiting renderer"> WAITING: ${template}, ${selectWeekday} </label>`,
        style: {
          fontSize: "0.95em",
          color: "var(--ls-link-ref-text-color)",
          border: "2px solid var(--ls-link-ref-text-color)",
          paddingTop: "0.2em",
          paddingBottom: "0.2em",
          margin: "0.2em",
          borderRadius: "5px",
        }
      });
    } else {
      await logseq.Editor.updateBlock(payload.uuid, "");//remove renderer
      await insertTemplateBlock(payload.uuid, template, selectWeekday);
    }
  });


  async function insertTemplateBlock(blockUuid, template, selectWeekday) {
    //TODO: holiday
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
    const today = new Date();
    const todayNumber = today.getDay(); // 0-6
    if (!dayNumbers.includes(todayNumber)) {
      return;
    } //一致しない場合は終了

    const query = `[:find (pull ?b [*])
      :where
      [?b :block/properties ?p]
      [(get ?p :template) ?ty]
      [(= "${template}" ?ty)]]`;
    const ret = await logseq.DB.datascriptQuery(query);
    const results = ret?.flat();
    let Block;
    if (results && results.length > 0) {
      Block = await logseq.Editor.getBlock(results[0].uuid, {
        includeChildren: true,
      });
      if (Block) {
        renderingOnChanged = true;
        const batchBlock = await logseq.Editor.insertBatchBlock(blockUuid, Block.children as unknown as IBatchBlock, { sibling: true });
        if (batchBlock) {
          setTimeout(() => {
            renderingOnChanged = false;
            setTimeout(() => {
              logseq.Editor.moveBlock(blockUuid, batchBlock[0].uuid);
            }, 100);
          }, 30);
        }
      }
    }
    //Full House Template (https://github.com/stdword/logseq13-full-house-plugin) Outlines unsupported
    //logseq.Editor.insertBlock(blockUuid, `{{renderer :template, ${template}}}`,{before:true});
  }


  //Fix(bug): replace block property backgroundcolor&backgroundColor === background-color
  logseq.DB.onChanged(async (e) => {
    if (renderingOnChanged === false) { return; }
    e.blocks.forEach(async (block) => {
      //backgroundcolorを削除する
      if (block.properties?.backgroundcolor) {
        setTimeout(async () => {
          await logseq.Editor.removeBlockProperty(block.uuid, "backgroundcolor");
        }, 20);
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
      await logseq.Editor.insertBlock(insert.uuid, "", { sibling: false });
    }
  }
}



async function checkTemplate(uuid) {
  //Credits to Alex for this implementation https://github.com/QWxleA
  //is block(uuid) on a template?
  try {
    const block = await logseq.Editor.getBlock(uuid);
    if (block) {
      const checkTPL = block.properties?.template != undefined ? true : false;
      const checkPRT = block.parent != null && block.parent.id !== block.page.id ? true : false;
      if (checkTPL === false && checkPRT === false) { return false; }
      if (checkTPL === true) { return true; }
      return await checkTemplate(block.parent.id);
    }
  } catch (error) {
    console.log(error);
  }
}


// /* on click open_toolbar */
// const model = {
//   async weekdaysOpenToolbar() {
//     logseq.showSettingsUI();
//   }
// };


logseq.ready(main).catch(console.error); //model