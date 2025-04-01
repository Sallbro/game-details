const cheerio = require('cheerio');
const axios = require('axios');
const { badRequest, successHandler, serverError } = require('../helper/response');

exports.pageNo = async (req, res, next) => {
    const { page_no = 1, currency = "US" } = req.params;
    const currencyArray = ["IN", "US"];
    if (currency) {
        if (!currencyArray.includes(currency)) {
            return badRequest({ req, res, message: "Invalid currency it should be [IN, US]" });
        }
    }
    let act_url = process.env['GET_PAGE_URL'];
    act_url = act_url.replace("${page_no}", page_no);
    act_url = act_url.replace("${currency}", currency);

    axios.get(act_url).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const pages = [];
        let id = "";
        let optional_id = "";

        $("#search_resultsRows > a").map(function (i, e) {
            const page_instance = {};
            // if [appid] not present than find [data-ds-bundleid]
            id = $(e).attr("data-ds-appid");
            page_instance.id = id;
            $(e).find("div.responsive_search_name_combined").map(function (i, e) {
                page_instance.name = $(e).find("div.col.search_name.ellipsis > span.title").text();
                page_instance.release_date = $(e).find("div.col.search_released.responsive_secondrow").text().trim();

                // if discount price is present 
                page_instance.price = $(e).find("div.col.search_price_discount_combined.responsive_secondrow > div > div > div.discount_prices > div.discount_final_price").text().trim();

            })

            optional_id = $(e).find("div.col.search_capsule > img").attr("src");
            optional_id = optional_id.slice(optional_id.indexOf("?t=") + 3);
            page_instance.img = `https://cdn.akamai.steamstatic.com/steam/apps/${id}/header.jpg?t=${optional_id}`;
            pages.push(page_instance);
        });
        const counts = $(".search_pagination > .search_pagination_left").text().trim();
        const total = counts.match((/(?<=of )\d+/));
        const total_page = total ? Math.ceil(Number(total[0]) / 25) : "";
        console.log("counts ", counts);
        return successHandler({
            req, res, data: {
                pages,
                current_page: Number(page_no),
                total_page: total_page
            }
        });

    }).catch((err) => {
        return serverError({
            req, res, message: err?.message, error: err
        });
    });

}