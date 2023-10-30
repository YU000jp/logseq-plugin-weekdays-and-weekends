import { PageEntity } from '@logseq/libs/dist/LSPlugin.user'


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
