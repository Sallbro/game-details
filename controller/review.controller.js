const cheerio = require('cheerio');
const axios = require('axios');
const { reviewFormatQuery } = require('../helper/formatQuery');
const { reviewCategory } = require('../helper/enum');

exports.specificReviews = async (req, res, next) => {
    const id = req.params.id;
    const category = req.params.category;
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;
    const type = req.query.type || "all";
    const { startpageno, endpageno, startleave, endleave } = reviewFormatQuery({ limit, offset });

    //direct review url
    let review_url;
    if (type == "negative") {
        review_url = process.env['NEGATIVE_REVIEWS_URL'];
    } else if (type == "positive") {
        review_url = process.env['POSITIVE_REVIEWS_URL'];
    }
    else {
        review_url = process.env['ALL_REVIEWS_URL'];
    }
    review_url = review_url.replace(/\${env_reviewcategory}/g, category).replace("${env_game_id}", id);

    // fetch all endpoints url 
    let endpoints = [];
    for (var i = startpageno; i <= endpageno; i++) {
        let env_dir_rev_url = review_url;
        env_dir_rev_url = env_dir_rev_url.replace(/\${env_pageno}/g, i);
        endpoints.push(env_dir_rev_url);
    }

    //start requesting
    axios.all(endpoints.map(async (endpoint) => {
        let get_reviews = [];
        await axios.get(endpoint).then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);

            $("div.apphub_Card").each(function () {
                let obj_review = {};
                $(this).after("div.apphub_CardContentMain").map(function (i, el) {
                    let title = $(el).find(".title").text();
                    let clone_content = $(el).find("div.apphub_UserReviewCardContent > div.apphub_CardTextContent").clone();
                    clone_content.children().remove();
                    let content = clone_content.text().trim();
                    let date = $(el).find("div.apphub_UserReviewCardContent > div.apphub_CardTextContent > div.date_posted").text().trim();
                    obj_review.title = title;
                    obj_review.date = date;
                    obj_review.content = content;
                });
                $(this).after("div.apphub_CardContentAuthorBlock").map(function (i, el) {
                    let user_profile = $(el).find("div.apphub_friend_block_container > div > a > div.appHubIconHolder > img").attr("src");
                    if (user_profile != undefined) {
                        user_profile = user_profile.replace(".jpg", "_full.jpg");
                    }
                    let user_name = $(el).find("div.apphub_friend_block_container > div > div.apphub_CardContentAuthorName > a:nth-child(2)").text();
                    obj_review.user_profile = user_profile;
                    obj_review.user_name = user_name;
                });
                get_reviews.push(obj_review);
            });
        });
        return get_reviews;
    }
    )).then((data) => {
        let final_data = [];
        for (x of data) {
            final_data.push(...x);
        }
        final_data = final_data.slice(startleave, final_data.length - endleave);
        res.send(final_data);
        res.end();
        next();
    }).catch((err) => {
        console.error(err);
        res.end();
        next();
    });

}

exports.reviews = async (req, res, next) => {
    const id = req.params.id;
    let category = req.query.category;
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;
    const type = req.query.type || "all";
    const { startpageno, endpageno, startleave, endleave } = reviewFormatQuery({ limit, offset });

    // set category of review url
    const arrayReviewCategory = JSON.parse(reviewCategory) || [];
    if (arrayReviewCategory.includes(category)) {
        category = category;
    } else {
        category = arrayReviewCategory[0];
    }
    
    // set review url based on type
    let review_url;
    if (type == "negative") {
        review_url = process.env['NEGATIVE_REVIEWS_URL'];
    } else if (type == "positive") {
        review_url = process.env['POSITIVE_REVIEWS_URL'];
    }
    else {
        review_url = process.env['ALL_REVIEWS_URL'];
    }
    review_url = review_url.replace(/\${env_reviewcategory}/g, category).replace("${env_game_id}", id);

    // fetch all endpoints url 
    let endpoints = [];
    for (var i = startpageno; i <= endpageno; i++) {
        let env_dir_rev_url = review_url;
        env_dir_rev_url = env_dir_rev_url.replace(/\${env_pageno}/g, i);
        endpoints.push(env_dir_rev_url);
    }

    //start requesting
    axios.all(endpoints.map(async (endpoint) => {
        let get_reviews = [];
        await axios.get(endpoint).then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);

            $("div.apphub_Card").each(function () {
                let obj_review = {};
                $(this).after("div.apphub_CardContentMain").map(function (i, el) {
                    let title = $(el).find(".title").text();
                    let clone_content = $(el).find("div.apphub_UserReviewCardContent > div.apphub_CardTextContent").clone();
                    clone_content.children().remove();
                    let content = clone_content.text().trim();
                    let date = $(el).find("div.apphub_UserReviewCardContent > div.apphub_CardTextContent > div.date_posted").text().trim();
                    obj_review.title = title;
                    obj_review.date = date;
                    obj_review.content = content;
                });
                $(this).after("div.apphub_CardContentAuthorBlock").map(function (i, el) {
                    let user_profile = $(el).find("div.apphub_friend_block_container > div > a > div.appHubIconHolder > img").attr("src");
                    if (user_profile != undefined) {
                        user_profile = user_profile.replace(".jpg", "_full.jpg");
                    }
                    let user_name = $(el).find("div.apphub_friend_block_container > div > div.apphub_CardContentAuthorName > a:nth-child(2)").text();
                    obj_review.user_profile = user_profile;
                    obj_review.user_name = user_name;
                });
                get_reviews.push(obj_review);
            });
        });
        return get_reviews;
    }
    )).then((data) => {
        let final_data = [];
        for (x of data) {
            final_data.push(...x);
        }
        final_data = final_data.slice(startleave, final_data.length - endleave);
        res.send(final_data);
        res.end();
        next();
    }).catch((err) => {
        console.error(err);
        res.end();
        next();
    });

}
