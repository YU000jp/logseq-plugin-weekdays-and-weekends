import '@logseq/libs' //https://plugins-doc.logseq.com/
import { AppUserConfigs, LSPluginBaseInfo } from '@logseq/libs/dist/LSPlugin.user'
import { setup as l10nSetup, t, } from "logseq-l10n" //https://github.com/sethyuan/logseq-l10n
import { insertSampleTemplates } from './insertSampleTemplates'
import { checkJournalsOrJournalSingle, convertLanguageCodeToCountryCode } from './lib'
import { rendering } from './rendering'
import { setToolbar } from './setToolbar'
import { selectDaysByUser, settingsTemplate, getDates as updateDays } from './settings'
import ja from "./translations/ja.json"
export const key = "selectTemplateDialog"


const main = () => {

  /* slash command */
  let processingSlashCommand = false
  logseq.Editor.registerSlashCommand("Create sample for weekdays renderer", async ({ uuid }) => {
    if (processingSlashCommand) return
    const check: Date | null = await checkJournalsOrJournalSingle()//日誌では許可しない
    if (check) {
      logseq.UI.showMsg(t("The current page is journals."), "error")
      return
    }
    processingSlashCommand = true
    await insertSampleTemplates(uuid)
    processingSlashCommand = false
  })
  //end


  //TODO: 保留
  logseq.Editor.registerSlashCommand("Add :Weekdays-renderer at Editing cursor", async () => {
    logseq.Editor.insertAtEditingCursor(
      `{{renderer :Weekdays, TemplateName, Sat&Sun}} `
    )
  })


  //renderer実行
  logseq.App.onTodayJournalCreated(() => setTimeout(() => logseq.Editor.exitEditingMode(), 100))


  rendering()//end onMacroRendererSlotted

  loadSettings()


  let processingOnSettingsChanged: Boolean = false
  logseq.onSettingsChanged(async (newSet: LSPluginBaseInfo['settings'], oldSet: LSPluginBaseInfo['settings']) => {
    if (processingOnSettingsChanged === false && newSet && oldSet && newSet !== oldSet) {
      if (oldSet.selectPrivateDays !== true && newSet.selectPrivateDays === true) {
        processingOnSettingsChanged = true
        selectDaysByUser("PrivateDays")
        logseq.updateSettings({ selectPrivateDays: false })
        processingOnSettingsChanged = false
      } else if (oldSet.selectWorkingOnHolidays !== true && newSet.selectWorkingOnHolidays === true) {
        processingOnSettingsChanged = true
        selectDaysByUser("WorkingOnHolidays")
        logseq.updateSettings({ selectWorkingOnHolidays: false })
        processingOnSettingsChanged = false
      }
    }
  })

  logseq.provideStyle({
    key: "main", style: `
    body>div {
      &#root>div>main {
          & article>div[data-id="logseq-plugin-weekdays-and-holidays"] div.heading-item {
              margin-top: 3em;
              border-top-width: 1px;
              padding-top: 1em;
          }
      }

      &[data-ref="weekdays-and-holidays"] {
          & form.setDates {
              margin: 1.2em;

              & input {
                  background-color: var(--ls-block-properties-background-color);
                  color: var(--ls-primary-text-color);
                  margin-bottom: 1em;
                  font-size: .94em;
              }

              & button {
                  outline: 2px solid var(--ls-link-ref-text-hover-color);
                  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
                  padding: 5px;
              }
          }

          & p {
              font-size: 1.1em;
          }

          & input[type="radio"] {
              margin-left: 0.5em;
              margin-right: 0.5em;
          }

          & ul {
              list-style: none;
              padding: 4px 8px;
              cursor: pointer;
          }

          & button {
              margin-top: 1em;
              margin-left: 2em;
              border: 1px solid var(--ls-secondary-background-color);
              box-shadow: 1px 2px 5px var(--ls-secondary-background-color);
              text-decoration: underline;

              &:hover {
                  background-color: var(--ls-secondary-background-color);
                  color: var(--ls-secondary-text-color);
              }
          }
      }
  }
  `})

  logseq.provideModel({
    getDatesPrivateDays: () => updateDays("PrivateDays"),
    getDatesWorkingOnHolidays: () => updateDays("WorkingOnHolidays"),
    weekdaysOpenSettings: () => logseq.showSettingsUI(),
  })

  // toolbar button
  setToolbar()

}/* end_main */



const loadSettings = async () => {
  try {
    await l10nSetup({ builtinTranslations: { ja } })
  } finally {
    /* user settings */
    //get user config Language >>> Country
    if (logseq.settings?.switchHolidaysCountry === undefined) {
      const { preferredLanguage } = await logseq.App.getUserConfigs() as AppUserConfigs
      logseq.useSettingsSchema(settingsTemplate(convertLanguageCodeToCountryCode(preferredLanguage)))
      setTimeout(() => {
        logseq.showSettingsUI()
      }, 300)
    } else {
      logseq.useSettingsSchema(settingsTemplate("US: United States of America"))
    }
  }
}

logseq.ready(main).catch(console.error) //model