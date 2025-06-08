import Holidays from 'date-holidays'
import { t } from 'logseq-l10n'
import { checkJournalsOrJournalSingle, checkMatchDay, checkWeekday, insertTemplateBlock } from './lib'
import { selectTemplateDialog } from './selectTemplateDialog'
import { booleanLogseqVersionMd } from '.'

export const rendering = () => {

  // 祝日ライブラリ初期化
  const hd = new Holidays()
  hd.init((logseq.settings!.switchHolidaysCountry as string).split(":")[0],
    logseq.settings!.switchHolidaysState as string,
    logseq.settings!.switchHolidaysRegion as string,
    { types: ["public"] })

  //rendering
  logseq.App.onMacroRendererSlotted(async ({ slot, payload }) => {
    const [type, template, weekdays] = payload.arguments as string[]

    if (type === ":Weekdays")  //:weekdays
      await weekdaysRenderer(slot, payload, template, weekdays, hd)
  })
}


const weekdaysRenderer = async (slot: string, payload: any, template: string, weekdays: string, hd: Holidays) => {
  let rendering = "" //rendering flag
  if (rendering === slot) return
  const logseqVersionMd = booleanLogseqVersionMd() //logseq version check
  rendering = slot//重複実行防止
  logseq.Editor.exitEditingMode()
  const day: Date | null = await checkJournalsOrJournalSingle() //日誌だったらレンダリング実行
  if (template
    && weekdays
    && day) {

    let isHoliday = ""
    let isPrivate: Boolean = false
    let isWorkingOnHolidays: Boolean = false

    if ((logseq.settings!.switchWorkingOnHolidays === true && logseqVersionMd === true)
      && (logseq.settings!.switchWorkingOnHolidaysTemplateName
        || logseq.settings!.selectWorkingOnHolidaysSetTemplate === true)
      && logseq.settings!.workingOnHolidaysArray)
      isWorkingOnHolidays = checkMatchDay(logseq.settings!.workingOnHolidaysArray as [], day) as boolean

    if (isWorkingOnHolidays === false
      && (logseq.settings!.switchPrivate === true && logseqVersionMd === true)
      && logseq.settings!.switchPrivateTemplateName
      && logseq.settings!.privateDaysArray)
      isPrivate = checkMatchDay(logseq.settings!.privateDaysArray as [], day) as boolean

    if (isWorkingOnHolidays === false
      && isPrivate === false
      && logseq.settings!.switchHolidays === true
      && logseq.settings!.switchHolidaysCountry
      && logseq.settings!.switchHolidaysTemplateName) {
      const checkHoliday = hd.isHoliday(day) //test new Date("2023/05/03")
      if (checkHoliday) isHoliday = `${checkHoliday[0].name} (${checkHoliday[0].type})`
    }

    if (isWorkingOnHolidays === true) {
      const thisTemplate = logseq.settings!.selectWorkingOnHolidaysSetTemplate === true ?
        logseq.settings!.switchSetTemplate
        : logseq.settings!.switchWorkingOnHolidaysTemplateName
      //dialog
      await selectTemplateDialog(payload.uuid,
        t("Today is Working-on-Holidays.<br/>Choose the template for today, either Main or Working-on-Holidays."),
        template,
        thisTemplate,
        "")
    } else
      if (isPrivate === true)
        //dialog
        await selectTemplateDialog(payload.uuid,
          t("Today is Private days.<br/>Choose the template for today, either Main or Private."),
          template,
          logseq.settings!.switchPrivateTemplateName,
          "")
      else
        if (isHoliday)
          //dialog
          await selectTemplateDialog(payload.uuid,
            t("Today is ") + isHoliday + t(".<br/>Choose the template for today, either Main or Holidays."),
            template,
            logseq.settings!.switchHolidaysTemplateName,
            "")
        else
          if ((logseq.settings!.switchMainSub === true && logseqVersionMd === true)
            && logseq.settings!.switchMainTemplateName === template
            && logseq.settings!.switchSubTemplateName) { //Switch to Sub Template
            if (logseq.settings!.switchAlertDay
              && checkWeekday(logseq.settings!.switchAlertDay as string, day) === true)
              //アラート日の場合
              //dialog
              await selectTemplateDialog(payload.uuid,
                t("Choose the template for this week, either Main or Sub."),
                template,
                logseq.settings!.switchSubTemplateName,
                "sub")
            else
              if (weekdays === "ALL"
                || checkWeekday(weekdays, day) === true) {
                let setTemplate
                if (logseq.settings!.switchSetTemplate)
                  setTemplate = logseq.settings!.switchSetTemplate
                else
                  setTemplate = template

                //セットされたテンプレートを挿入
                await insertTemplateBlock(payload.uuid, setTemplate)
              }
          }
          else
            if (weekdays === "ALL"
              || checkWeekday(weekdays, day) === true)
              await insertTemplateBlock(payload.uuid, template)

    setTimeout(() => rendering = "", 1000)
    return
  }

  // 選択画面
  logseq.provideUI({
    key: `${slot}`,
    reset: true,
    slot,
    template: `<label title="Waiting renderer"> ${t("WAITING")}: ${template}, ${weekdays} </label>`,
    style: {
      color: "var(--ls-link-ref-text-hover-color)",
      border: "2px solid var(--ls-link-ref-text-hover-color)",
      paddingTop: "0.2em",
      paddingBottom: "0.2em",
      margin: "0.2em",
      borderRadius: "5px",
    }
  })

}
