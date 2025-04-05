const cheerio = require('cheerio');
const axios = require('axios');
const { reviewFormatQuery } = require('../helper/formatQuery');
const { successHandler, serverError, badRequest } = require('../helper/response');
const { guideCategory, seperator } = require('../helper/enum');
const { generateId } = require('../helper/convertor');

exports.guides = async (req, res, next) => {
    const id = req.params.id;
    const category = req.params.category;
    const language = req.query.language || "english";
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;

    if (!id) {
        return badRequest({ req, res, message: "Game id is required" });
    }

    // check category of guide 
    const arrayGuideCategory = guideCategory || [];
    if (!arrayGuideCategory.includes(category)) {
        return badRequest({ req, res, message: "invalid guide category" });
    }

    const { startpageno, endpageno, startskip, endskip } = reviewFormatQuery({ limit, offset });
    //direct guide url
    let guides_url = process.env['GUIDE_URL'];
    guides_url = guides_url.replace("${env_game_id}", id).replace(/\${env_guidecategory}/g, category).replace("${env_language}", language);

    // fetch all endpoints url
    let endpoints = [];
    for (var i = startpageno; i < endpageno; i++) {
        let env_dir_rev_url = guides_url;
        env_dir_rev_url = env_dir_rev_url.replace(/\${env_pageno}/g, i);
        endpoints.push(env_dir_rev_url);
    }

    // start requesting
    axios.all(endpoints.map(async (endpoint) => {
        let get_guides = [];

        await axios.get(endpoint).then((response) => {
            // let guides = [];
            const html = response.data;
            const $ = cheerio.load(html);
            $("div.apphub_Card").each(function () {
                const guide = {};

                // get guide id
                let review_url = $(this).attr("data-modal-content-url");
                const review_url_regex = /id=(\d+)/;
                const review_url_match = review_url?.match(review_url_regex);
                if (!review_url_match) {
                    guide.guide_id = "N/A";
                }
                guide.guide_id = review_url_match[1];


                $(this).after("div.apphub_CardContentClickable > div.apphub_CardContentPreviewImageBorder > div.apphub_CardContentMain").map(function (i, el) {

                    const guide_title = $(el).find("div.apphub_CardContentGuideTitle").text().trim().replace(/\n/g, "").replace(/\t/g, "");
                    guide.title = guide_title;

                    const guide_image = $(el).find("div.apphub_CardContentGuideTitle > img").attr("src");
                    guide.thumnail = guide_image;

                    const content = $(el).addClass("div.apphub_CardContentGuideDesc").text().trim().replace(/\n/g, "").replace(/\t/g, "");
                    guide.content = content;
                    get_guides.push(guide);
                });
            });
        })
        return get_guides;
    })).then((data) => {
        // filter the data based on limit and offset
        let final_data = [];
        for (x of data) {
            final_data.push(...x);
        }
        final_data = final_data.slice(startskip, final_data.length - endskip);

        return successHandler({
            req, res, data: {
                guides: final_data,
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

exports.fullGuide = async (req, res, next) => {
    const guide_id = req.params.guide_id;

    if (!guide_id) {
        return badRequest({ req, res, message: "Guides id is required" });
    }

    // actual url 
    let guides_url = process.env['SINGLE_GUIDE_URL'];
    guides_url = guides_url.replace("${env_guide_id}", guide_id);

    //start requesting
    await axios.get(guides_url).then((response) => {
        let get_guide = {};
        const html = response.data;
        const $ = cheerio.load(html);
        const postdate = $("div.rightDetailsBlock > div.detailsStatsContainerRight > div.detailsStatRight").text();
        const author = $("div.guideTopContent > div.guideAuthors").text();
        const title = $("div.guideTopContent > div.workshopItemTitle").text();
        const content = $("div.guideTopContent > div.guideTopDescription").text();
        // const content = $("div.guide > div.subSection > div.subSectionDesc > b").html()?.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, '');

        // comment id
        let comment_id = "";
        const fetch_comment_id = $("div.commentthread_area").attr("id");
        if (fetch_comment_id) {
            const comment_regex = /commentthread_PublishedFile_Public_(\d+)_(\d+)_area/;
            const comment_match = fetch_comment_id.match(comment_regex);
            if (comment_match) {
                const cmt_id = comment_match[1];
                const gms_id = comment_match[2];
                const generateid = generateId(cmt_id.toString() + seperator + gms_id.toString() + seperator + "guide");
                comment_id = generateid;
            }
        }

        get_guide.comment_id = comment_id;
        get_guide.guide_id = guide_id;
        get_guide.postdate = postdate;
        get_guide.author = author;
        get_guide.title = title;
        get_guide.content = content;

        return successHandler({
            req, res, data: {
                guides: get_guide
            }
        });
    }).catch((err) => {
        return serverError({
            req, res, message: err?.message, error: err
        });
    });
}
