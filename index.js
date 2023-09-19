const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const { Parser } = require('json2csv');

(async () => {
    const URLS = [
        'https://www.imdb.com/title/tt0102926/?ref_=nv_sr_1',
        'https://www.imdb.com/title/tt0102926/?ref_=nv_sr_1'
    ]

    let movieData = [];
    for (let movie of URLS) {
        const response = await request({
            uri: movie,
            headers: {
                // Cabeçalhos aqui...
            },
            gzip: true
        });

        let $ = cheerio.load(response);

        let title = $('div[class="sc-dffc6c81-0 iwmAVw"] > h1').text();
        let rating1 = $('span[class="sc-bde20123-1 iZlgcd"]').text();

        const ratingDiv = $('div[data-testid="hero-rating-bar__aggregate-rating__score"]');
        const secondSpan = ratingDiv.find('span').eq(1); 

        const rating2 = secondSpan.text();

        let poster = $('div[class="ipc-lockup-overlay__screen"] > a > img').attr('src')

        let genres = []
        $('div[class="ipc-chip-list__scroller"] a[href^="/genres/"]').each((i, elm) => {
            let genre = $(elm).text()
            genres.push(genre)
        })

        const populaty = $('#__next > main > div > section.ipc-page-background.ipc-page-background--base.sc-304f99f6-0.eaRXHu > section > div:nth-child(4) > section > section > div.sc-e226b0e3-4.ecgcFy > div.sc-e226b0e3-6.hfusNC > div.sc-e226b0e3-11.jSQoAO > div.sc-3a4309f8-0.fjtZsE.sc-dffc6c81-5.itEvYq > div > div:nth-child(3) > a > span > div > div.sc-5f7fb5b4-0.cUcPIU > div.sc-5f7fb5b4-1.bhuIgW').text().trim()

        movieData.push({
            title,
            rating1,
            populaty,
            rating2, 
            poster, 
            genres 
        })       
    }

    const fields = ['title', 'rating1']; 
    const json2csvParser = new Parser({ fields }); 
    const csv = json2csvParser.parse(movieData);
    fs.writeFileSync('./data.csv', csv, 'utf-8');



    console.log(movieData);
})()
