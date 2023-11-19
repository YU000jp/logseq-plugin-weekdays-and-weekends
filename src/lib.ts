import { PageEntity } from '@logseq/libs/dist/LSPlugin.user'
import { t } from 'logseq-l10n'


const getJournalDayDate = (str: string): Date => new Date(
  Number(str.slice(0, 4)), //year
  Number(str.slice(4, 6)) - 1, //month 0-11
  Number(str.slice(6)) //day
)

export const checkJournalsOrJournalSingle = async (): Promise<Date | null> => {
  const page = await logseq.Editor.getCurrentPage() as PageEntity | null //Journalsの場合はnull
  if (page) {
    if (page["journal?"] === true
      && page.journalDay) return getJournalDayDate(String(page.journalDay))//日誌の日付だった場合
    return null //Non-Journal
  } else {
    return new Date() //Journals
  }
}
export const convertLanguageCodeToCountryCode = (languageCode: string): string => {
  switch (languageCode) {
    case "en":
      return "US: United States of America"
    case "fr":
      return "FR: France"
    case "de":
      return "DE: Deutschland"
    case "nl":
      return "NL: Nederland"
    case "zh-CN":
      return "CN: 中华人民共和国"
    case "zh-Hant":
      return "TW: 中華民國"
    case "af":
      return "ZA: South Africa"
    case "es":
      return "ES: España"
    case "nb-NO":
      return "NO: Norge"
    case "pl":
      return "PL: Polska"
    case "pt-BR":
      return "BR: Brasil"
    case "pt-PT":
      return "PT: Portugal"
    case "ru":
      return "RU: Россия"
    case "ja":
      return "JP: 日本"
    case "it":
      return "IT: Italia"
    case "tr":
      return "TR: Türkiye"
    case "uk":
      return "UA: Україна"
    case "ko":
      return "KR: 대한민국"
    case "sk":
      return "SK: Slovenská republika"
    default:
      return "US: United States of America"
  }
}
export async function insertTemplateBlock(blockUuid, template: string) {
  // @logseq/lib v0.0.15導入
  // ブロックではなく、テンプレートとして読み込む。SmartBlocksなどのプラグインも動作するようになる。Dynamic variablesも動作する
  //https://github.com/logseq/logseq/blob/a5e31128a6366df002488203406684f78d80c7e3/libs/src/LSPlugin.ts#L449
  logseq.showMainUI()

  logseq.Editor.updateBlock(blockUuid, "")
  const exist = await logseq.App.existTemplate(template) as boolean
  if (exist === true) {
    logseq.UI.showMsg(`${t("Insert template")} "${template}"`, "success", { timeout: 2200 })
    const newBlock = await logseq.Editor.insertBlock(blockUuid, "", { sibling: true, isPageBlock: true, before: true, focus: false })
    if (newBlock) {
      logseq.App.insertTemplate(newBlock.uuid, template).finally(() => {
        console.log(`Render insert template ${template}`)
        logseq.Editor.removeBlock(blockUuid)
        setTimeout(() => logseq.Editor.exitEditingMode(), 100)
      })
    }
  } else {
    logseq.UI.showMsg(t("The Template not found."), "warming", { timeout: 5000 })
    console.warn(`Template "${template}" not found.`)
  }

  setTimeout(() => logseq.hideMainUI(), 200)
}
