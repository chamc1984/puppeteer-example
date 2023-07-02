const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
  });

  // Open the browser.
  console.log("START PUPPETEER.");
  const page = await browser.newPage();

  // Open the page.
  console.log("--- GOTO chorome page.");
  await page.goto("https://developer.chrome.com/");

  // Set screen size.
  console.log("--- SET VIEWPORT.");
  await page.setViewport({ width: 1080, height: 1024 });

  // Type into search box.
  console.log("--- TYPE searchbox.");
  await page.type(".search-box__input", "automate");

  // Wait and click on first result.
  console.log("--- CLICK first result.");
  const searchResultSelector = ".search-box__link";
  await page.waitForSelector(searchResultSelector);
  await page.click(searchResultSelector);

  // Locate the full title with a unique string.
  console.log("--- WAIT FOR SELECTOR text/Customize and automate.");
  const textSelector = await page.waitForSelector(
    "text/Customize and automate"
  );
  const fullTitle = await textSelector?.evaluate((el) => el.textContent);
  console.log('The title of this blog post is "%s".', fullTitle);

  // Close the browser.
  console.log("PUPPETEER END.");
  await browser.close();
})();
