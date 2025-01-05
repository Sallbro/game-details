const cheerio = require('cheerio');
const axios = require('axios');

exports.pageNo = async (req, res, next) => {
    const page_no = req.params.page_no;
    let act_url = process.env['GET_PAGE_URL'];
    act_url = act_url.replace("${page_no}", page_no);
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
        res.send(pages);
        res.end();

    }).catch((err) => {
        console.error(err);
        res.end();
    });

}