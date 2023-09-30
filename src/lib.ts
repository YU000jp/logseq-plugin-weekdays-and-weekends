import { PageEntity } from '@logseq/libs/dist/LSPlugin.user';



export async function checkJournals() {
  const page = await logseq.Editor.getCurrentPage() as PageEntity | null; //Journalsの場合はnull
  if (page) {
    // if (page["journal?"] === true) { //Journal day
    //   return true;
    // }
    //今日以外も含まれてしまうのでコメントアウト
    return false; //Non-Journal
  } else {
    return true; //Journals
  }
}
export const convertLanguageCodeToCountryCode = (languageCode: string): string => {
  switch (languageCode) {
    case "en":
      return "US: United States of America";
    case "fr":
      return "FR: France";
    case "de":
      return "DE: Deutschland";
    case "nl":
      return "NL: Nederland";
    case "zh-CN":
      return "CN: 中华人民共和国";
    case "zh-Hant":
      return "TW: 中華民國";
    case "af":
      return "ZA: South Africa";
    case "es":
      return "ES: España";
    case "nb-NO":
      return "NO: Norge";
    case "pl":
      return "PL: Polska";
    case "pt-BR":
      return "BR: Brasil";
    case "pt-PT":
      return "PT: Portugal";
    case "ru":
      return "RU: Россия";
    case "ja":
      return "JP: 日本";
    case "it":
      return "IT: Italia";
    case "tr":
      return "TR: Türkiye";
    case "uk":
      return "UA: Україна";
    case "ko":
      return "KR: 대한민국";
    case "sk":
      return "SK: Slovenská republika";
    default:
      return "US: United States of America";
  }
};
