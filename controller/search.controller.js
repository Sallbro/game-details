const cheerio = require('cheerio');
const axios = require('axios');
const { successHandler, serverError, badRequest } = require('../helper/response');

exports.search = async (req, res, next) => {
    const { sugg, currency = "US" } = req.query;

    const currencyArray = ["IN", "US"];
    if (currency) {
        if (!currencyArray.includes(currency)) {
            return badRequest({ req, res, message: "Invalid currency" });
        }
    }

    let act_url = process.env['GET_SEARCH_URL'];
    act_url = act_url.replace("${sugg}", sugg);
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

        $("a.match_app").each(function () {
            const id = $(this).attr("data-ds-appid");
            const name = $(this).find("div.match_name").text().trim();
            const image = $(this).find("div.match_img img").attr("src");
            let price = $(this).find("div.match_subtitle").text().trim();

            // Handle empty price values
            if (!price) {
                price = "comming soon";
            }

            result.push({
                id: id,
                name: name,
                image: image,
                price: price
            });
        });
        return successHandler({
            req, res, data: {
                search: result,
                total: result.length
            }
        });
    }).catch(err => {
        return serverError({
            req, res, message: err?.message, error: err
        });
    });

}
