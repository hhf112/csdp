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

// WIP
export async function scrapeMatchPage(page, url) {
  batting = {};
  await page.goto(url, { waitUntil: "domcontentloaded" });
  const battingData = await page.$eval(".desktop > tbody:nth-child(1)", (el, battingLabels) => {
    const rows = Array.from(el.rows);
    const batting = {};

    for (let i = 1; i < battingLabels.length; i++) {
      batting[battingLabels[i]] = rows.cells[1].textContent;
    }
    return batting;
  }, battingLabels);

  batting = battingData;
  console.error(batting);
}

export async function updatePlayerStats() {
  let meta = [];

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });
  const homePage = (await browser.pages())[0];

  await homePage.goto(urls.home, { waitUntil: "domcontentloaded" });

  const letters = await homePage.$$eval(".abcList", el => el.map(ch => ch.href));

  const playersPage = await browser.newPage();
  const matchPage = await browser.newPage();

  for (const letter of letters) {
    await playersPage.goto(letter, { waitUntil: "domcontentloaded" });

    // debug
    // await playersPage.screenshot({ path: "/mnt/c/Users/ASUS/OneDrive/Desktop/test.png" });
    // console.error("screenshot taken.")

    const data = await playersPage.$eval(".TableLined > tbody:nth-child(1)", async (el) => {
      const data = [];
      const matches = [];
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

        matches.push([]);
        for (j = 3; j < 6; j++) {
          if (cells[j]) matches[i] = [...matches[i], cells[j].firstElementChild.href];
        }

      }
      return { data, matches };
    });

    // WIP
    for (matchData of data.matches) {
      for (matches of matchData) {
        matchesInfo.push(await scrapeMatchPage(matchPage, matches));
      }
    }

    meta = [meta, ...data.data];
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
