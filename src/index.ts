import '@logseq/libs' //https://plugins-doc.logseq.com/
import { AppInfo, AppUserConfigs, LSPluginBaseInfo } from '@logseq/libs/dist/LSPlugin.user'
import { setup as l10nSetup, t, } from "logseq-l10n" //https://github.com/sethyuan/logseq-l10n
import { sampleTemplatesEachDays, sampleTemplatesWeekdays } from './insertSampleTemplates'
import { checkJournalsOrJournalSingle, convertLanguageCodeToCountryCode } from './lib'
import { rendering } from './rendering'
import { setToolbar } from './setToolbar'
import { selectDaysByUser, settingsTemplate, getDates as updateDays } from './settings'
import af from "./translations/af.json"
import de from "./translations/de.json"
import es from "./translations/es.json"
import fr from "./translations/fr.json"
import id from "./translations/id.json"
import it from "./translations/it.json"
import ja from "./translations/ja.json"
import ko from "./translations/ko.json"
import nbNO from "./translations/nb-NO.json"
import nl from "./translations/nl.json"
import pl from "./translations/pl.json"
import ptBR from "./translations/pt-BR.json"
import ptPT from "./translations/pt-PT.json"
import ru from "./translations/ru.json"
import sk from "./translations/sk.json"
import tr from "./translations/tr.json"
import uk from "./translations/uk.json"
import zhCN from "./translations/zh-CN.json"
import zhHant from "./translations/zh-Hant.json"
export const key = "selectTemplateDialog"
let logseqVersion: string = "" //バージョンチェック用
let logseqVersionMd: boolean = false //バージョンチェック用
let logseqDbGraph: boolean = false
// export const getLogseqVersion = () => logseqVersion //バージョンチェック用
export const booleanLogseqVersionMd = () => logseqVersionMd //バージョンチェック用
export const booleanDbGraph = () => logseqDbGraph //バージョンチェック用


const main = async () => {

  // バージョンチェック
  logseqVersionMd = await checkLogseqVersion()
  // console.log("logseq version: ", logseqVersion)
  // console.log("logseq version is MD model: ", logseqVersionMd)
  // 100ms待つ
  await new Promise(resolve => setTimeout(resolve, 100))

  // if (logseqVersionMd === false) {
  //   // Logseq ver 0.10.*以下にしか対応していない
  //   logseq.UI.showMsg("The ’More journal Template’ plugin only supports Logseq ver 0.10.* and below.", "warning", { timeout: 5000 })
  //   return
  // }

  // // DBグラフチェック
  logseqDbGraph = await checkLogseqDbGraph()
  if (logseqDbGraph === true) {
    // DBグラフには対応していない
    return showDbGraphIncompatibilityMsg()
  }

  //100ms待つ
  await new Promise(resolve => setTimeout(resolve, 100))

  logseq.App.onCurrentGraphChanged(async () => {
    logseqDbGraph = await checkLogseqDbGraph()
    logseq.useSettingsSchema(settingsTemplate("US: United States of America", logseqVersionMd))
    if (logseqDbGraph === true)
      // DBグラフには対応していない
      return showDbGraphIncompatibilityMsg()
  })

  await l10nSetup({
    builtinTranslations: {//Full translations
      ja, af, de, es, fr, id, it, ko, "nb-NO": nbNO, nl, pl, "pt-BR": ptBR, "pt-PT": ptPT, ru, sk, tr, uk, "zh-CN": zhCN, "zh-Hant": zhHant
    }
  })

  /* user settings */
  //get user config Language >>> Country
  if (logseq.settings?.switchHolidaysCountry === undefined) {
    const { preferredLanguage } = await logseq.App.getUserConfigs() as { preferredLanguage: AppUserConfigs['preferredLanguage'] }
    logseq.useSettingsSchema(
      settingsTemplate(
        convertLanguageCodeToCountryCode(preferredLanguage), logseqVersionMd
      ))
    setTimeout(() => logseq.showSettingsUI(), 300)
  } else
    logseq.useSettingsSchema(settingsTemplate("US: United States of America", logseqVersionMd))


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
    await sampleTemplatesWeekdays(uuid) // 平日のサンプルを作成
    processingSlashCommand = false
  })
  //end

  /* slash command */
  logseq.Editor.registerSlashCommand("Create sample for each days renderer", async ({ uuid }) => {
    if (processingSlashCommand) return
    const check: Date | null = await checkJournalsOrJournalSingle()//日誌では許可しない
    if (check) {
      logseq.UI.showMsg(t("The current page is journals."), "error")
      return
    }
    processingSlashCommand = true
    await sampleTemplatesEachDays(uuid) // 1日ごとのサンプルを作成
    processingSlashCommand = false
  })
  //end


  rendering()//end onMacroRendererSlotted


  let processingOnSettingsChanged: Boolean = false
  logseq.onSettingsChanged(async (newSet: LSPluginBaseInfo['settings'], oldSet: LSPluginBaseInfo['settings']) => {

    if (processingOnSettingsChanged === false
      && newSet
      && oldSet
      && newSet !== oldSet) {
      if (oldSet.selectPrivateDays !== true
        && newSet.selectPrivateDays === true) {
        processingOnSettingsChanged = true
        selectDaysByUser("PrivateDays")
        logseq.updateSettings({ selectPrivateDays: false })
        processingOnSettingsChanged = false
      } else
        if (oldSet.selectWorkingOnHolidays !== true
          && newSet.selectWorkingOnHolidays === true) {
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
          & article>div[data-id="${logseq.baseInfo.id}"] {
            & div.heading-item {
              margin-top: 3em;
              border-top-width: 1px;
              padding-top: 1em;
            }
            & div.desc-item {

              &[data-key="switchMainSub"]:has(input.form-checkbox:not(:checked))+div.desc-item[data-key="switchAlertDay"] {
                  display: none;

                  &+div.desc-item[data-key="switchMainTemplateName"] {
                      display: none;

                      &+div.desc-item[data-key="switchSubTemplateName"] {
                          display: none;

                          &+div.desc-item[data-key="switchSetTemplate"] {
                              display: none;
                          }
                      }
                  }
              }

              &[data-key="switchHolidays"]:has(input.form-checkbox:not(:checked))+div.desc-item[data-key="switchHolidaysTemplateName"] {
                  display: none;

                  &+div.desc-item[data-key="switchHolidaysCountry"] {
                      display: none;

                      &+div.desc-item[data-key="switchHolidaysState"] {
                          display: none;

                          &+div.desc-item[data-key="switchHolidaysRegion"] {
                              display: none;
                          }
                      }
                  }
              }

              &[data-key="switchPrivate"]:has(input.form-checkbox:not(:checked))+div.desc-item[data-key="selectPrivateDays"] {
                  display: none;

                  &+div.desc-item[data-key="switchPrivateTemplateName"] {
                      display: none;
                  }
              }

              &[data-key="switchWorkingOnHolidays"]:has(input.form-checkbox:not(:checked))+div.desc-item[data-key="selectWorkingOnHolidays"] {
                  display: none;

                  &+div.desc-item[data-key="selectWorkingOnHolidaysSetTemplate"] {
                      display: none;

                      &+div.desc-item[data-key="switchWorkingOnHolidaysTemplateName"] {
                          display: none;
                      }
                  }
              }
            }
          }     

      &[data-ref="${logseq.baseInfo.id}"] {
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


// MDモデルかどうかのチェック DBモデルはfalse
const checkLogseqVersion = async (): Promise<boolean> => {
  const logseqInfo = (await logseq.App.getInfo("version")) as AppInfo | any
  //  0.11.0もしくは0.11.0-alpha+nightly.20250427のような形式なので、先頭の3つの数値(1桁、2桁、2桁)を正規表現で取得する
  const version = logseqInfo.match(/(\d+)\.(\d+)\.(\d+)/)
  if (version) {
    logseqVersion = version[0] //バージョンを取得
    // console.log("logseq version: ", logseqVersion)

    // もし バージョンが0.10.*系やそれ以下ならば、logseqVersionMdをtrueにする
    if (logseqVersion.match(/0\.([0-9]|10)\.\d+/)) {
      logseqVersionMd = true
      // console.log("logseq version is 0.10.* or lower")
      return true
    } else logseqVersionMd = false
  } else logseqVersion = "0.0.0"
  return false
}
// DBグラフかどうかのチェック
// DBグラフかどうかのチェック DBグラフだけtrue
const checkLogseqDbGraph = async (): Promise<boolean> => {
  const element = parent.document.querySelector(
    "div.block-tags",
  ) as HTMLDivElement | null // ページ内にClassタグが存在する  WARN:: ※DOM変更の可能性に注意
  if (element) {
    logseqDbGraph = true
    return true
  } else logseqDbGraph = false
  return false
}

const showDbGraphIncompatibilityMsg = () => {
  logseq.UI.showMsg("The ’More journal templates’ plugin not supports Logseq DB graph.", "warning", { timeout: 5000 })
  return
}

logseq.ready(main).catch(console.error) //model