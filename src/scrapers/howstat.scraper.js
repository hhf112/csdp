import { warn } from 'console';
import puppeteer from 'puppeteer';
// import { urls } from '../config/howstats.dat.ts';
// import { Player } from '../models/player.model.ts';
// import type { PlayerType, MatchStatsType } from '../models/player.model';
//

const urls = {
  /*
   * Home page contains  find players tab
   */
  home: "https://www.howstat.com/Cricket/Statistics/Players/PlayerMenu.asp#find",
}

const battingLabels = [
  "Innings", "Not Outs", "Aggregate", "Highest Score", "Average", "Median",
  "30s", "50s", "100s", "Ducks", "4s", "6s", "Balls Faced", "Scoring Rate",
  "Opened Batting", "Top Scored in Innings", "% of Team Runs Scored",
];

const fieldingLabels = [
  "Catches",
  "Most Catches in Innings"
];

const wicketkeepingLabels = [
  "Catches",
  "Stumpings",
  "Most Catches in Innings",
  "Most Dismissals in Innings"
];

let gPlayerCnt = 0;
export async function updatePlayerStats() {
  let meta = [];
  const matchesInfo = [];

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });
  const homePage = (await browser.pages())[0];

  await homePage.goto(urls.home, { waitUntil: "domcontentloaded" });

  const letters = await homePage.$$eval(".abcList", el => el.map(ch => ch.href));

  const playersPage = await browser.newPage();

  for (const letter of letters) {
    await playersPage.goto(letter, { waitUntil: "domcontentloaded" });

    // debug
    // await playersPage.screenshot({ path: "/mnt/c/Users/ASUS/OneDrive/Desktop/test.png" });
    // console.error("screenshot taken.")

    const data = await playersPage.$eval(".TableLined > tbody:nth-child(1)", el => {
      const data = [];
      const rows = Array.from(el.rows);
      let cells;
      for (let i = 2; i < rows.length; i++) {
        cells = Array.from(rows[i].cells);
        data.push({
          name: cells[0]?.textContent.trim() || "",
          born: cells[1]?.textContent.trim() || "",
          country: cells[2]?.textContent.trim() || "",
          tests: cells[3]?.textContent.trim() || "0",
          ODIs: cells[4]?.textContent.trim() || "0",
          T20s: cells[5]?.textContent.trim() || "0",
        });
      }
      return data;
    });


    meta = [meta, ...data];
    // debug
    // console.error(meta);
  }

  await playersPage.close();
  await homePage.close();
  await browser.close();

  // debug
  // console.log(meta);
}

(async () => { await updatePlayerStats() })();
