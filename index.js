const request = require('request-promise');
const cheerio = require('cheerio');

const URL = 'https://www.imdb.com/title/tt0102926/?ref_=nv_sr_1';

(async () => {

    const response = await request({
        uri:URL,
        headers:{
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'Cache-Control': 'max-age=0',
            'Sec-Ch-Ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': 'Windows',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site':'same-origin',
            'Sec-Fetch-User': '?1',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
        },
        gzip:true
    });

    let $ = cheerio.load(response);

    let title = $('div[class="sc-dffc6c81-0 iwmAVw"] > h1').text();
    let rating1 = $('span[class="sc-bde20123-1 iZlgcd"]').text();

    const ratingDiv = $('div[data-testid="hero-rating-bar__aggregate-rating__score"]');
    const secondSpan = ratingDiv.find('span').eq(1); // Pega o segundo span dentro da div

    const rating2 = secondSpan.text();


    console.log("Title", title);
    console.log("Rating", rating1 + rating2);
})()