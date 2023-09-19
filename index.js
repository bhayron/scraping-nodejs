const requestPromisse = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const { Parser } = require('json2csv');

const request = require('request');

(async () => {
    const URLS = [

        {
            url: 'https://www.imdb.com/title/tt0102926/?ref_=nv_sr_1',
            id: 'the_silence_of_inocents'
        },
        // {
        //     url: 'https://www.imdb.com/title/tt0102926/?ref_=nv_sr_1',
        //     id: 'gone_girl'
        // }
    ]

    let movieData = [];
    for (let movie of URLS) {
        const response = await requestPromisse({
            uri: movie.url,
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                'Cache-Control': 'max-age=0',
                'Sec-Ch-Ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': 'Windows',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-User': '?1',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',

            },
            gzip: true
        });

        let $ = cheerio.load(response);

        let title = $('div[class="sc-dffc6c81-0 iwmAVw"] > h1').text();
        let rating1 = $('span[class="sc-bde20123-1 iZlgcd"]').text();

        const ratingDiv = $('div[data-testid="hero-rating-bar__aggregate-rating__score"]');
        const secondSpan = ratingDiv.find('span').eq(1);

        const rating2 = secondSpan.text();
        let poster = 'https://agenciamoll.com.br/wp-content/uploads/2019/12/O-que-%C3%A9-URL-e-como-ela-Ajuda-na-sua-Estrat%C3%A9gia-Digital.jpg'

        // let poster = $('div[class="ipc-lockup-overlay__screen"] > a > img').attr('src')

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
        let file = fs.createWriteStream(`${movie.id}.jpg`)
        await new Promise((resolve, reject) => {


            let stream = request({
                uri: movie.poster,
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Cache-Control': 'max-age=0',
                    'Sec-Ch-Ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
                    'Sec-Ch-Ua-Mobile': '?0',
                    'Sec-Ch-Ua-Platform': 'Windows',
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-Site': 'same-origin',
                    'Sec-Fetch-User': '?1',
                    'Upgrade-Insecure-Requests': '1',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',

                },
                gzip: true
            }).pipe(file)
                .on('finish', () => {
                    console.log('Finished downloading the image');
                    resolve()
                })
                .on('error',(error)=>{
                    reject(error)
                })
        }).catch(error=>{
            console.log('Erro', error);
        })
    }

    // const fields = ['title', 'rating1'];
    // const json2csvParser = new Parser({ fields });
    // const csv = json2csvParser.parse(movieData);
    // fs.writeFileSync('./data.csv', csv, 'utf-8');



    console.log(movieData);
})()
