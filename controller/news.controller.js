const cheerio = require('cheerio');
const axios = require('axios');
const { newsCategory } = require('../helper/enum');
const { reviewFormatQuery } = require('../helper/formatQuery');
const { serverError, successHandler, badRequest } = require('../helper/response');

exports.news = async (req, res, next) => {
    const id = req.params.id;
    const category = req.params.news_category;
    const language = req.query.language || "english";
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;

    if (!id) {
        return badRequest({ req, res, message: "Game id is required" });
    }

    const { startpageno, endpageno, startskip, endskip } = reviewFormatQuery({ limit, offset });

    // check category of news 
    const arrayNewsCategory = newsCategory || [];
    if (!arrayNewsCategory.includes(category)) {
        return badRequest({ req, res, message: "invalid news category" });
    }

    // set news url
    let news_url;
    if (category == "announcements") {
        news_url = process.env['OFFICIAL_ANNOUNCEMENTS__NEWS_URL'];
    } else if (category == "syndicated") {
        news_url = process.env['SYNDICATED_NEWS_URL'];
    }
    else {
        news_url = process.env['ALL_NEWS_URL'];
    }
    news_url = news_url.replace("${env_game_id}", id).replace("${env_language}", language);

    // fetch all endpoints url
    let endpoints = [];
    for (var i = startpageno; i < endpageno; i++) {
        let env_dir_rev_url = news_url;
        env_dir_rev_url = env_dir_rev_url.replace(/\${env_pageno}/g, i);
        endpoints.push(env_dir_rev_url);
    }

    // start requesting
    axios.all(endpoints.map(async (endpoint) => {
        let get_news = [];
        //start requesting
        await axios.get(endpoint).then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            let news = [];
            $("div.apphub_Card").each(function () {
                let obj_review = {};
                $(this).after("div.apphub_CardContentMain").map(function (i, el) {
                    let news_title = $(el).find(".apphub_CardContentNewsTitle").text();
                    let date = $(el).find("div.apphub_CardContentNewsDate").text().trim();
                    obj_review.news_title = news_title;
                    obj_review.date = date;
                });
                $(this).after("div.apphub_CardContentNewsDesc").map(function (i, el) {
                    let content = "";
                    $(el).find("ul.bb_ul li").map(function (i, el) {
                        content += $(el).text();
                    });
                    if (content == "") {
                        const clone_content = $(el).find("div.apphub_CardTextContent").clone();
                        clone_content.children().remove();
                        content = $(clone_content).text();
                    }
                    obj_review.content = content;
                });
                $(this).after("div.apphub_CardContentAuthorBlock").map(function (i, el) {
                    let like = $(el).find("div.apphub_CardRating.news.rateUp").text();
                    obj_review.like = like;
                });

                news.push(obj_review);
            });
            get_news.push(...news);
        })
        return get_news;
    })).then((data) => {
        // filter the data based on limit and offset
        let final_data = [];
        for (x of data) {
            final_data.push(...x);
        }
        final_data = final_data.slice(startskip, final_data.length - endskip);

        return successHandler({
            req, res, data: {
                news: final_data,
                limit,
                offset
            }
        });
    }).catch((err) => {
        return serverError({
            req, res, message: err?.message, error: err
        });
    });
}
