const cheerio = require('cheerio');
const axios = require('axios');
const { successHandler, serverError, badRequest } = require('../helper/response');

exports.similarGames = async (req, res, next) => {
    const id = req.params.id;
    const { currency = "US" } = req.query;

    if (!id) {
        return badRequest({ req, res, message: "Game id is required" });
    }

    const currencyArray = ["IN", "US"];
    if (currency) {
        if (!currencyArray.includes(currency)) {
            return badRequest({ req, res, message: "Invalid currency" });
        }
    }

    let act_url = process.env['SIMILAR_GAME_URL'];
    act_url = act_url.replace("${env_game_id}", id);
    act_url = act_url.replace("${currency}", currency);

    let set_header = {
        headers: {
            'Cookie': 'birthtime=1007145001'
        }
    };
    axios.get(act_url, set_header).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const result = [];
        
        $("div#released > div.similar_grid_item").each(function () {
            const id = $(this).find("a").attr("data-ds-appid");
            const image = $(this).find("a > img").attr("src");
            let price = $(this).find("div > div.regular_price").text().trim();
            let gameName = "";

            // get game name
            const name = $(this).find("a").attr("href");
            const match = name.match(/\/app\/\d+\/([^\/\?]+)/);
            if (match) {
                const rawName = match[1];
                gameName = rawName.replace(/_/g, ' ');
            }

            // Handle empty price values
            if (!price) {
                price = "comming soon";
            }

            result.push({
                id: id,
                image: image,
                price: price,
                name: gameName
            });
        });
        return successHandler({
            req, res, data: {
                similar_games: result,
                total: result.length
            }
        });
    }).catch(err => {
        return serverError({
            req, res, message: err?.message, error: err
        });
    });

}
