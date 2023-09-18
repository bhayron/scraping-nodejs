const request = require('request-promise');
const cheerio = require('cheerio');

const URL = 'https://www.imdb.com/title/tt0102926/?ref_=nv_sr_1';

(async () => {

    const response = await request(URL);

    let $ = cheerio.load(response);

    let title = $('div[class="sc-dffc6c81-0 iwmAVw"] > h1').text();
    let rating1 = $('span[class="sc-bde20123-1 iZlgcd"]').text();

    const ratingDiv = $('div[data-testid="hero-rating-bar__aggregate-rating__score"]');
    const secondSpan = ratingDiv.find('span').eq(1); // Pega o segundo span dentro da div

    const rating2 = secondSpan.text();


    console.log("Title", title);
    console.log("Rating", rating1 + rating2);
})()