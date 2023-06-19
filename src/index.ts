import '@logseq/libs'; //https://plugins-doc.logseq.com/
import { IBatchBlock, SettingSchemaDesc, LSPluginBaseInfo, AppUserConfigs } from '@logseq/libs/dist/LSPlugin.user';
import Holidays from 'date-holidays'; //https://github.com/commenthol/date-holidays
import { setup as l10nSetup, t } from "logseq-l10n"; //https://github.com/sethyuan/logseq-l10n
import ja from "./translations/ja.json";
const key = "selectTemplateDialog";


const main = () => {

  /* slash command */
  let processingSlashCommand = false;
  logseq.Editor.registerSlashCommand("Create sample for weekdays renderer", async ({ uuid }) => {
    if (processingSlashCommand) return;
    const check = await checkJournals();//ジャーナルでは許可しない
    if (check === true) {
      logseq.UI.showMsg("This is journal page. ", "error");
      return;
    }
    processingSlashCommand = true;
    await insertSampleTemplates(uuid);
    processingSlashCommand = false;
  });
  //end


  //TODO: 保留
  logseq.Editor.registerSlashCommand("Add :Weekdays-renderer at Editing cursor", async () => {
    logseq.Editor.insertAtEditingCursor(
      `{{renderer :Weekdays, TemplateName, Sat&Sun}} `
    );
  });


  let rendering = ""; //rendering flag
  //rendering
  logseq.App.onMacroRendererSlotted(async ({ slot, payload }) => {
    if (rendering === slot) { return; }
    rendering = slot;
    const [type, template, weekdays] = payload.arguments as string[];

    if (type === ":Weekdays") {//:weekdays

      const check: boolean = await checkJournals();//ジャーナルだったらレンダリング実行
      if (template && weekdays && check === true) {
        //switchMainTemplateName
        //switchSubTemplateName
        //switchAlertDay

        // Switch on holidays
        let isHoliday = "";
        // Switch on private days
        let isPrivate: Boolean = false;
        // Switch on working on holidays
        let isWorkingOnHolidays: Boolean = false;
        if (logseq.settings?.switchWorkingOnHolidays === true && (logseq.settings?.switchWorkingOnHolidaysTemplateName || logseq.settings?.selectWorkingOnHolidaysSetTemplate === true) && logseq.settings?.workingOnHolidaysArray) {
          isWorkingOnHolidays = checkMatchToday(logseq.settings?.workingOnHolidaysArray) as boolean;
        }
        if (isWorkingOnHolidays === false && logseq.settings?.switchPrivate === true && logseq.settings?.switchPrivateTemplateName && logseq.settings?.privateDaysArray) {
          isPrivate = checkMatchToday(logseq.settings?.privateDaysArray) as boolean;
        }
        if (isWorkingOnHolidays === false && isPrivate === false && logseq.settings?.switchHolidays === true && logseq.settings?.switchHolidaysCountry && logseq.settings?.switchHolidaysTemplateName) {
          const hd = new Holidays();
          const array = (logseq.settings?.switchHolidaysCountry).split(":");
          hd.init(array[0], logseq.settings?.switchHolidaysState, logseq.settings?.switchHolidaysRegion);
          const checkHoliday = hd.isHoliday(new Date()); //test new Date("2023/05/03")
          if (checkHoliday) {
            isHoliday = `${checkHoliday[0].name} (${checkHoliday[0].type})`;
          }
        }
        if (isWorkingOnHolidays === true) {
          let thisTemplate;
          if (logseq.settings?.selectWorkingOnHolidaysSetTemplate === true) {
            thisTemplate = logseq.settings?.switchSetTemplate;
          } else {
            thisTemplate = logseq.settings?.switchWorkingOnHolidaysTemplateName;
          }
          //dialog
          await selectTemplateDialog(payload.uuid,
            `Today is Working on Holidays.<br/>Select Main/Working on Holidays Template for today`,
            template,
            thisTemplate,
            "");
        } else
          if (isPrivate === true) {
            //dialog
            await selectTemplateDialog(payload.uuid,
              `Today is Private days.<br/>Select Main/Private Template for today`,
              template,
              logseq.settings?.switchPrivateTemplateName,
              "");
          } else
            if (isHoliday) {
              //dialog
              await selectTemplateDialog(payload.uuid,
                `Today is ${isHoliday}.<br/>Select Main/Holidays Template for today`,
                template,
                logseq.settings?.switchHolidaysTemplateName,
                "");
            } else
              if (logseq.settings?.switchMainSub === true && logseq.settings?.switchMainTemplateName === template && logseq.settings?.switchSubTemplateName) { //Switch to Sub Template
                if (logseq.settings?.switchAlertDay && checkWeekday(logseq.settings?.switchAlertDay) === true) {
                  //アラート日の場合
                  //dialog
                  await selectTemplateDialog(payload.uuid,
                    "Select Main/Sub Template for this week",
                    template,
                    logseq.settings?.switchSubTemplateName,
                    "sub");
                } else
                  if (weekdays === "ALL" || checkWeekday(weekdays) === true) {
                    let setTemplate;
                    if (logseq.settings?.switchSetTemplate) {
                      setTemplate = logseq.settings?.switchSetTemplate;
                    } else {
                      setTemplate = template;
                    }
                    //セットされたテンプレートを挿入
                    await insertTemplateBlock(payload.uuid, setTemplate);
                  }
              } else
                if (weekdays === "ALL" || checkWeekday(weekdays) === true) {
                  await insertTemplateBlock(payload.uuid, template);
                }
        setTimeout(() => {
          rendering = "";
        }, 1000);
        return;
      }

      logseq.provideUI({
        key: `${slot}`,
        reset: true,
        slot,
        template: `<label title="Waiting renderer"> WAITING: ${template}, ${weekdays} </label>`,
        style: {
          color: "var(--ls-link-ref-text-hover-color)",
          border: "2px solid var(--ls-link-ref-text-hover-color)",
          paddingTop: "0.2em",
          paddingBottom: "0.2em",
          margin: "0.2em",
          borderRadius: "5px",
        }
      });

    }//end :weekdays

  });//end onMacroRendererSlotted


  (async () => {
    try {
      await l10nSetup({ builtinTranslations: { ja } });
    } finally {
      /* user settings */
      //get user config Language >>> Country
      if (logseq.settings?.switchHolidaysCountry === undefined) {
        const { preferredLanguage } = await logseq.App.getUserConfigs() as AppUserConfigs;
        logseq.useSettingsSchema(settingsTemplate(convertLanguageCodeToCountryCode(preferredLanguage)));
        setTimeout(() => {
          logseq.showSettingsUI();
        }, 300);
      } else {
        logseq.useSettingsSchema(settingsTemplate("US: United States of America"));
      }
    }
  })();


  let processingOnSettingsChanged: Boolean = false;
  logseq.onSettingsChanged(async (newSet: LSPluginBaseInfo['settings'], oldSet: LSPluginBaseInfo['settings']) => {
    if (processingOnSettingsChanged === false && newSet && oldSet && newSet !== oldSet) {
      if (oldSet.selectPrivateDays !== true && newSet.selectPrivateDays === true) {
        processingOnSettingsChanged = true;
        selectDaysByUser("PrivateDays");
        logseq.updateSettings({ selectPrivateDays: false });
        processingOnSettingsChanged = false;
      } else if (oldSet.selectWorkingOnHolidays !== true && newSet.selectWorkingOnHolidays === true) {
        processingOnSettingsChanged = true;
        selectDaysByUser("WorkingOnHolidays");
        logseq.updateSettings({ selectWorkingOnHolidays: false });
        processingOnSettingsChanged = false;
      }
    }
  });

  const popup = `${logseq.baseInfo.id}--${key}`;
  logseq.provideStyle({
    key: "main", style: `
    form.SetDates {
      margin:1.2em;
    }
    form.SetDates input {
      background: var(--ls-block-properties-background-color);
      color: var(--ls-primary-text-color);
      margin-bottom: 1em;
    }
    form.SetDates button {
      outline: 2px solid var(--ls-link-ref-text-hover-color);
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
      padding:5px;
    }
    div#${popup} p {
      font-size: 1.1em;
    }
    div#${popup} input[type="radio"] {
      margin-left: 0.5em;
      margin-right: 0.5em;
    }
    div#${popup} ul {
      list-style: none;
      padding: 4px 8px;
      cursor: pointer;
    }
    div#${popup} button {
      margin-top: 1em;
      margin-left: 2em;
      border: 1px solid var(--ls-secondary-background-color);
      boxShadow: 1px 2px 5px var(--ls-secondary-background-color);
      text-decoration: underline;
    }
    div#${popup} button:hover {
      background: var(--ls-secondary-background-color);
      color: var(--ls-secondary-text-color);
    }
  `});

  logseq.provideModel({
    getDatesPrivateDays() {
      getDates("PrivateDays");
    },
    getDatesWorkingOnHolidays() {
      getDates("WorkingOnHolidays");
    },
    weekdaysOpenSettings() {
      logseq.showSettingsUI();
    },
  });

  // toolbar button
  logseq.App.registerUIItem('toolbar', {
    key: 'Weekdays-and-Holidays',
    template: `<div data-rect><a class="button icon" data-on-click="weekdaysOpenSettings" title="Open plugin settings">
    <svg version="1.1" id="_x31_0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="width: 20px; height: 20px; opacity: 1;" xml:space="preserve">
<style type="text/css">
	.st0{fill:#374149;}
</style>
<g>
	<path class="st0" d="M466.172,394.69H45.824V246.221c0-12.258-9.938-22.199-22.199-22.199h-1.43C9.938,224.022,0,233.962,0,246.221
		v243.59h45.824v-49.297h420.348v49.183v0.301l0,0v0.161H512v-49.645V394.69H466.172z" style="fill: rgb(204, 29, 101);"></path>
	<path class="st0" d="M210.047,295.705v66.328v0.203l0,0v0.16h273.214v-41.918c0-20.523-16.637-37.16-37.16-37.16l-198.894-24.774
		C226.683,258.545,210.047,275.182,210.047,295.705z" style="fill: rgb(204, 29, 101);"></path>
	<circle class="st0" cx="133.699" cy="307.06" r="55.336" style="fill: rgb(204, 29, 101);"></circle>
	<polygon class="st0" points="88.141,45.346 88.149,45.385 88.149,45.385 88.172,45.541 102.183,43.326 110.187,42.15 
		92.152,78.033 94.234,91.182 141.465,83.713 141.531,83.701 141.531,83.701 141.687,83.678 139.098,67.302 124.324,69.638 
		115.859,70.885 133.961,34.83 131.906,21.842 85.844,29.126 85.742,29.142 85.742,29.142 85.582,29.166 	" style="fill: rgb(204, 29, 101);"></polygon>
	<polygon class="st0" points="218.359,134.354 203.687,131.111 195.383,129.182 225.469,102.193 228.313,89.33 182.687,79.248 
		182.59,79.225 182.59,79.225 182.434,79.19 178.851,95.408 192.742,98.478 200.617,100.31 170.656,127.162 167.782,140.182 
		214.778,150.572 	" style="fill: rgb(204, 29, 101);"></polygon>
	<polygon class="st0" points="108.863,175.85 108.875,175.912 108.879,175.912 108.914,176.068 121.961,172.966 129.414,171.287 
		115.016,206.404 117.922,218.646 162.11,208.142 158.535,193.115 158.523,193.053 158.519,193.053 158.484,192.9 144.722,196.17 
		136.844,197.947 151.297,162.662 148.422,150.572 105.289,160.822 	" style="fill: rgb(204, 29, 101);"></polygon>
	<polygon class="st0" points="75.93,190.022 32.176,99.154 32,98.787 32,98.787 31.93,98.642 17.516,105.58 61.516,196.962 	" style="fill: rgb(204, 29, 101);"></polygon>
	<polygon class="st0" points="228.274,205.763 241.703,214.466 303.438,119.232 290.172,110.634 290.141,110.615 290.141,110.615 
		290.008,110.529 	" style="fill: rgb(204, 29, 101);"></polygon>
</g>
</svg>
    </a></div>`,
  });

};/* end_main */


function checkMatchToday(array: []): Boolean {
  if (!array) return false;
  const today: Date = new Date();
  const fullYear = today.getFullYear();
  const month = today.getMonth(); // +1しない
  const day = today.getDate();
  let check: Boolean = false;
  array.forEach((date) => {
    const thisDate: Date = new Date(date);
    if (thisDate.getFullYear() === fullYear &&
      thisDate.getMonth() === month &&
      thisDate.getDate() === day) {
      // dateが今日の日付と一致する場合の処理
      check = true;
      return true;
    }
  });
  return check;
}

function getDates(target) {
  let id = "";
  if (target === "PrivateDays") {
    id = "p";
    logseq.updateSettings({ privateDaysArray: null });
  } else if (target === "WorkingOnHolidays") {
    id = "w";
    logseq.updateSettings({ workingOnHolidaysArray: null });
  } else {
    return console.error("Error: getDates");;
  }
  const DaysArray: Date[] = []; // 日付を格納する配列を初期化
  const dateIds = [`${id}date1`, `${id}date2`, `${id}date3`, `${id}date4`, `${id}date5`, `${id}date6`]; // 日付のIDを格納する配列
  for (const dateId of dateIds) { // 日付のIDを1つずつ処理するループ
    const value = (<HTMLInputElement>parent.document.getElementById(dateId)).value;
    if (!value) continue;
    const inputDate: Date = new Date(value); // 日付の値を取得
    // 日付が有効な日付かどうかをチェックし、日付を配列に追加
    if (!isNaN(inputDate.getTime())) DaysArray.push(inputDate);
  }
  if (target === "PrivateDays") {
    logseq.updateSettings({ privateDaysArray: DaysArray });
  } else if (target === "WorkingOnHolidays") {
    logseq.updateSettings({ workingOnHolidaysArray: DaysArray });
  }
  logseq.UI.showMsg("Saved", "success", { timeout: 1500 });
}


function selectDaysByUser(target) {
  let key, title, id, onClick;
  if (target === "PrivateDays") {
    key = target;
    title = "Private Days";
    id = "p";
    onClick = "getDatesPrivateDays";
  } else if (target === "WorkingOnHolidays") {
    key = "WorkingOnHolidays";
    title = "Working on Holidays";
    id = "w";
    onClick = "getDatesWorkingOnHolidays";
  } else {
    console.error("Error: selectDaysByUser");
    return;
  }
  const today = new Date();
  const formattedDate = today.toISOString().slice(0, 10);
  try {
    logseq.provideUI({
      key,
      attrs: {
        title: 'Plugin Settings - Weekdays and Holidays (Templates)',
      },
      close: "outside",
      reset: true,
      template: `
    <form class="SetDates">
    <h3>Select ${title}</h3>
  <div><label for="date1">Date 1:</label>
  <input type="date" id="${id}date1" name="date1" min="${formattedDate}"/></div>
  
  <div><label for="date2">Date 2:</label>
  <input type="date" id="${id}date2" name="date2" min="${formattedDate}"/></div>

  <div><label for="date3">Date 3:</label>
  <input type="date" id="${id}date3" name="date3" min="${formattedDate}"/></div>

  <div><label for="date4">Date 4:</label>
  <input type="date" id="${id}date4" name="date4" min="${formattedDate}"/></div>

  <div><label for="date5">Date 5:</label>
  <input type="date" id="${id}date5" name="date5" min="${formattedDate}"/></div>

  <div><label for="date6">Date 6:</label>
  <input type="date" id="${id}date6" name="date6" min="${formattedDate}"/></div>
  
  <button type="button" data-on-click="${onClick}">Set Dates</button>
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
        height: "500px",
      }
    });
  } finally {
    setTimeout(() => {
      setSavedDates(target); // ページ読み込み時に実行して、保存された日付をフォームにセットする
    }, 300);
  }
}


function setSavedDates(target) {
  let id, setting;
  if (target === "PrivateDays") {
    id = "p";
    setting = logseq.settings?.privateDaysArray;
  } else if (target === "WorkingOnHolidays") {
    id = "w";
    setting = logseq.settings?.workingOnHolidaysArray;
  } else {
    console.error("Error: setSavedDates");
    return;
  }
  if (setting) {
    const privateDaysArray: Date[] = setting; // 保存された日付の配列を取得
    const dateIds = [`${id}date1`, `${id}date2`, `${id}date3`, `${id}date4`, `${id}date5`, `${id}date6`]; // 日付のIDを格納する配列
    const today = new Date(); // 今日の日付を取得
    for (let i = 0; i < privateDaysArray.length && i < dateIds.length; i++) { // 日付を1つずつ処理するループ
      if (privateDaysArray[i] === undefined) continue;
      const inputDate = new Date(privateDaysArray[i]); // 日付をDateオブジェクトに変換
      if (inputDate > today) { // 日付が今日より後の場合のみ、値をセットする
        const formattedDate = inputDate.toISOString().slice(0, 10); // yyyy-mm-ddの形式に変換
        const dateInput = parent.document.getElementById(dateIds[i]) as HTMLInputElement; // 日付入力欄に値をセット
        if (dateInput) dateInput.value = formattedDate;
      }
    }
  }
}

//selectTemplateDialog
function selectTemplateDialog(uuid, dialogText, targetTemplate, replaceTemplate, updateSettings): Promise<void> {
  return new Promise((resolve) => {
    logseq.provideUI({
      attrs: {
        title: "🛌 Weekdays and Holidays Plugin",
      },
      key,
      reset: true,
      template: `
    <p>${dialogText}</p>
    <hr/>
    <p>Which template do you want to use?</p>
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
    });

    setTimeout(() => {
      const button = parent.document.getElementById("selectTemplateButton") as HTMLButtonElement;
      if (button) {
        let processing: Boolean = false;
        button.addEventListener("click", () => {
          if (processing) return;
          processing = true;
          //radioボタンの値を取得する
          const select: string = (parent.document.querySelector('input[name="selectTemplateRadio"]:checked') as HTMLInputElement)!.value;
          if (!select) return processing = false;
          let selectTemplate = "";
          if (select === "main") {
            selectTemplate = targetTemplate;
          } else
            if (select === "sub") {
              selectTemplate = replaceTemplate;
              if (updateSettings === "sub") logseq.updateSettings({ switchSetTemplate: selectTemplate });
            } else {
              return processing = false;
            }
          //テンプレートを挿入する
          insertTemplateBlock(uuid, selectTemplate);

          //ダイアログを閉じる
          const element = parent.document.getElementById(logseq.baseInfo.id + `--${key}`) as HTMLDivElement | null;
          if (element) element.remove();
          processing = false;
          resolve();
        });
      }
    }, 100);
  });
}
//end


function insertSampleTemplates(uuid): Promise<void> {
  return new Promise((resolve) => {
    const batch: IBatchBlock[] = [
      {
        content: "### Weekdays and Holidays (Templates)",
        properties: {
          comment: "Always turn on Weekdays and holidays (Templates) plugin for execute rendering when journal template is called.\n[English document](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/wiki/English-document) / [日本語ドキュメント](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/wiki/%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88)",
        },
        children: [
          {
            content: t("#### Journal: Template Settings"),
            properties: {
              template: "Journal",
              "template-including-parent": "false",
              comment: 'Edit config.edn `:default-templates {:journals "Journal"}` When load as journal template, the renderings are executed. During runtime, the block with renderings be removed. A block can have a maximum of seven renderings, but if the weekdays overlap, only one of them will be executed.',
              "background-color": "yellow",
            },
            children: [
              {
                content: "{{renderer :Weekdays, Main-Template, Mon&Tue&Wed&Thu&Fri}}\n{{renderer :Weekdays, Weekends-Template, Sat&Sun}}"
              },
            ],
          },
          {
            content: t("#### Main-Template:"),
            properties: {
              template: "Main-Template",
              "template-including-parent": "false",
              Comment: " [default] Mon&Tue&Wed&Thu&Fri",
              "background-color": "gray",
            },
            children: [
              {
                content: `### Weekdays (Main)`,
                children: [
                  {
                    content: `#### AM`,
                    children: [
                      {
                        content: ``,
                      }, {
                        content: ``,
                      },
                    ],
                  },
                  {
                    content: `#### PM`,
                    children: [
                      {
                        content: ``,
                      }, {
                        content: ``,
                      },
                    ],
                  },
                ],
              },
            ],
          }, {
            content: t("#### Sub-Template:"),
            properties: {
              template: "Sub-Template",
              "template-including-parent": "false",
              Comment: "switch Main/Sub templates for a week (to plugin settings)",
              "background-color": "gray",
            },
            children: [
              {
                content: `### Weekdays (Sub)`,
                children: [
                  {
                    content: `#### AM`,
                    children: [
                      {
                        content: ``,
                      }, {
                        content: ``,
                      },
                    ],
                  },
                  {
                    content: `#### PM`,
                    children: [
                      {
                        content: ``,
                      }, {
                        content: ``,
                      },
                    ],
                  },
                ],
              },
            ]
          }, {
            content: t("#### Weekends-Template:"),
            properties: {
              template: "Weekends-Template",
              "template-including-parent": "false",
              Comment: " [default] Sat&Sun",
              "background-color": "gray",
            },
            children: [
              {
                content: `### Weekends`,
                children: [
                  {
                    content: `#### AM`,
                    children: [
                      {
                        content: ``,
                      }, {
                        content: ``,
                      },
                    ],
                  },
                  {
                    content: `#### PM`,
                    children: [
                      {
                        content: ``,
                      }, {
                        content: ``,
                      },
                    ],
                  },
                ],
              },
            ],
          }, {
            content: t("#### Holidays-Template:"),
            properties: {
              template: "Holidays-Template",
              "template-including-parent": "false",
              Comment: "Alert holidays (to plugin settings)",
              "background-color": "gray",
            },
            children: [
              {
                content: `### Holidays`,
                children: [
                  {
                    content: `#### AM`,
                    children: [
                      {
                        content: ``,
                      }, {
                        content: ``,
                      },
                    ],
                  },
                  {
                    content: `#### PM`,
                    children: [
                      {
                        content: ``,
                      }, {
                        content: ``,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
    logseq.Editor.insertBatchBlock(uuid, batch);
    resolve();
  });
}

//userSettings
// https://logseq.github.io/plugins/types/SettingSchemaDesc.html

//設定画面の文章変更時は、translations/ja.jsonも変更する (翻訳が反映されなくなる)
// t() L10N framework
//最終更新 2023/05/05
const settingsTemplate = (ByLanguage: string): SettingSchemaDesc[] => [
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
];


const convertLanguageCodeToCountryCode = (languageCode: string): string => {
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


function checkWeekday(selectWeekday: string): boolean {
  //曜日指定=ALL以外
  const days = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  const dayArray = selectWeekday.split("&"); // ["Sun", "Sat"]
  const dayNumbers = dayArray.map(day => days[day]); // [0, 6]
  const theDay = new Date();//その日の日付
  const theDayNumber = theDay.getDay(); // 0-6
  if (dayNumbers.includes(theDayNumber)) {
    return true; //一致
  } else {
    return false; //一致しない
  }
}


async function checkJournals() {
  const page = await logseq.Editor.getCurrentPage(); //Journalsの場合はnull
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


//insertTemplateBlock
async function insertTemplateBlock(blockUuid, template: string) {
  // @logseq/lib v0.0.15導入
  // ブロックではなく、テンプレートとして読み込む。SmartBlocksなどのプラグインも動作するようになる。Dynamic variablesも動作する
  //https://github.com/logseq/logseq/blob/a5e31128a6366df002488203406684f78d80c7e3/libs/src/LSPlugin.ts#L449
  logseq.Editor.updateBlock(blockUuid, "");
  const exist = await logseq.App.existTemplate(template);
  if (exist === true) {
    logseq.UI.showMsg(`Insert ${template}`, "success", { timeout: 1800 });
    const newBlock = await logseq.Editor.insertBlock(blockUuid, "", { sibling: true, isPageBlock: true, before: true, focus: false });
    if (newBlock) {
      logseq.App.insertTemplate(newBlock.uuid, template).finally(() => {
        console.log(`Render insert template ${template}`);
        logseq.Editor.removeBlock(blockUuid);
        setTimeout(() => {
          logseq.Editor.exitEditingMode();
        }, 100);
      });
    }
  } else {
    logseq.UI.showMsg(`Template ${template} not found.`, "error", { timeout: 3000 });
    console.warn(`Template ${template} not found.`);
  }
}


logseq.ready(main).catch(console.error); //model