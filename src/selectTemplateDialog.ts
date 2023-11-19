import { t } from 'logseq-l10n'
import { key } from '.'
import { insertTemplateBlock } from './lib'

//selectTemplateDialog
export function selectTemplateDialog(uuid, dialogText, targetTemplate, replaceTemplate, updateSettings): Promise<void> {
  return new Promise((resolve) => {
    logseq.provideUI({
      attrs: {
        title: "🛌 Weekdays and Holidays " + t("Plugin"),
      },
      key,
      reset: true,
      template: `
    <p>${dialogText}</p>
    <hr/>
    <p>${t("Which template do you want to use?")}</p>
    <ul>
      <li><input type="radio" id="main" name="selectTemplateRadio" value="main"><label for="main">${targetTemplate}</label></li>
      <li><input type="radio" id="sub" name="selectTemplateRadio" value="sub"><label for="sub">${replaceTemplate}</label></li>
    </ul>
    <button type="button" id="selectTemplateButton">OK</button>
      `,
      style: {
        width: "440px",
        maxWidth: "440px",
        minWidth: "440px",
        height: "320px",
        left: "35vw",
        bottom: "unset",
        right: "unset",
        top: "10vw",
        padding: "1em",
        backgroundColor: 'var(--ls-primary-background-color)',
        color: 'var(--ls-primary-text-color)',
        boxShadow: '1px 2px 5px var(--ls-secondary-background-color)',
      },
    })

    setTimeout(() => {
      const button = parent.document.getElementById("selectTemplateButton") as HTMLButtonElement
      if (button) {
        let processing: Boolean = false
        button.addEventListener("click", () => {
          if (processing) return
          processing = true
          //radioボタンの値を取得する
          const select: string = (parent.document.querySelector('input[name="selectTemplateRadio"]:checked') as HTMLInputElement)!.value
          if (!select) return processing = false
          let selectTemplate = ""
          if (select === "main") {
            selectTemplate = targetTemplate
          }
          else if (select === "sub") {
            selectTemplate = replaceTemplate
            if (updateSettings === "sub") logseq.updateSettings({ switchSetTemplate: selectTemplate })
          } else {
            return processing = false
          }

          logseq.showMainUI()
          //テンプレートを挿入する
          insertTemplateBlock(uuid, selectTemplate)
          logseq.hideMainUI()

          //ダイアログを閉じる
          const element = parent.document.getElementById(logseq.baseInfo.id + `--${key}`) as HTMLDivElement | null
          if (element) element.remove()
          processing = false
          resolve()
        })
      }
    }, 100)
  })
}
