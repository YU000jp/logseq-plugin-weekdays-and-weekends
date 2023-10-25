import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user'
import { isAfter, sub } from 'date-fns'
import { t } from "logseq-l10n"

//userSettings
// https://logseq.github.io/plugins/types/SettingSchemaDesc.html
//設定画面の文章変更時は、translations/ja.jsonも変更する (翻訳が反映されなくなる)
// t() L10N framework
//最終更新 2023/05/05
export const settingsTemplate = (ByLanguage: string): SettingSchemaDesc[] => [
  {
    key: "",
    title: t("Check Wiki to setup"),
    type: "heading",
    description: t("https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/wiki/English-Document"),
    default: "",
  },
  //Sub Template
  {
    key: "",
    title: t("[Option] Sub-Template for a week"),
    type: "heading",
    description: t("Use alert for switching templates on specific days of the week."),
    default: "",
  },
  {
    key: "switchMainSub",
    title: t("Turn on:"),
    type: "boolean",
    description: t("On Alert day, when a Main-Template renderer is called, it is possible to switch between main and sub templates for the week."),
    default: false,
  },
  {
    key: "switchAlertDay",
    title: t("Trigger: Alert day"),
    type: "enum",
    enumChoices: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    description: t("For select Main/Sub templates"),
    default: "Mon",
  },
  {
    key: "switchMainTemplateName",
    title: t("Target: Main-Template name *"),
    type: "string",
    description: t("Fill in the Main-Template specified in a renderer."),
    default: "Main-Template",
  },
  {
    key: "switchSubTemplateName",
    title: t("Call: Sub-Template name *"),
    type: "string",
    description: "",
    default: "Sub-Template",
  },
  {
    key: "switchSetTemplate",
    title: t("Set: current template name by switching"),
    type: "string",
    description: t("--No editing is needed. For editing manually."),
    default: "",
  },
  //holidays
  {
    key: "",
    title: t("[Option] Holidays-Template"),
    type: "heading",
    description: t("Use alert for switching templates on holidays."),
    default: "",
  },
  {
    key: "switchHolidays",
    title: t("Turn on:"),
    type: "boolean",
    description: t("When renderers is called, prioritize holidays."),
    default: false,
  },
  {
    key: "switchHolidaysTemplateName",
    title: t("Call: Holidays-Template name *"),
    type: "string",
    description: "",
    default: "Holidays-Template",
  },
  {
    key: "switchHolidaysCountry",
    title: t("Supported countries *"),
    type: "enum",
    enumPicker: "select",
    enumChoices: ["AD: Andorra", "AE: دولة الإمارات العربية المتحدة", "AG: Antigua & Barbuda", "AI: Anguilla", "AL: Shqipëri", "AM: Հայաստան", "AO: Angola", "AR: Argentina", "AS: American Samoa", "AT: Österreich", "AU: Australia", "AW: Aruba", "AX: Landskapet Åland", "AZ: Azərbaycan Respublikası", "BA: Bosna i Hercegovina", "BB: Barbados", "BD: গণপ্রজাতন্ত্রী বাংলাদেশ", "BE: Belgique", "BF: Burkina Faso", "BG: България", "BH: مملكة البحرين", "BI: République du Burundi", "BJ: République du Bénin", "BL: St. Barthélemy", "BM: Bermuda", "BN: Negara Brunei Darussalam", "BO: Bolivia", "BQ: Caribisch Nederland", "BR: Brasil", "BS: Bahamas", "BW: Botswana", "BY: Рэспубліка Беларусь", "BZ: Belize", "CA: Canada", "CC: Cocos (Keeling) Islands", "CD: République démocratique du Congo", "CF: République centrafricaine", "CG: République du Congo", "CH: Schweiz", "CI: République de Côte d'Ivoire", "CK: Cook Islands", "CL: Chile", "CM: Cameroun", "CN: 中华人民共和国", "CO: Colombia", "CR: Costa Rica", "CU: Cuba", "CV: República de Cabo Verde", "CW: Curaçao", "CX: Christmas Island", "CY: Κύπρος", "CZ: Česká republika", "DE: Deutschland", "DJ: République de Djibouti", "DK: Danmark", "DM: Dominica", "DO: República Dominicana", "DZ: الجمهورية الجزائرية الديمقراطية الشعبية", "EC: Ecuador", "EE: Eesti", "EG: جمهورية مصر العربية", "EH: الجمهورية العربية الصحراوية الديمقراطية", "ER: Eritrea", "ES: España", "ET: ኢትዮጵያ", "FI: Suomi", "FJ: Matanitu Tugalala o Viti", "FO: Føroyar", "FR: France", "GA: Gabon", "GB: United Kingdom", "GD: Grenada", "GE: საქართველო", "GF: Guyane", "GG: Guernsey", "GH: Ghana", "GI: Gibraltar", "GL: Kalaallit Nunaat", "GM: The Gambia", "GN: Guinée", "GP: Guadeloupe", "GQ: República de Guinea Ecuatorial", "GR: Ελλάδα", "GT: Guatemala", "GU: Guam", "GW: Guiné-Bissau", "GY: Guyana", "HK: 香港", "HN: Honduras", "HR: Hrvatska", "HT: Haïti", "HU: Magyarország", "IC: Islas Canarias", "ID: Indonesia", "IE: Ireland", "IL: מְדִינַת יִשְׂרָאֵל", "IM: Isle of Man", "IR: جمهوری اسلامی ایران", "IS: Ísland", "IT: Italia", "JE: Jersey", "JM: Jamaica", "JP: 日本", "KE: Kenya", "KM: Union des Comores", "KN: St. Kitts & Nevis", "KR: 대한민국", "KY: Cayman Islands", "LC: St. Lucia", "LI: Lichtenstein", "LR: Liberia", "LS: \'Muso oa Lesotho", "LT: Lietuva", "LU: Luxembourg", "LV: Latvija", "LY: دولة ليبيا", "MA: المملكة المغربية", "MC: Monaco", "MD: Republica Moldova", "ME: Crna Gora", "MF: Saint Martin", "MG: Repoblikan'i Madagasikara", "MK: Република Македонија", "ML: République du Mali", "MQ: Martinique", "MR: الجمهورية الإسلامية الموريتانية", "MS: Montserrat", "MT: Malta", "MW: Malawi", "MX: México", "MY: Malaysia", "MZ: Moçambique", "NA: Namibia", "NC: Nouvelle-Calédonie", "NE: République du Niger", "NG: Nigeria", "NI: Nicaragua", "NL: Nederland", "NO: Norge", "NZ: New Zealand", "PA: Panamá", "PE: Perú", "PH: Philippines", "PL: Polska", "PM: St. Pierre & Miquelon", "PR: Puerto Rico", "PT: Portugal", "PY: Paraguay", "RE: Réunion", "RO: Romania", "RS: Република Србија", "RU: Россия", "RW: Rwanda", "SC: Seychelles", "SD: جمهورية السودان", "SE: Sverige", "SG: Singapore", "SH: St. Helena", "SI: Republika Slovenija", "SJ: Svalbard & Jan Mayen", "SK: Slovenská republika", "SL: Sierra Leone", "SM: San Marino", "SN: République du Sénégal", "SO: Jamhuuriyadda Federaalka Soomaaliya", "SR: Suriname", "SS: South Sudan", "ST: São Tomé & Príncipe", "SV: El Salvador", "SX: Sint Maarten", "SZ: Eswatini", "TC: Turks & Caicos Islands", "TD: جمهورية تشاد", "TG: République togolaise", "TH: Thailand", "TN: الجمهورية التونسية", "TO: Puleʻanga Fakatuʻi ʻo Tonga", "TR: Türkiye", "TT: Trinidad & Tobago", "TW: 中華民國", "TZ: Tanzania", "UA: Україна", "UG: Uganda", "US: United States of America", "UY: Uruguay", "VA: Stato della Città del Vaticano", "VC: St. Vincent & Grenadines", "VE: Venezuela", "VG: British Virgin Islands", "VI: U.S. Virgin Islands", "VN: Cộng hòa Xã hội chủ nghĩa Việt Nam", "VU: République de Vanuatu", "XK: Republika e Kosovës", "YT: Mayotte", "ZA: South Africa", "ZM: Zambia", "ZW: Zimbabwe"],
    description: t('Select your country. If possible to set the State and Region, do so individually. https://github.com/commenthol/date-holidays#supported-countries-states-regions'),
    default: ByLanguage || "US: United States of America",
  },
  {
    key: "switchHolidaysState",
    title: t("Supported states (Match country)"),
    type: "string",
    description: '2-character alphanumeric code (ex, NY) or blank (default)',
    default: "",
  },
  {
    key: "switchHolidaysRegion",
    title: t("Supported regions (Match country)"),
    type: "string",
    description: '2 or 3 character alphanumeric code or blank (default)',
    default: "",
  },
  //Private holidays
  {
    key: "",
    title: t("[Option] Private holiday (or annual leave)"),
    type: "heading",
    description: t("Use alert for switching templates on the private holidays."),
    default: "",
  },
  {
    key: "switchPrivate",
    title: t("Turn on:"),
    type: "boolean",
    description: t("When renderers are called, prioritize them over others."),
    default: false,
  },
  {
    key: "selectPrivateDays",
    title: t("select multiple dates"),
    type: "boolean",
    description: t("(Open a new model on click this checkbox)"),
    default: false,
  },
  {
    key: "switchPrivateTemplateName",
    title: t("Call: Private-Template name *"),
    type: "string",
    description: "",
    default: "Holidays-Template",
  },
  //Working on holidays
  {
    key: "",
    title: t("[Option] Working on holidays"),
    type: "heading",
    description: t("Use alert for switching templates on the working on holidays."),
    default: "",
  },
  {
    key: "switchWorkingOnHolidays",
    title: t("Turn on:"),
    type: "boolean",
    description: t("When renderers are called, prioritize them over others."),
    default: false,
  },
  {
    key: "selectWorkingOnHolidays",
    title: t("select multiple dates"),
    type: "boolean",
    description: t("(Open a new model on click this checkbox)"),
    default: false,
  },
  {
    key: "selectWorkingOnHolidaysSetTemplate",
    title: t("Use setting option of current template name"),
    type: "boolean",
    description: "",
    default: true,
  },
  {
    key: "switchWorkingOnHolidaysTemplateName",
    title: t("Call: template name of Working On Holidays"),
    type: "string",
    description: t("If the boolean setting item above is false"),
    default: "Main-Template",
  },
]


export function getDates(target) {
  let id = ""
  if (target === "PrivateDays") {
    id = "p"
    logseq.updateSettings({ privateDaysArray: null })
  } else if (target === "WorkingOnHolidays") {
    id = "w"
    logseq.updateSettings({ workingOnHolidaysArray: null })
  } else {
    return console.error("Error: getDates");;
  }
  const DaysArray: Date[] = [] // 日付を格納する配列を初期化
  const dateIds = [`${id}date1`, `${id}date2`, `${id}date3`, `${id}date4`, `${id}date5`, `${id}date6`, `${id}date7`, `${id}date8`, `${id}date9`, `${id}date10`] // 日付のIDを格納する配列
  for (const dateId of dateIds) { // 日付のIDを1つずつ処理するループ
    const ele = parent.document.getElementById(dateId) as HTMLInputElement | null // 日付入力欄を取得
    if (!ele) continue
    const value = ele.value // 日付入力欄の値を取得
    if (!value) continue
    const inputDate = new Date(value) // 日付の値を取得

    // 日付が有効な日付かどうかをチェックし、日付を配列に追加
    if (!isNaN(inputDate.getTime())) DaysArray.push(inputDate)
  }
  if (target === "PrivateDays") logseq.updateSettings({ privateDaysArray: DaysArray })
  else
    if (target === "WorkingOnHolidays")
      logseq.updateSettings({ workingOnHolidaysArray: DaysArray })

  logseq.UI.showMsg(t("Saved"), "success", { timeout: 2000 })

  setTimeout(() => {
    //ポップアップ削除
    const element = parent.document.querySelector(`body>div[data-ref="${logseq.baseInfo.id}"]`) as HTMLDivElement | null
    if (element) element.remove()
  }, 100)

}


export function selectDaysByUser(target) {
  let key, title, id, onClick
  if (target === "PrivateDays") {
    key = target
    title = t("Private Days")
    id = "p"
    onClick = "getDatesPrivateDays"
  } else if (target === "WorkingOnHolidays") {
    key = "WorkingOnHolidays"
    title = t("Working on Holidays")
    id = "w"
    onClick = "getDatesWorkingOnHolidays"
  } else {
    console.error("Error: selectDaysByUser")
    return
  }
  //機能の日付
  const today = new Date()
  const formattedDate = today.toISOString().slice(0, 10)
  try {
    logseq.provideUI({
      key,
      attrs: {
        title,
      },
      close: "outside",
      reset: true,
      template: `
    <form class="setDates" title="${t("Click the right end of the input field to display a calendar to enter the date.")}">
      <div><label for="date1">${t("Date")} 1:</label>
      <input type="date" id="${id}date1" name="date1" min="${formattedDate}"/></div>
      
      <div><label for="date2">${t("Date")} 2:</label>
      <input type="date" id="${id}date2" name="date2" min="${formattedDate}"/></div>

      <div><label for="date3">${t("Date")} 3:</label>
      <input type="date" id="${id}date3" name="date3" min="${formattedDate}"/></div>

      <div><label for="date4">${t("Date")} 4:</label>
      <input type="date" id="${id}date4" name="date4" min="${formattedDate}"/></div>

      <div><label for="date5">${t("Date")} 5:</label>
      <input type="date" id="${id}date5" name="date5" min="${formattedDate}"/></div>

      <div><label for="date6">${t("Date")} 6:</label>
      <input type="date" id="${id}date6" name="date6" min="${formattedDate}"/></div>

      <div><label for="date7">${t("Date")} 7:</label>
      <input type="date" id="${id}date7" name="date7" min="${formattedDate}"/></div>

      <div><label for="date8">${t("Date")} 8:</label>
      <input type="date" id="${id}date8" name="date8" min="${formattedDate}"/></div>

      <div><label for="date9">${t("Date")} 9:</label>
      <input type="date" id="${id}date9" name="date9" min="${formattedDate}"/></div>

      <div><label for="date10">${t("Date")} 10:</label>
      <input type="date" id="${id}date10" name="date10" min="${formattedDate}"/></div>

      <p><small>${t("Remove dates before today.")}</small></p>
      <button type="button" data-on-click="${onClick}">${t("Submit")}</button>
    </form>
    `,
      style: {
        color: "var(--ls-link-ref-text-hover-color)",
        background: "var(--ls-block-properties-background-color)",
        paddingTop: "0.2em",
        paddingBottom: "0.2em",
        margin: "0.2em",
        borderRadius: "5px",
        position: "fixed",
        top: "5em",
        right: "5em",
        zIndex: "1000",
        outline: "2px solid var(--ls-link-ref-text-hover-color)",
        boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)",
        width: "300px",
        maxHeight: "1000px",
      }
    })
  } finally {
    // ページ読み込み時に実行して、保存された日付をフォームにセットする
    setTimeout(() => savedDays(target), 300)
  }
}


function savedDays(target) {
  let id, setting
  if (target === "PrivateDays") {
    id = "p"
    setting = logseq.settings?.privateDaysArray
  } else if (target === "WorkingOnHolidays") {
    id = "w"
    setting = logseq.settings?.workingOnHolidaysArray
  } else {
    console.error("Error: setSavedDates")
    return
  }
  if (setting) {
    const privateDaysArray: Date[] = setting // 保存された日付の配列を取得
    const dateIds = [`${id}date1`, `${id}date2`, `${id}date3`, `${id}date4`, `${id}date5`, `${id}date6`, `${id}date7`, `${id}date8`, `${id}date9`, `${id}date10`] // 日付のIDを格納する配列
    const yesterday = sub(new Date(), { days: 1 })
    for (let i = 0; i < privateDaysArray.length && i < dateIds.length; i++) { // 日付を1つずつ処理するループ
      if (privateDaysArray[i] === undefined) continue
      const inputDate = new Date(privateDaysArray[i]) // 日付をDateオブジェクトに変換
      if (isAfter(inputDate, yesterday)) { // 日付が今日より後の場合のみ、値をセットする
        const formattedDate = inputDate.toISOString().slice(0, 10) // yyyy-mm-ddの形式に変換
        const dateInput = parent.document.getElementById(dateIds[i]) as HTMLInputElement | null // 日付入力欄に値をセット
        if (dateInput) dateInput.value = formattedDate
      }
    }
  }
}

