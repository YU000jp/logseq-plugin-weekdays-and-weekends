import '@logseq/libs' //https://plugins-doc.logseq.com/
import { AppUserConfigs, LSPluginBaseInfo } from '@logseq/libs/dist/LSPlugin.user'
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
let logseqVersion: string = "" //バージョン情報(診断用)
let logseqVersionMd: boolean = false //現在のグラフがファイルベースかどうか(= !DBグラフ)
let logseqDbGraph: boolean = false //現在のグラフがDBグラフかどうか
let pluginInitialized: boolean = false //初期化済みか(DBグラフ起動→ファイルグラフ切替での遅延初期化用)
let graphCheckSeq: number = 0 //開始した検出の連番
let graphAppliedSeq: number = 0 //結果を反映した検出の連番(成功した検出のみ進める)
// export const getLogseqVersion = () => logseqVersion //バージョン情報
export const booleanLogseqVersionMd = () => logseqVersionMd //現在のグラフがファイルベースかどうか
export const booleanDbGraph = () => logseqDbGraph //現在のグラフがDBグラフかどうか


const main = async () => {

  // グラフ切替時の再検出(起動時のDBグラフ判定ゲートより先に登録し、
  // DBグラフで起動した後にファイルグラフへ切り替えた場合でも初期化できるようにする)
  logseq.App.onCurrentGraphChanged(async () => {
    const result = await detectGraphType()
    if (result === null) return // 検出失敗時は現状維持
    if (pluginInitialized === true)
      // グラフ種別に応じて設定項目の表示/非表示を更新するため設定スキーマを再適用
      logseq.useSettingsSchema(settingsTemplate("US: United States of America", logseqVersionMd))
    if (logseqDbGraph === true)
      // DBグラフには対応していない
      return showDbGraphIncompatibilityMsg()
    // ファイルグラフ
    if (pluginInitialized === false)
      await initializePlugin() // DBグラフで起動していた場合の遅延初期化
  })

  // アプリのバージョン取得(診断用。グラフ種別の判定には使わない)
  logseqVersion = await fetchAppVersion()

  // グラフが読み込まれるまで待機(新規インストール直後など、ready時点ではグラフ未作成の場合があるため)
  const graphReady = await waitGraphReady(10, 300) // 最大3秒
  if (graphReady === false) {
    // 待機してもグラフが読み込まれない場合は初期化せず待機する。
    // onCurrentGraphChangedが初回グラフ読み込みで発火しない環境に備え、
    // バックグラウンドでも最大60秒ポーリングして検出・初期化を試みる
    console.warn("weekdays-and-weekends: graph did not load in time; keep polling in background")
    void (async () => {
      if (await waitGraphReady(40, 1500) === false) return // 最大60秒でも読み込まれなければ諦める
      if (pluginInitialized === true || graphAppliedSeq > 0) return // 検出・初期化済み
      await detectGraphAndInit()
    })()
    return
  }

  await detectGraphAndInit()

}/* end_main */


// グラフ種別を検出し、ファイルグラフなら初期化・DBグラフなら警告する
const detectGraphAndInit = async () => {
  // DBグラフチェック(公式API。API非搭載の旧ホストで検出失敗した場合はファイルグラフ扱い)
  const result = await detectGraphType()
  if (result === null && graphAppliedSeq === 0)
    // checkCurrentIsDbGraph非搭載の旧ホスト(0.10.x系)= DBグラフを開けない
    logseqVersionMd = true
  console.log(`weekdays-and-weekends: ${logseqDbGraph ? "DB graph" : "file graph"} detected. (Logseq ${logseqVersion})`)

  //100ms待つ
  await new Promise(resolve => setTimeout(resolve, 100))

  if (logseqDbGraph === true)
    // DBグラフには対応していない
    return showDbGraphIncompatibilityMsg()

  await initializePlugin()
}


// プラグインの初期化(ファイルグラフでのみ実行)
const initializePlugin = async () => {
  if (pluginInitialized === true) return //二重初期化防止
  pluginInitialized = true

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
    if (processingSlashCommand || logseqDbGraph === true) return //DBグラフでは動作しない
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
    if (processingSlashCommand || logseqDbGraph === true) return //DBグラフでは動作しない
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

}/* end_initializePlugin */


// アプリのバージョンを取得(診断用。グラフ種別の判定には使わない)
const fetchAppVersion = async (): Promise<string> => {
  const raw = await logseq.App.getInfo("version")
  const version = typeof raw === "string" ? raw : "0.0.0"
  //  0.11.0もしくは0.11.0-alpha+nightly.20250427のような形式なので、先頭の3つの数値(1桁、2桁、2桁)を正規表現で取得する
  const m = version.match(/(\d+)\.(\d+)\.(\d+)/)
  return m ? m[0] : version
}

// 現在のグラフが読み込まれるまで待機する(retries回 × intervalMs)
// ready直後にDemo DB等のグラフ作成が走る場合があり、未読み込み状態で判定すると誤検出するため
// true = グラフ読み込み済み(またはAPI非搭載で待機不要)、false = タイムアウトで未読み込み
const waitGraphReady = async (retries: number, intervalMs: number): Promise<boolean> => {
  for (let i = 0; i < retries; i++) {
    try {
      const graph = await (logseq.App as any).getCurrentGraph()
      if (graph !== null && graph !== undefined) return true // グラフ読み込み済み
    } catch {
      return true // API非搭載ホスト(0.10.x系)は待機不要
    }
    await new Promise(resolve => setTimeout(resolve, intervalMs))
  }
  return false
}

// DBグラフかどうかを検出し、最新の成功した検出の結果のみをフラグへ反映する
// 失敗した検出(null)は反映連番を進めないため、別の成功した検出の結果を無効化しない
const detectGraphType = async (): Promise<boolean | null> => {
  const seq = ++graphCheckSeq
  const result = await checkLogseqDbGraph()
  if (result === null || seq <= graphAppliedSeq) return result // 検出失敗 or より新しい検出が反映済み
  graphAppliedSeq = seq
  logseqDbGraph = result
  logseqVersionMd = !result //ファイルベースグラフ = !DBグラフ
  return result
}

// DBグラフかどうかのチェック DBグラフだけtrue(検出失敗時はnull)
// 公式APIを使用。0.10.x以前のホストには未実装でrejectする → null
const checkLogseqDbGraph = async (): Promise<boolean | null> => {
  try {
    const value = await (logseq.App as any).checkCurrentIsDbGraph()
    if (typeof value === "boolean") return value
    console.warn("weekdays-and-weekends: checkCurrentIsDbGraph returned non-boolean", value)
    return null
  } catch (e) {
    console.warn("weekdays-and-weekends: checkCurrentIsDbGraph failed", e)
    return null // API非搭載ホスト = DBグラフを開けない旧アプリ
  }
}

const showDbGraphIncompatibilityMsg = () => {
  logseq.UI.showMsg("The ’More journal templates’ plugin does not support Logseq DB graph.", "warning", { timeout: 5000 })
  return
}

logseq.ready(main).catch(console.error) //model