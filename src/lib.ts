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
