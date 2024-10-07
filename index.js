const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();


  await page.goto("https://www.facebook.com/login", {
    waitUntil: "networkidle2",
  });


  await page.type("#email", "nikhildesign00@gmail.com"); 
  await page.type("#pass", "Nikhil@0000"); 

  await page.waitForSelector("#loginbutton");

  await page.click("#loginbutton");

  await page.waitForNavigation({ waitUntil: "networkidle2" });

  await page.goto("https://www.facebook.com/zomato/", {
    waitUntil: "networkidle2",
  });

  const usernamequery =
    "span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x14qwyeo.xw06pyt.x579bpy.xjkpybl.x1xlr1w8.xzsf02u.x2b8uid";

  const usernameData = await getData(page, usernamequery, usernamequery);

  const followeQuery =
    "div.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.x6s0dn4.xyamay9";
  const followerData = await getData(page, followeQuery, followeQuery);

  await page.waitForSelector("div.x9f619.x1n2onr6.x1ja2u2z");

  const elementHTML = await page.evaluate(() => {
    const element = document.querySelector("div.x9f619.x1n2onr6.x1ja2u2z");
    return element ? element.innerHTML : "Element not found";
  });

;


  const imageTag = await page.evaluate((html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const image = doc.querySelector("image"); 
    return image ? image.getAttribute("xlink:href") : "Image not found"; 
  }, elementHTML);




  await page.waitForSelector('span.xrbpyxo.x6ikm8r.x10wlt62.xlyipyv.x1exxlbk span span.xt0b8zv.x1e558r4');


  async function scrollToLoadMorePosts(page) {
    await page.evaluate(async () => {
      const scrollHeight = document.body.scrollHeight;
      window.scrollBy(0, scrollHeight); // Scroll down
      await new Promise(resolve => setTimeout(resolve, 2000)); 
    });
  }

   for (let i = 0; i < 3; i++) { 
    await scrollToLoadMorePosts(page);
  }// Scrape likes data
  const likesDataArray = await page.evaluate(() => {
    const likeSpans = document.querySelectorAll('span.xrbpyxo.x6ikm8r.x10wlt62.xlyipyv.x1exxlbk span span.xt0b8zv.x1e558r4');
    const commentsSpans = document.querySelectorAll('span.html-span.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1hl2dhg.x16tdsg8.x1vvkbs.x1sur9pj.xkrqix3');
    const sharesSpans = document.querySelectorAll('span.html-span.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1hl2dhg.x16tdsg8.x1vvkbs.x1sur9pj.xkrqix3'); 


    const results = [];

    for (let i = 0; i < Math.min(likeSpans.length, 5); i++) {
      const likeSpan = likeSpans[i];
      const likes = likeSpan ? likeSpan.textContent : 'Likes not found';
      const comments = commentsSpans[i] ? commentsSpans[i].textContent : 'Comments not found';
      const shares = sharesSpans[i] ? sharesSpans[i].textContent : 'Shares not found';
      
      results.push({ likes , comments , shares });
    }

    return { results, count: likeSpans.length }; 
  });
  console.log('Likes data for first five posts:', likesDataArray.results);
  console.log('Number of like spans found:', likesDataArray.count);


  const facebookScrappedData = {
    username:usernameData,
    follower:followerData,
    image: imageTag,
    postData:likesDataArray.results,
  }

  console.log(facebookScrappedData);
  

  await browser.close();


})();

const getData = async (page, query, subquery) => {
  await page.waitForSelector(query);
  const data = await page.evaluate((subquery) => {
    const element = document.querySelector(subquery);
    return element ? element.textContent : "Element not found";
  }, subquery); 
  return data;
};





















































// <span aria-hidden="true" class="xrbpyxo x6ikm8r x10wlt62 xlyipyv x1exxlbk"><span><span class="xt0b8zv x1e558r4">411K</span></span></span>
// <span aria-hidden="true" class="xrbpyxo x6ikm8r x10wlt62 xlyipyv x1exxlbk"><span><span class="xt0b8zv x1e558r4">277K</span></span></span>