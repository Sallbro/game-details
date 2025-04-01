const cheerio = require('cheerio');
const axios = require('axios');
const { reviewFormatQuery, formateData } = require('../helper/formatQuery');
const { reviewCategory, reviewType, seperator } = require('../helper/enum');
const { generateId, decodeId, splitUsernameAndId } = require('../helper/convertor');
const { serverError, successHandler, badRequest } = require('../helper/response');

exports.specificReviews = async (req, res, next) => {
    const id = req.params.id;
    const category = req.params.category;
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;
    const type = req.query.type || "all";
    const language = req.query.language || "english";
    const { startpageno, endpageno, startskip, endskip } = reviewFormatQuery({ limit, offset });

    // check game id
    if (!id) {
        return badRequest({ req, res, message: "Game id is required" });
    }

    // check category of review 
    const arrayReviewCategory = reviewCategory || [];
    if (!arrayReviewCategory.includes(category)) {
        return badRequest({ req, res, message: "invalid review category" });
    }

    // check type of review 
    const arrayReviewType = reviewType || [];
    if (!arrayReviewType.includes(type)) {
        return badRequest({ req, res, message: "invalid review type" });
    }

    // set review url
    let review_url;
    if (type == "negative") {
        review_url = process.env['NEGATIVE_REVIEWS_URL'];
    } else if (type == "positive") {
        review_url = process.env['POSITIVE_REVIEWS_URL'];
    }
    else {
        review_url = process.env['ALL_REVIEWS_URL'];
    }
    review_url = review_url.replace(/\${env_reviewcategory}/g, category).replace("${env_game_id}", id).replace("${env_language}", language);

    // fetch all endpoints url
    let endpoints = [];
    for (var i = startpageno; i < endpageno; i++) {
        let env_dir_rev_url = review_url;
        env_dir_rev_url = env_dir_rev_url.replace(/\${env_pageno}/g, i);
        endpoints.push(env_dir_rev_url);
    }

    // start requesting
    axios.all(endpoints.map(async (endpoint) => {
        let get_reviews = [];
        await axios.get(endpoint).then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);

            $("div.apphub_Card").each(function () {
                let obj_review = {};

                // get review url
                let review_url = $(this).attr("data-modal-content-url");
                const review_url_regex = /steamcommunity\.com\/(?:id|profiles)\/(.*?)\/recommended\/(\d+)/;
                const review_url_match = review_url?.match(review_url_regex);
                let review_id = '';
                if (review_url_match) {
                    review_id = review_url_match[1] + seperator + review_url_match[2];
                }
                const generateid = generateId(review_id);

                const decodeIds = decodeId(generateid);
                obj_review.review_id = generateid;

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
        // filter the data based on limit and offset
        let final_data = [];
        for (x of data) {
            final_data.push(...x);
        }
        final_data = final_data.slice(startskip, final_data.length - endskip);

        return successHandler({
            req, res, data: {
                reviews: final_data,
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

exports.reviewById = async (req, res, next) => {
    const review_id = req.params.review_id;
    const decodeid = decodeId(review_id);
    if (!decodeid || !decodeid.includes(seperator)) {
        return badRequest({ req, res, message: "invalid review id" });
    }
    const { username, gameid } = splitUsernameAndId(decodeid);
    let review_url = process.env['SINGLE_REVIEWS_URL'];
    review_url = review_url.replace("${env_game_id}", gameid).replace("${env_username}", username);

    // fetch review
    let get_reviews = {};
    await axios.get(review_url).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        // rating
        const ratingBar = formateData($("div.ratingBar").text().trim());
        let rating = {};
        if (ratingBar) {
            let parts = ratingBar.split("people found this review");
            let helpful = parts[0] ? parts[0].trim().replace(",", "") : "no one rated yet";
            let funny = parts[1] ? parts[1].replace("helpful", "").trim().replace(",", "") : "no one rated yet";
            rating = {
                helpful: isNaN(helpful) ? "no one rated yet" : helpful + " people found this review helpful",
                funny: isNaN(funny) ? "no one rated yet" : funny + " people found this review funny"
            };
        }

        // user profile
        let user_profile = "";
        $("div.profile_small_header_avatar > div.playerAvatar > img").each(function () {
            const check_user_profile = $(this).attr("src");
            user_profile = check_user_profile;
        });
        if (user_profile != undefined) {
            user_profile = user_profile.replace("_medium.jpg", "_full.jpg");
        }

        // user name
        const user_name = $("div.profile_small_header_texture > div.profile_small_header_text > span.profile_small_header_name > a").text().trim();

        // date
        const date = formateData($("div.ratingSummaryBlock > div.recommendation_date").text().trim());
        let formate_date = {};
        if (date) {
            let parts = date.split("Updated:");
            let posted = parts[0].replace("Posted: ", "").replace("@", "at").trim();
            let updated = parts[1] ? parts[1].replace("@", "at").trim() : null;
            formate_date = { posted };
            if (updated) formate_date.updated = updated;
        }

        // playtime
        const playtime = formateData($("div.ratingSummaryBlock > div.ratingSummaryHeader > div.playTime").text().trim());

        // rating summary
        const ratingSummary = $("div.ratingSummaryBlock > div.ratingSummaryHeader > div.ratingSummary").text().trim();

        // content
        const content = $("div.review_area > div.review_area_content > div#ReviewEdit > textarea").text().trim().replaceAll("\n", " ");

        // comment id
        let comment_id = "";
        const fetch_comment_id = $("#comments > div").attr("id");
        if (fetch_comment_id) {
            const comment_regex = /commentthread_Recommendation_(\d+)_(\d+)_area/;
            const comment_match = fetch_comment_id.match(comment_regex);
            if (comment_match) {
                const cmt_id = comment_match[1];
                const gms_id = comment_match[2];
                const generateid = generateId(cmt_id.toString() + seperator + gms_id.toString());
                comment_id = generateid;
            }
        }
        // append data to get_reviews object
        get_reviews.user_name = user_name;
        get_reviews.user_profile = user_profile;
        get_reviews.date = formate_date;
        get_reviews.ratingSummary = ratingSummary;
        get_reviews.rating = rating;
        get_reviews.playtime = playtime;
        get_reviews.content = content;
        if (comment_id) {
            get_reviews.comment_id = comment_id;
        }

        return successHandler({
            req, res, data: get_reviews
        });
    }).catch((err) => {
        return serverError({
            req, res, message: err?.message, error: err
        });
    });

}