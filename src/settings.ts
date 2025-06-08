import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user'
import { isAfter, sub } from 'date-fns'
import { t } from "logseq-l10n"
import { supportedCountries } from './supportedCountries'

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
    description: t("https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/wiki/English-document"),
    default: "",
  },
  //Sub Template
  {
    key: "",
    title: t("[Option]") + " " + t("Weekly sub template"),
    type: "heading",
    description: t("Set up an alert to switch templates on specific days of the week."),
    default: "",
  },
  {
    key: "switchMainSub",
    title: t("Enable"),
    type: "boolean",
    description: t("On the alert day, when the Main-Template renderer is invoked, the option to switch between Main and Sub templates for the week is available."),
    default: false,
  },
  {
    // アラートの曜日にトリガーする
    key: "switchAlertDay",
    title: t("Alert on the specific day of the week"),
    type: "enum",
    enumChoices: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    description: t("For select Main/Sub templates"),
    default: "Mon",
  },
  {
    key: "switchMainTemplateName",
    title: t("Target template name"),
    type: "string",
    description: t("Input required.") + "/" + t("The template name to be switched when the alert day is reached."),
    default: "Main-Template",
  },
  {
    key: "switchSubTemplateName",
    title: t("Sub-Template name"),
    type: "string",
    description: t("Input required.") + "/" + t("The template name to be switched when the alert day is reached."),
    default: "Sub-Template",
  },
  {
    key: "switchSetTemplate",
    title: t("Template name whose selection is currently fixed"),
    type: "string",
    description: t("--No editing is needed. For editing manually."),
    default: "",
  },
  //holidays
  {
    // 祝日にテンプレートを切り替える
    key: "",
    title: t("[Option]") + " " + t("Holidays-Template"),
    type: "heading",
    description: t("Set up an alert to switch templates on holidays."),
    default: "",
  },
  {
    key: "switchHolidays",
    title: t("Enable"),
    type: "boolean",
    description: "",
    default: false,
  },
  {
    key: "switchHolidaysTemplateName",
    title: t("Holidays template name"),
    type: "string",
    description: "",
    default: "Holidays-Template",
  },
  {
    key: "switchHolidaysCountry",
    title: t("Supported countries"),
    type: "enum",
    enumPicker: "select",
    enumChoices: supportedCountries,
    description: t("Select your country. If possible to set the State and Region, do so individually.") + "https://github.com/commenthol/date-holidays#supported-countries-states-regions",
    default: ByLanguage,
  },
  {
    key: "switchHolidaysState",
    title: t("Supported states (matches the country)"),
    type: "string",
    description: t("2-character alphanumeric code (ex, NY) or blank (default)"),
    default: "",
  },
  {
    key: "switchHolidaysRegion",
    title: t("Supported regions (matches the country)"),
    type: "string",
    description: t("2 or 3 character alphanumeric code or blank (default)"),
    default: "",
  },
  //Private holidays
  {
    //個人休暇にテンプレートを切り替える
    key: "",
    title: t("[Option]") + " " + t("Private holiday (or annual leave)"),
    type: "heading",
    description: t("Set up an alert to switch templates on private holidays."),
    default: "",
  },
  {
    key: "switchPrivate",
    title: t("Enable"),
    type: "boolean",
    description: "",
    default: false,
  },
  {
    key: "selectPrivateDays",
    title: t("Choice multiple dates"),
    type: "boolean",
    description: t("(Open a new window on click this checkbox)"),
    default: false,
  },
  {
    key: "switchPrivateTemplateName",
    title: t("Private holiday template name"),
    type: "string",
    description: "",
    default: "Holidays-Template",
  },
  //Working-on-Holidays
  {
    key: "",
    title: t("[Option]") + " " + t("Working-on-Holidays"),
    type: "heading",
    description: t("Set up an alert to switch templates on working-on-holidays."),
    default: "",
  },
  {
    key: "switchWorkingOnHolidays",
    title: t("Enable"),
    type: "boolean",
    description: "",
    default: false,
  },
  {
    key: "selectWorkingOnHolidays",
    title: t("Choice multiple dates"),
    type: "boolean",
    description: t("(Open a new window on click this checkbox)"),
    default: false,
  },
  {
    key: "selectWorkingOnHolidaysSetTemplate",
    title: t("Apply the currently selected main or sub template"),
    type: "boolean",
    description: "",
    default: true,
  },
  {
    key: "switchWorkingOnHolidaysTemplateName",
    title: t("Working-on-Holidays template name"),
    type: "string",
    description: t("If the above item is 'false'"),
    default: "Main-Template",
  },
]


export function getDates(target: string) {
  let id = ""
  if (target === "PrivateDays") {
    id = "p"
    logseq.updateSettings({ privateDaysArray: null })
  } else
    if (target === "WorkingOnHolidays") {
      id = "w"
      logseq.updateSettings({ workingOnHolidaysArray: null })
    } else {
      console.error("Error: getDates")
      return
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
    if (!isNaN(inputDate.getTime()))
      DaysArray.push(inputDate)
  }

  if (target === "PrivateDays")
    logseq.updateSettings({ privateDaysArray: DaysArray })
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


export const selectDaysByUser = (target: string) => {
  let key = ""
  let title = ""
  let id = ""
  let onClick = ""
  if (target === "PrivateDays") {
    key = target
    title = t("Private Days")
    id = "p"
    onClick = "getDatesPrivateDays"
  } else
    if (target === "WorkingOnHolidays") {
      key = "WorkingOnHolidays"
      title = t("Working-on-Holidays")
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
        backgroundColor: "var(--ls-block-properties-background-color)",
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
    setTimeout(() => {
      if (target === "PrivateDays")
        savedDays("p", logseq.settings?.privateDaysArray as Date[])
      else
        if (target === "WorkingOnHolidays")
          savedDays("w", logseq.settings?.workingOnHolidaysArray as Date[])
        else
          console.error("Error: setSeavedDates")
    }, 300)
  }
}


const savedDays = (id: string, setting: Date[]) => {
  if (setting === null) return console.error("Error: savedDays")
  const privateDaysArray: Date[] = setting // 保存された日付の配列を取得
  const dateIds = [`${id}date1`, `${id}date2`, `${id}date3`, `${id}date4`, `${id}date5`, `${id}date6`, `${id}date7`, `${id}date8`, `${id}date9`, `${id}date10`] // 日付のIDを格納する配列
  for (let i = 0;
    i < privateDaysArray.length
    && i < dateIds.length;
    i++) { // 日付を1つずつ処理するループ
    if (privateDaysArray[i] === undefined) continue
    const inputDate = new Date(privateDaysArray[i]) // 日付をDateオブジェクトに変換
    if (isAfter(inputDate, sub(new Date(), { days: 1 }))) { // 日付が今日より後の場合のみ、値をセットする
      const dateInput = parent.document.getElementById(dateIds[i]) as HTMLInputElement | null // 日付入力欄に値をセット
      if (dateInput)
        dateInput.value = inputDate.toISOString().slice(0, 10) // yyyy-mm-ddの形式に変換
    }
  }
}

