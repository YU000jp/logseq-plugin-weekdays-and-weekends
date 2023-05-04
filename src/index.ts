import '@logseq/libs'; //https://plugins-doc.logseq.com/
import { IBatchBlock, SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user';
import Swal from 'sweetalert2'; //https://sweetalert2.github.io/
import Holidays from 'date-holidays'; //https://github.com/commenthol/date-holidays
let sweetAlert2background;  //color: sweetAlert2color
let sweetAlert2color; //background: sweetAlert2background

/* main */
const main = () => {

  //get theme color (For SweetAlert2)
  //checkboxなどはCSSで上書きする必要あり

  const rootThemeColor = () => {
    const root = parent.document.querySelector(":root");
    if (root) {
      const rootStyles = getComputedStyle(root);
      sweetAlert2background = rootStyles.getPropertyValue("--ls-block-properties-background-color") || "#ffffff";
      sweetAlert2color = rootStyles.getPropertyValue("--ls-primary-text-color") || "#000000";
    }
  };
  rootThemeColor();
  logseq.App.onThemeModeChanged(() => { rootThemeColor(); });
  //end


  //get user config Language >>> Country
  let ByLanguage = setCountry();


  /* user settings */
  userSettings(ByLanguage);


  /* slash command */
  let processingSlashCommand = false;
  logseq.Editor.registerSlashCommand("Create sample for weekdays renderer", async (e) => {
    if (processingSlashCommand) { return; }
    const check = await checkJournals();//ジャーナルでは許可しない
    if (check === true) {
      logseq.UI.showMsg("This is journal page. ", "error");
      return;
    }
    processingSlashCommand = true;
    try {
      sweetalert2Toast(9500, "Processing...", true);
      const titleBlock = await logseq.Editor.insertBlock(e.uuid, "### Weekdays and Weekends", {
        sibling: true,
        properties: { comment: "Always turn on [Weekdays and weekends plugin](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends) for execute rendering when journal template is called." }
      });
      if (titleBlock) {
        const templateBlock = await logseq.Editor.insertBlock(titleBlock.uuid, "#### Journal: Template Settings", {
          properties: {
            template: "Journal",
            "template-including-parent": "false",
            Comment: 'Edit config.edn `:default-templates {:journals "Journal"}`` There is a block that has two renderings. When it is loaded as journal template, the renderings are executed. During runtime, the block with renderings be removed. A block can have a maximum of seven renderings, but if the weekdays overlap, only one of them will be executed.',
            "background-color": "yellow",
          },
          sibling: false,
        });
        if (templateBlock) {
          const rendererBlock = await logseq.Editor.insertBlock(templateBlock.uuid, "{{renderer :Weekdays, Main-Template, Mon&Tue&Wed&Thu&Fri}} {{renderer :Weekdays, Weekends-Template, Sat&Sun}} ", {
            sibling: false,
          });
          if (rendererBlock) {
            await logseq.Editor.insertBlock(templateBlock.uuid, "", {
              sibling: true,
            });
            const templateA = await logseq.Editor.insertBlock(templateBlock.uuid, "#### Main-Template:", {
              properties: {
                template: "Main-Template",
                "template-including-parent": "false",
                Comment: " [default] Mon&Tue&Wed&Thu&Fri",
                "background-color": "gray",
              },
              sibling: true,
            });
            if (templateA) {
              const weekdays = await logseq.Editor.insertBlock(templateA.uuid, "### Weekdays (Main)", { sibling: false, properties: {}, });
              if (weekdays) {
                await templateBlank(weekdays.uuid, "AM");
                await templateBlank(weekdays.uuid, "PM");
              }
              const templateB = await logseq.Editor.insertBlock(templateA.uuid, "#### Sub-Template:", {
                properties: {
                  template: "Sub-Template",
                  "template-including-parent": "false",
                  Comment: "switch Main/Sub templates for a week (to plugin settings)",
                  "background-color": "gray",
                },
                sibling: true,
              });
              if (templateB) {
                const weekends = await logseq.Editor.insertBlock(templateB.uuid, "### Weekdays (Sub)", { sibling: false, properties: {}, });
                if (weekends) {
                  await templateBlank(weekends.uuid, "AM");
                  await templateBlank(weekends.uuid, "PM");
                }
                const templateC = await logseq.Editor.insertBlock(templateB.uuid, "#### Weekends-Template:", {
                  properties: {
                    template: "Weekends-Template",
                    "template-including-parent": "false",
                    Comment: " [default] Sat&Sun",
                    "background-color": "gray",
                  },
                  sibling: true,
                });
                if (templateC) {
                  const weekends = await logseq.Editor.insertBlock(templateC.uuid, "### Weekends", { sibling: false, properties: {}, });
                  if (weekends) {
                    await templateBlank(weekends.uuid, "AM");
                    await templateBlank(weekends.uuid, "PM");
                  }
                  const templateD = await logseq.Editor.insertBlock(templateC.uuid, "#### Holidays-Template:", {
                    properties: {
                      template: "Holidays-Template",
                      "template-including-parent": "false",
                      Comment: "Alert holidays (to plugin settings)",
                      "background-color": "gray",
                    },
                    sibling: true,
                  });
                  if (templateD) {
                    const weekends = await logseq.Editor.insertBlock(templateD.uuid, "### Holidays", { sibling: false, properties: {}, });
                    if (weekends) {
                      await templateBlank(weekends.uuid, "AM");
                      await templateBlank(weekends.uuid, "PM");
                    }
                  }
                }
              }
            }
          }
        }
      }
    } finally {
      logseq.hideMainUI();
    }
    processingSlashCommand = false;
  });
  //end


  //TODO: 保留
  logseq.Editor.registerSlashCommand("Add :Weekdays-renderer at Editing cursor", async () => {
    logseq.Editor.insertAtEditingCursor(
      `{{renderer :Weekdays, Template-C, Sat&Sun}} `
    );
  });

  //スラッシュコマンドから設定画面を呼び出し
  logseq.Editor.registerSlashCommand("Plugin Settings - Weekdays and Holidays (Templates)", async () => {
    logseq.showSettingsUI();
  });


  let rendering = ""; //rendering flag
  //rendering
  logseq.App.onMacroRendererSlotted(async ({ slot, payload }) => {
    if (rendering === slot) { return; }
    rendering = slot;
    const [type, template, weekdays] = payload.arguments as string[];

    if (type === ":Weekdays") {//:weekdays

      const check = await checkJournals();//ジャーナルだったらレンダリング実行
      if (template && weekdays && check === true) {
        //switchMainTemplateName
        //switchSubTemplateName
        //switchAlertDay

        // Switch on holidays
        let isHoliday;
        if (logseq.settings?.switchHolidays === true && logseq.settings?.switchHolidaysCountry) {
          const hd = new Holidays();
          const settingsCountry = logseq.settings?.switchHolidaysCountry
          const array = settingsCountry.split(":");
          hd.init(array[0], logseq.settings?.switchHolidaysState, logseq.settings?.switchHolidaysRegion);
          const checkHoliday = await hd.isHoliday(new Date()); //test new Date("2023/05/03")
          if (checkHoliday) {
            isHoliday = `${checkHoliday[0].name} (${checkHoliday[0].type})`;
          }
        }
        if (logseq.settings?.switchHolidays === true && isHoliday && logseq.settings?.switchHolidaysTemplateName) {
          //dialog
          await selectTemplateDialog(payload.uuid, `Today is ${isHoliday}.<br/>Select Main/Holidays Template for today`, template, logseq.settings?.switchHolidaysTemplateName, "");

        } else if (logseq.settings?.switchMainSub === true && logseq.settings?.switchMainTemplateName === template && logseq.settings?.switchSubTemplateName) { //Switch to Sub Template
          if (logseq.settings?.switchAlertDay && checkWeekday(logseq.settings?.switchAlertDay) === true) {
            //アラート日の場合
            //dialog
            await selectTemplateDialog(payload.uuid, "Select Main/Sub Template for this week", template, logseq.settings?.switchSubTemplateName, "sub");
          } else {
            let setTemplate;
            if (logseq.settings?.switchSetTemplate) {
              setTemplate = logseq.settings?.switchSetTemplate;
            } else {
              setTemplate = template;
            }
            //セットされたテンプレートを挿入
            await insertTemplateBlock(payload.uuid, setTemplate);
          }
        } else if (weekdays === "ALL" || checkWeekday(weekdays) === true) {
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


  //selectTemplateDialog
  async function selectTemplateDialog(uuid, dialogText, targetTemplate, replaceTemplate, updateSettings) {
    logseq.showMainUI();
    /* inputOptions can be an object or Promise */
    await Swal.fire({
      icon: 'question',
      input: 'radio',
      inputOptions: {
        main: targetTemplate,
        sub: replaceTemplate,
      },
      color: sweetAlert2color,
      background: sweetAlert2background,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      html: `<p>${dialogText}</p>
              <style>
                div.swal2-container div.swal2-radio {
                  color: unset;
                  background: unset;
                }
              </style>`,
    }).then(async (select) => {
      if (select) {
        if (select.value) {
          let selectTemplate = targetTemplate; //main
          if (select.value === "sub") { //sub
            selectTemplate = replaceTemplate;
            if (updateSettings === "sub") {
              logseq.updateSettings({ switchSetTemplate: replaceTemplate });
            }
          }
          await insertTemplateBlock(uuid, selectTemplate);
          if (updateSettings === "sub") {
            logseq.updateSettings({ switchSetTemplate: selectTemplate }); //選択したテンプレートを設定項目へセット
          }
        } else {
          logseq.UI.showMsg("Cancel", "warning");
        }
      }
    });
    logseq.hideMainUI();
  }
  //end


  // logseq.App.registerUIItem("toolbar", {
  //   key: pluginId,
  //   template: `<div data-on-click="weekdaysOpenToolbar" style="font-size:20px">🛳️</div>`,
  // });

};/* end_main */


//userSettings
function userSettings(ByLanguage: string) {
  // https://logseq.github.io/plugins/types/SettingSchemaDesc.html
  const settingsTemplate: SettingSchemaDesc[] = [
    {
      key: "",
      title: "Check Wiki to setup",
      type: "heading",
      description: "https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends/wiki/English-Document",
      default: "",
    },
    {
      key: "",
      title: "[Option] Sub-Template for a week",
      type: "heading",
      description: "Use switching templates on specific days of the week.",
      default: "",
    },
    {
      key: "switchMainSub",
      title: "Turn on: Alert for switching to Sub-Template",
      type: "boolean",
      description: "On Alert day, when a Main-Template renderer is called, it is possible to switch between main and sub templates for the week.",
      default: false,
    },
    {
      key: "switchAlertDay",
      title: "Trigger: Alert day",
      type: "enum",
      enumChoices: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      description: "For select Main/Sub templates",
      default: "Mon",
    },
    {
      key: "switchMainTemplateName",
      title: "Target: Main-Template name *",
      type: "string",
      description: "Fill in the Main-Template specified in a renderer.",
      default: "Main-Template",
    },
    {
      key: "switchSubTemplateName",
      title: "Call: Sub-Template name *",
      type: "string",
      description: "",
      default: "Sub-Template",
    },
    {
      key: "switchSetTemplate",
      title: "Set: current template name by switching",
      type: "string",
      description: "--No editing is needed. For editing manually.",
      default: "",
    },
    {
      key: "",
      title: "[Option] Holidays-Template",
      type: "heading",
      description: "Use switch templates on holidays.",
      default: "",
    },
    {
      key: "switchHolidays",
      title: "Turn on: Alert for holidays",
      type: "boolean",
      description: "When renderers is called, prioritize holidays.",
      default: false,
    },
    {
      key: "switchHolidaysTemplateName",
      title: "Call: Holidays-Template name *",
      type: "string",
      description: "",
      default: "Holidays-Template",
    },
    {
      key: "switchHolidaysCountry",
      title: "Supported countries *",
      type: "enum",
      enumPicker: "select",
      enumChoices: ["AD: Andorra", "AE: دولة الإمارات العربية المتحدة", "AG: Antigua & Barbuda", "AI: Anguilla", "AL: Shqipëri", "AM: Հայաստան", "AO: Angola", "AR: Argentina", "AS: American Samoa", "AT: Österreich", "AU: Australia", "AW: Aruba", "AX: Landskapet Åland", "AZ: Azərbaycan Respublikası", "BA: Bosna i Hercegovina", "BB: Barbados", "BD: গণপ্রজাতন্ত্রী বাংলাদেশ", "BE: Belgique", "BF: Burkina Faso", "BG: България", "BH: مملكة البحرين", "BI: République du Burundi", "BJ: République du Bénin", "BL: St. Barthélemy", "BM: Bermuda", "BN: Negara Brunei Darussalam", "BO: Bolivia", "BQ: Caribisch Nederland", "BR: Brasil", "BS: Bahamas", "BW: Botswana", "BY: Рэспубліка Беларусь", "BZ: Belize", "CA: Canada", "CC: Cocos (Keeling) Islands", "CD: République démocratique du Congo", "CF: République centrafricaine", "CG: République du Congo", "CH: Schweiz", "CI: République de Côte d'Ivoire", "CK: Cook Islands", "CL: Chile", "CM: Cameroun", "CN: 中华人民共和国", "CO: Colombia", "CR: Costa Rica", "CU: Cuba", "CV: República de Cabo Verde", "CW: Curaçao", "CX: Christmas Island", "CY: Κύπρος", "CZ: Česká republika", "DE: Deutschland", "DJ: République de Djibouti", "DK: Danmark", "DM: Dominica", "DO: República Dominicana", "DZ: الجمهورية الجزائرية الديمقراطية الشعبية", "EC: Ecuador", "EE: Eesti", "EG: جمهورية مصر العربية", "EH: الجمهورية العربية الصحراوية الديمقراطية", "ER: Eritrea", "ES: España", "ET: ኢትዮጵያ", "FI: Suomi", "FJ: Matanitu Tugalala o Viti", "FO: Føroyar", "FR: France", "GA: Gabon", "GB: United Kingdom", "GD: Grenada", "GE: საქართველო", "GF: Guyane", "GG: Guernsey", "GH: Ghana", "GI: Gibraltar", "GL: Kalaallit Nunaat", "GM: The Gambia", "GN: Guinée", "GP: Guadeloupe", "GQ: República de Guinea Ecuatorial", "GR: Ελλάδα", "GT: Guatemala", "GU: Guam", "GW: Guiné-Bissau", "GY: Guyana", "HK: 香港", "HN: Honduras", "HR: Hrvatska", "HT: Haïti", "HU: Magyarország", "IC: Islas Canarias", "ID: Indonesia", "IE: Ireland", "IL: מְדִינַת יִשְׂרָאֵל", "IM: Isle of Man", "IR: جمهوری اسلامی ایران", "IS: Ísland", "IT: Italia", "JE: Jersey", "JM: Jamaica", "JP: 日本", "KE: Kenya", "KM: Union des Comores", "KN: St. Kitts & Nevis", "KR: 대한민국", "KY: Cayman Islands", "LC: St. Lucia", "LI: Lichtenstein", "LR: Liberia", "LS: \'Muso oa Lesotho", "LT: Lietuva", "LU: Luxembourg", "LV: Latvija", "LY: دولة ليبيا", "MA: المملكة المغربية", "MC: Monaco", "MD: Republica Moldova", "ME: Crna Gora", "MF: Saint Martin", "MG: Repoblikan'i Madagasikara", "MK: Република Македонија", "ML: République du Mali", "MQ: Martinique", "MR: الجمهورية الإسلامية الموريتانية", "MS: Montserrat", "MT: Malta", "MW: Malawi", "MX: México", "MY: Malaysia", "MZ: Moçambique", "NA: Namibia", "NC: Nouvelle-Calédonie", "NE: République du Niger", "NG: Nigeria", "NI: Nicaragua", "NL: Nederland", "NO: Norge", "NZ: New Zealand", "PA: Panamá", "PE: Perú", "PH: Philippines", "PL: Polska", "PM: St. Pierre & Miquelon", "PR: Puerto Rico", "PT: Portugal", "PY: Paraguay", "RE: Réunion", "RO: Romania", "RS: Република Србија", "RU: Россия", "RW: Rwanda", "SC: Seychelles", "SD: جمهورية السودان", "SE: Sverige", "SG: Singapore", "SH: St. Helena", "SI: Republika Slovenija", "SJ: Svalbard & Jan Mayen", "SK: Slovenská republika", "SL: Sierra Leone", "SM: San Marino", "SN: République du Sénégal", "SO: Jamhuuriyadda Federaalka Soomaaliya", "SR: Suriname", "SS: South Sudan", "ST: São Tomé & Príncipe", "SV: El Salvador", "SX: Sint Maarten", "SZ: Eswatini", "TC: Turks & Caicos Islands", "TD: جمهورية تشاد", "TG: République togolaise", "TH: Thailand", "TN: الجمهورية التونسية", "TO: Puleʻanga Fakatuʻi ʻo Tonga", "TR: Türkiye", "TT: Trinidad & Tobago", "TW: 中華民國", "TZ: Tanzania", "UA: Україна", "UG: Uganda", "US: United States of America", "UY: Uruguay", "VA: Stato della Città del Vaticano", "VC: St. Vincent & Grenadines", "VE: Venezuela", "VG: British Virgin Islands", "VI: U.S. Virgin Islands", "VN: Cộng hòa Xã hội chủ nghĩa Việt Nam", "VU: République de Vanuatu", "XK: Republika e Kosovës", "YT: Mayotte", "ZA: South Africa", "ZM: Zambia", "ZW: Zimbabwe"],
      description: 'Select your country. If possible to set the State and Region, do so individually. https://github.com/commenthol/date-holidays#supported-countries-states-regions',
      default: ByLanguage || "US: United States of America",
    },
    {
      key: "switchHolidaysState",
      title: "Supported states (Match country)",
      type: "string",
      description: '2-character alphanumeric code (ex, NY) or blank (default)',
      default: "",
    },
    {
      key: "switchHolidaysRegion",
      title: "Supported regions (Match country)",
      type: "string",
      description: '2 or 3 character alphanumeric code or blank (default)',
      default: "",
    },
  ];
  logseq.useSettingsSchema(settingsTemplate);
}


//setCountry
function setCountry() {
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

  let ByLanguage; //language setting
  if (logseq.settings?.switchHolidaysCountry === undefined) {
    logseq.App.getUserConfigs().then((configs) => {
      if (configs) {
        ByLanguage = convertLanguageCodeToCountryCode(configs.preferredLanguage);
        logseq.updateSettings({ switchHolidaysCountry: ByLanguage });
      }
    }).finally(() => {
      logseq.UI.showMsg("Check setting of [Supported countries] on plugin settings", "info", { timeout: 3000 });
      logseq.showSettingsUI();
    });
  }
  return ByLanguage;
}
//end


function checkWeekday(selectWeekday: string) {
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
    if (page["journal?"] === true) { //Journal day
      return true;
    }
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
    await sweetalert2Toast(2000, `Insert ${template}`, true);
    const newBlock = await logseq.Editor.insertBlock(blockUuid, "", { sibling: true, isPageBlock: true, before: true, focus: false });
    if (newBlock) {
      logseq.App.insertTemplate(newBlock.uuid, template).finally(() => {
        console.log(`Render insert template ${template}`);
        logseq.Editor.removeBlock(blockUuid);
      });
    }
  } else {
    console.warn(`Template ${template} not found.`);
  }
}


//sweetAlert2 https://sweetalert2.github.io/#mixin
async function sweetalert2Toast(timer: number, text: string, MainUI: boolean) {
  if (MainUI === true) {
    logseq.showMainUI();
  }
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: timer,
    timerProgressBar: true,
  });
  Toast.fire({
    icon: 'success',
    title: text,
    color: sweetAlert2color,
    background: sweetAlert2background,
  });
  if (MainUI === true) {
    setTimeout(() => {
      logseq.hideMainUI();
    }, timer);
  }
}
//end


async function templateBlank(uuid, amPm: string) {
  const insert = await logseq.Editor.insertBlock(uuid, `### ${amPm}`, { sibling: false });
  if (insert) {
    for (let i = 0; i < 2; i++) {
      await logseq.Editor.insertBlock(insert.uuid, "", { sibling: false });//空行を追加
    }
  }
}


//Credit: hkgnp
//https://github.com/hkgnp/logseq-calview-plugin/blob/dc1716781b594d973c3d97fdf2475ad11f71a795/src/utils.tsx#LL3C1-L16C3
//page..journalDay
// const getJournalDayFormat = (journalDayInNumber: number) => {
//   if (journalDayInNumber) {
//     const journalDay = journalDayInNumber.toString();
//     return (
//       journalDay.slice(0, 4) +
//       "-" +
//       journalDay.slice(4, 6) +
//       "-" +
//       journalDay.slice(6)
//     );
//   } else {
//     console.error("journalDayInNumber is undefined");
//   }
// };


// /* on click open_toolbar */
// const model = {
//   async weekdaysOpenToolbar() {
//     logseq.showSettingsUI();
//   }
// };


logseq.ready(main).catch(console.error); //model