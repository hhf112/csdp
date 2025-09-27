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


export async function updatePlayerStats() {
  const meta = {};
  const matchesInfo = [];

  puppeteer.launch({ headless: true });
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(urls.home);
  await page.waitForNetworkIdle();

  for (let letter = 0; letter < 26; ++letter) {
    const letters = await page.$$(".abcList");
    await letters[letter].click();
    await page.waitForNavigation({ waitUntil: "domcontentloaded" });

    await page.screenshot({ path: "/mnt/c/Users/ASUS/OneDrive/Desktop/test.png" });

    let rows = await page.$$(".TableLined > tbody:nth-child(1) > tr");

    for (let row = 0; row < rows.length; ++row) {

      rows = await page.$$(".TableLined > tbody:nth-child(1) > tr");
      /*
       * 0 -> name
       * 1 -> tests
       * 2 -> odi
       * 3 -> t20
       * */
      let cells = await rows[row].$$("td > a");

      // all match types.
      for (let cell = 1; cell < cells.length; ++cell) {
        rows = await page.$$(".TableLined > tbody:nth-child(1) > tr");
        /*
         * 0 -> name
         * 1 -> tests
         * 2 -> odi
         * 3 -> t20
         * */
        cells = await rows[row].$$("td > a");

        // set the page for the data of a certain match type.
        await cells[cell].click();
        await page.waitForNavigation({ waitUntil: "domcontentloaded" });

        await page.screenshot({ path: "/mnt/c/Users/ASUS/OneDrive/Desktop/test2.png" });

        // meta is not filled.
        if (Object.keys(meta).length === 0) {

          const metadata = await page.$$("td.FieldName");
          console.log("found: ", metadata.length);

          const getit = (i) => Promise.resolve(metadata[i].evaluate(el => {
            return Array.from(el.parentElement.querySelectorAll('td'))[1].textContent.trim();
          }));

          meta.name = await getit(0);

          meta.born = await  getit(1);
          meta.currentAge = await  getit(2);
          meta.bats = await getit(3)
          meta.bowls = await getit(4)
          meta.matches = await getit(5)
          console.error(meta);
        }

        // fill batting Labels
        for (let label of battingLabels) {
          const handle = await page.$(`text/${label}`)

          // handle this later.
          if (!handle) return;

          if (!matchesInfo.batting) matchesInfo.batting = {};
          matchesInfo.batting[label] = handle.evaluate(el => {
            const rw = el.parentElement?.querySelectorAll("td");

            // handle later.
            if (!rw) return;

            return rw[1].textContent;
          });
        }

        await page.goBack();
      }
    }

    console.log("done");
    await browser.close();
  }
}

(async () => { await updatePlayerStats() })();
