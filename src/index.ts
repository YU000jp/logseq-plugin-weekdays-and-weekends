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
let graphAppliedSeq: number = 0 //結果を反映した検出の連番(最新の検出のみ進める)
let dbCheckWarned: boolean = false //checkCurrentIsDbGraph失敗の警告は一度だけ出す
// export const getLogseqVersion = () => logseqVersion //バージョン情報
export const booleanLogseqVersionMd = () => logseqVersionMd //現在のグラフがファイルベースかどうか
export const booleanDbGraph = () => logseqDbGraph //現在のグラフがDBグラフかどうか


const main = async () => {

  // グラフ切替時の再検出(起動時のDBグラフ判定ゲートより先に登録し、
  // DBグラフで起動した後にファイルグラフへ切り替えた場合でも初期化できるようにする)
  logseq.App.onCurrentGraphChanged(async () => {
    const result = await detectGraphType()
    if (result === null) {
      // 種別判定できなかった場合は定期的な再検出に委ねる(新しい検出が反映されるまで継続)
      void pollGraphUntilDetected()
      return
    }
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

  // DB系世代では新規インストール直後など ready時点でグラフ未作成の場合があるため、
  // グラフが読み込まれるまで待機する(旧ホストは常にファイルグラフなので待機不要)
  if (isDbEraApp() === true && await waitGraphReady(10, 300) === false) {
    // 待機してもグラフが読み込まれない場合は初期化せず待機する。
    // onCurrentGraphChangedが初回グラフ読み込みで発火しない環境に備え、
    // バックグラウンドでも定期的にポーリングして検出・初期化を試みる
    console.warn("weekdays-and-weekends: graph did not load in time; keep polling in background")
    void pollGraphUntilDetected()
    return
  }

  // 種別判定に失敗した場合(DB系世代)もバックグラウンドで再試行する
  if (await detectGraphAndInit() === false) {
    console.warn("weekdays-and-weekends: graph type detection failed; retrying in background")
    void pollGraphUntilDetected()
  }

}/* end_main */


// グラフ種別を検出し、ファイルグラフなら初期化・DBグラフなら警告する
// 戻り値: 種別が確定したか(false = 判定不能)
const detectGraphAndInit = async (): Promise<boolean> => {
  // 検出失敗(DB系世代ホスト)時はグラフ種別不明のまま初期化しない
  if (await detectGraphType() === null) return false
  console.log(`weekdays-and-weekends: ${logseqDbGraph ? "DB graph" : "file graph"} detected. (Logseq ${logseqVersion})`)

  //100ms待つ
  await new Promise(resolve => setTimeout(resolve, 100))

  if (logseqDbGraph === true) {
    // DBグラフには対応していない
    showDbGraphIncompatibilityMsg()
    return true
  }

  await initializePlugin()
  return true
}


// グラフ種別が確定するまで定期的に再試行する(グラフ未読み込み/種別判定失敗時の復帰経路)
// 呼び出し時点より1つ新しい検出が反映されるまで継続し、他経路で確定しても終了する
const pollGraphUntilDetected = async () => {
  const target = graphAppliedSeq + 1
  while (graphAppliedSeq < target) {
    await new Promise(r => setTimeout(r, 3000))
    if (graphAppliedSeq >= target) return // 他経路で検出・初期化済み
    if (await hasCurrentGraph() === false) continue // グラフ未読み込み
    await detectGraphAndInit() // 成功すれば graphAppliedSeq が進みループを抜ける
  }
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

// 現在のグラフが読み込まれているか(API非搭載ホストでもtrue)
const hasCurrentGraph = async (): Promise<boolean> => {
  try {
    const graph = await (logseq.App as any).getCurrentGraph()
    return graph !== null && graph !== undefined // グラフ読み込み済み
  } catch {
    return true // API非搭載ホスト(0.10.x系)は待機不要
  }
}

// 現在のグラフが読み込まれるまで待機する(retries回 × intervalMs)
// ready直後にDemo DB等のグラフ作成が走る場合があり、未読み込み状態で判定すると誤検出するため
// true = グラフ読み込み済み(またはAPI非搭載で待機不要)、false = タイムアウトで未読み込み
const waitGraphReady = async (retries: number, intervalMs: number): Promise<boolean> => {
  for (let i = 0; i < retries; i++) {
    if (await hasCurrentGraph() === true) return true
    await new Promise(resolve => setTimeout(resolve, intervalMs))
  }
  return false
}

// アプリ世代の判定(バージョン解析のみ。グラフ種別の判定には使わない)
// DB系世代 = major>=2 or 0.11.x。バージョン不明は保守的にDB系世代扱い
const isDbEraApp = (): boolean => {
  const m = logseqVersion.match(/(\d+)\.(\d+)\.(\d+)/)
  if (m === null) return true
  return Number(m[1]) >= 2 || (Number(m[1]) === 0 && Number(m[2]) >= 11)
}

// DBグラフかどうかを検出し、結果をフラグへ反映する
// 検出中により新しい検出が開始された場合、その結果は古いグラフのものなので破棄する
// 戻り値: false=ファイルグラフ、true=DBグラフ、null=判定不能(失敗 or 破棄)
const detectGraphType = async (): Promise<boolean | null> => {
  const seq = ++graphCheckSeq
  for (let attempt = 1; ; attempt++) {
    const result = await checkLogseqDbGraph()
    if (result !== null) {
      if (seq !== graphCheckSeq) return null // より新しい検出が開始済み(この結果は古いグラフのもの)
      graphAppliedSeq = seq
      logseqDbGraph = result
      logseqVersionMd = !result //ファイルベースグラフ = !DBグラフ
      return result
    }
    // checkCurrentIsDbGraph非搭載の旧ホスト(0.10.x/OG 1.x系)= DBグラフを開けない → ファイルグラフ扱い
    if (isDbEraApp() === false) {
      if (seq === graphCheckSeq) {
        graphAppliedSeq = seq
        logseqDbGraph = false
        logseqVersionMd = true
      }
      return false
    }
    // DB系世代での失敗は一時的な可能性があるためリトライ(最大3回)
    if (attempt >= 3) return null
    await new Promise(r => setTimeout(r, 500))
  }
}

// DBグラフかどうかのチェック DBグラフだけtrue(検出失敗時はnull)
// 公式APIを使用。0.10.x以前のホストには未実装でrejectする → null
const checkLogseqDbGraph = async (): Promise<boolean | null> => {
  try {
    const value = await (logseq.App as any).checkCurrentIsDbGraph()
    if (typeof value === "boolean") return value
    if (dbCheckWarned === false) {
      dbCheckWarned = true
      console.warn("weekdays-and-weekends: checkCurrentIsDbGraph returned non-boolean", value)
    }
    return null
  } catch (e) {
    // API非搭載の旧ホスト(0.10.x/OG 1.x系)では必ず失敗するため警告しない。警告は一度だけ
    if (isDbEraApp() === true && dbCheckWarned === false) {
      dbCheckWarned = true
      console.warn("weekdays-and-weekends: checkCurrentIsDbGraph failed", e)
    }
    return null
  }
}

const showDbGraphIncompatibilityMsg = () => {
  logseq.UI.showMsg("The ’More journal templates’ plugin does not support Logseq DB graph.", "warning", { timeout: 5000 })
  return
}

logseq.ready(main).catch(console.error) //model