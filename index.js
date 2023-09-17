const request = require('request-promise');
const cheerio = require('cheerio');

const URL = 'https://www.imdb.com/title/tt0102926/?ref_=nv_sr_1';

(async () => {
    
    const response = await request(URL);

    let $ = cheerio.load(response);
    
    let title = $('div[class="sc-dffc6c81-0"] > h1 > span').text();
    let rating = $('span[itemprop="ratingValue"]').text();

    console.log("dadis",title, rating);
})()