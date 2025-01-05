const cheerio = require('cheerio');
const axios = require('axios');

exports.allnews = async (req, res, next) => {
    const id = req.params.id;
    const category = allnews;
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;

    const { newpageno, leave, newlimit } = formatQuery({ limit, offset });

    //direct review url
    let direct_news_url = process.env['DIRECT_NEWS_URL'];
    direct_news_url = artwork_url.replace("${env_newscategory}", category).replace("${env_game_id}", id).replace("/\${env_pageno}/g", newpageno).replace("${env_offset}", offset).replace("${env_limit}", newlimit);

    //start requesting
    axios.get(direct_news_url).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        let all_reviews = [];
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

            get_reviews.push(obj_review);
        });
        res.send(all_reviews);
        res.end();
        next();
    }).catch((err) => {
        console.error(err);
        res.end();
        next();
    });
}

exports.announcements = async (req, res, next) => {
    const id = req.params.id;
    const category = announcements;
    const limit = req.query.limit;
    const offset = req.query.offset || 0;

    const { newpageno, leave, newlimit } = formatQuery({ limit, offset });

    //direct review url
    let direct_news_url = process.env['DIRECT_NEWS_URL'];
    direct_news_url = artwork_url.replace("${env_newscategory}", category).replace("${env_game_id}", id).replace("/\${env_pageno}/g", newpageno).replace("${env_offset}", offset).replace("${env_limit}", newlimit);

    //start requesting
    axios.get(endpoint).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        let all_reviews = [];
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

            get_reviews.push(obj_review);
        });
        res.send(all_reviews);
        res.end();
        next();
    }).catch((err) => {
        console.error(err);
        res.end();
        next();
    });
}
