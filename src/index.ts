import '@logseq/libs'; //https://plugins-doc.logseq.com/
import { logseq as PL } from "../package.json";
const pluginId = PL.id; //set plugin id from package.json
import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user';


/* main */
const main = () => {
  console.info(`#${pluginId}: MAIN`); //console

  /* user setting */
  // https://logseq.github.io/plugins/types/SettingSchemaDesc.html
  // const settingsTemplate: SettingSchemaDesc[]  = [

  // ];
  // logseq.useSettingsSchema(settingsTemplate);



  

  /* toolbar-item sample */
  //for open_toolbar
  logseq.App.registerUIItem("toolbar", {
    key: pluginId,
    template: `<div data-on-click="open_toolbar" style="font-size:20px">🔥</div>`,
  });

  //test samples end

  console.info(`#${pluginId}: loaded`);//console
};/* end_main */



/* on click open_toolbar */
const model = {
  async open_toolbar() {
    logseq.showSettingsUI();
  }
};


logseq.ready(model, main).catch(console.error);