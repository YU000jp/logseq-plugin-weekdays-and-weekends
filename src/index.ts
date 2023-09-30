import '@logseq/libs'; //https://plugins-doc.logseq.com/
import { LSPluginBaseInfo, AppUserConfigs } from '@logseq/libs/dist/LSPlugin.user';
import { setup as l10nSetup } from "logseq-l10n"; //https://github.com/sethyuan/logseq-l10n
import ja from "./translations/ja.json";
import { setToolbar } from './setToolbar';
import { insertSampleTemplates } from './insertSampleTemplates';
import { settingsTemplate } from './settings';
import { convertLanguageCodeToCountryCode } from './lib';
import { selectDaysByUser, getDates } from './settings';
import { rendering } from './rendering';
import { checkJournals } from './lib';
export const key = "selectTemplateDialog";


const main = () => {

  /* slash command */
  let processingSlashCommand = false;
  logseq.Editor.registerSlashCommand("Create sample for weekdays renderer", async ({ uuid }) => {
    if (processingSlashCommand) return;
    const check = await checkJournals();//ジャーナルでは許可しない
    if (check === true) {
      logseq.UI.showMsg("This is journal page. ", "error");
      return;
    }
    processingSlashCommand = true;
    await insertSampleTemplates(uuid);
    processingSlashCommand = false;
  });
  //end


  //TODO: 保留
  logseq.Editor.registerSlashCommand("Add :Weekdays-renderer at Editing cursor", async () => {
    logseq.Editor.insertAtEditingCursor(
      `{{renderer :Weekdays, TemplateName, Sat&Sun}} `
    );
  });


  //renderer実行
  logseq.App.onTodayJournalCreated(() => setTimeout(() => logseq.Editor.exitEditingMode(), 100));


  rendering();//end onMacroRendererSlotted

  loadSettings();


  let processingOnSettingsChanged: Boolean = false;
  logseq.onSettingsChanged(async (newSet: LSPluginBaseInfo['settings'], oldSet: LSPluginBaseInfo['settings']) => {
    if (processingOnSettingsChanged === false && newSet && oldSet && newSet !== oldSet) {
      if (oldSet.selectPrivateDays !== true && newSet.selectPrivateDays === true) {
        processingOnSettingsChanged = true;
        selectDaysByUser("PrivateDays");
        logseq.updateSettings({ selectPrivateDays: false });
        processingOnSettingsChanged = false;
      } else if (oldSet.selectWorkingOnHolidays !== true && newSet.selectWorkingOnHolidays === true) {
        processingOnSettingsChanged = true;
        selectDaysByUser("WorkingOnHolidays");
        logseq.updateSettings({ selectWorkingOnHolidays: false });
        processingOnSettingsChanged = false;
      }
    }
  });

  const popup = `${logseq.baseInfo.id}--${key}`;
  logseq.provideStyle({
    key: "main", style: `
    form.SetDates {
      margin:1.2em;
    }
    form.SetDates input {
      background: var(--ls-block-properties-background-color);
      color: var(--ls-primary-text-color);
      margin-bottom: 1em;
    }
    form.SetDates button {
      outline: 2px solid var(--ls-link-ref-text-hover-color);
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
      padding:5px;
    }
    div#${popup} p {
      font-size: 1.1em;
    }
    div#${popup} input[type="radio"] {
      margin-left: 0.5em;
      margin-right: 0.5em;
    }
    div#${popup} ul {
      list-style: none;
      padding: 4px 8px;
      cursor: pointer;
    }
    div#${popup} button {
      margin-top: 1em;
      margin-left: 2em;
      border: 1px solid var(--ls-secondary-background-color);
      boxShadow: 1px 2px 5px var(--ls-secondary-background-color);
      text-decoration: underline;
    }
    div#${popup} button:hover {
      background: var(--ls-secondary-background-color);
      color: var(--ls-secondary-text-color);
    }
  `});

  logseq.provideModel({
    getDatesPrivateDays: () => getDates("PrivateDays"),
    getDatesWorkingOnHolidays: () => getDates("WorkingOnHolidays"),
    weekdaysOpenSettings: () => logseq.showSettingsUI(),
  });

  // toolbar button
  setToolbar();

};/* end_main */



const loadSettings = async () => {
  try {
    await l10nSetup({ builtinTranslations: { ja } });
  } finally {
    /* user settings */
    //get user config Language >>> Country
    if (logseq.settings?.switchHolidaysCountry === undefined) {
      const { preferredLanguage } = await logseq.App.getUserConfigs() as AppUserConfigs;
      logseq.useSettingsSchema(settingsTemplate(convertLanguageCodeToCountryCode(preferredLanguage)));
      setTimeout(() => {
        logseq.showSettingsUI();
      }, 300);
    } else {
      logseq.useSettingsSchema(settingsTemplate("US: United States of America"));
    }
  }
};

logseq.ready(main).catch(console.error); //model