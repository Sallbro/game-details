const cheerio = require('cheerio');
const axios = require('axios');
const { mediaFormatQuery, reviewFormatQuery } = require('../helper/formatQuery');
const { successHandler, serverError, badRequest } = require('../helper/response');

exports.screenshots = async (req, res, next) => {
    const id = req.params.id;
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;

    // check game id
    if (!id) {
        return badRequest({ req, res, message: "Game id is required" });
    }

    const { startpageno, endpageno, startskip, endskip } = reviewFormatQuery({ limit, offset });

    // set screenshot url
    let direct_screenshot_url = process.env['DIRECT_SCREENSHOTS_URL'];
    direct_screenshot_url = direct_screenshot_url.replace("${env_game_id}", id);

    // fetch all endpoints url
    let endpoints = [];
    for (var i = startpageno; i < endpageno; i++) {
        let env_dir_rev_url = direct_screenshot_url;
        env_dir_rev_url = env_dir_rev_url.replace(/\${env_pageno}/g, i);
        endpoints.push(env_dir_rev_url);
    }

    // start requesting
    axios.all(endpoints.map(async (endpoint) => {
        let get_screenshot = [];

        await axios.get(endpoint).then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            let screenshot = [];
            $("div.apphub_Card > div.apphub_CardContentClickable > div.apphub_CardContentPreviewImageBorder > div.apphub_CardContentMain").map(function (i, el) {
                let img = $(el).find("img.apphub_CardContentPreviewImage").attr("src");
                screenshot.push(img);
            });
            get_screenshot.push(...screenshot);
        })
        return get_screenshot;
    })).then((data) => {
        // filter the data based on limit and offset
        let final_data = [];
        for (x of data) {
            final_data.push(...x);
        }
        final_data = final_data.slice(startskip, final_data.length - endskip);

        return successHandler({
            req, res, data: {
                screenshot: final_data,
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

exports.videos = async (req, res, next) => {
    const id = req.params.id;
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;

    if (!id) {
        return badRequest({ req, res, message: "Game id is required" });
    }

    const { startpageno, endpageno, startskip, endskip } = reviewFormatQuery({ limit, offset });

    // set direct video url
    let direct_video_url = process.env['DIRECT_VIDEOS_URL'];
    direct_video_url = direct_video_url.replace("${env_game_id}", id);

    // fetch all endpoints url
    let endpoints = [];
    for (var i = startpageno; i < endpageno; i++) {
        let env_dir_rev_url = direct_video_url;
        env_dir_rev_url = env_dir_rev_url.replace(/\${env_pageno}/g, i);
        endpoints.push(env_dir_rev_url);
    }
    // start requesting
    axios.all(endpoints.map(async (endpoint) => {
        let get_videos = [];
        //start requesting
        await axios.get(endpoint).then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            const regex_video = /\/vi\/([^\/]+)\//;
            let videos = [];

            $("div.apphub_Card > div.apphub_CardContentClickable > div.apphub_CardContentPreviewImageBorder > div.apphub_CardContentMain").map(function (i, el) {
                let img = $(el).find("img.apphub_CardContentPreviewImage").attr("src");
                videos.push("https://www.youtube.com/watch?v=" + img.match(regex_video)[1]);
            });
            get_videos.push(...videos);
        });
        return get_videos;
    })).then((data) => {
        // filter the data based on limit and offset
        let final_data = [];
        for (x of data) {
            final_data.push(...x);
        }
        final_data = final_data.slice(startskip, final_data.length - endskip);

        return successHandler({
            req, res, data: {
                videos: final_data,
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

exports.broadcasts = async (req, res, next) => {
    const id = req.params.id;
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;

    if (!id) {
        return badRequest({ req, res, message: "Game id is required" });
    }

    const { startpageno, endpageno, startskip, endskip } = reviewFormatQuery({ limit, offset });

    //direct review url
    let broadcast_url = process.env['BROADCAST_URL'];
    broadcast_url = broadcast_url.replace("${env_game_id}", id);

    // fetch all endpoints url
    let endpoints = [];
    for (var i = startpageno; i < endpageno; i++) {
        let env_dir_rev_url = broadcast_url;
        env_dir_rev_url = env_dir_rev_url.replace(/\${env_pageno}/g, i);
        endpoints.push(env_dir_rev_url);
    }

    // start requesting
    axios.all(endpoints.map(async (endpoint) => {
        let get_broadcasts = [];
        await axios.get(endpoint).then((response) => {
            let broadcasts = [];
            const html = response.data;
            const $ = cheerio.load(html);

            $("div.Broadcast_Card").map(function (i, el) {
                let img = $(el).find("a").attr("href");
                broadcasts.push(img);
            });
            get_broadcasts.push(...broadcasts);
        })
        return get_broadcasts;
    })).then((data) => {
        // filter the data based on limit and offset
        let final_data = [];
        for (x of data) {
            final_data.push(...x);
        }
        final_data = final_data.slice(startskip, final_data.length - endskip);

        return successHandler({
            req, res, data: {
                broadcasts: final_data,
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

exports.artwork = async (req, res, next) => {
    const id = req.params.id;
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;

    if (!id) {
        return badRequest({ req, res, message: "Game id is required" });
    }

    const { startpageno, endpageno, startskip, endskip } = reviewFormatQuery({ limit, offset });

    //direct review url
    let artwork_url = process.env['ARTWORK_URL'];
    artwork_url = artwork_url.replace("${env_game_id}", id);
    // fetch all endpoints url
    let endpoints = [];
    for (var i = startpageno; i < endpageno; i++) {
        let env_dir_rev_url = artwork_url;
        env_dir_rev_url = env_dir_rev_url.replace(/\${env_pageno}/g, i);
        endpoints.push(env_dir_rev_url);
    }

    // start requesting
    axios.all(endpoints.map(async (endpoint) => {
        let get_artworks = [];
        //start requesting
        await axios.get(endpoint).then((response) => {
            let artwork = [];
            const html = response.data;
            const $ = cheerio.load(html);

            $("div.apphub_Card > div.apphub_CardContentClickable > div.apphub_CardContentPreviewImageBorder > div.apphub_CardContentMain").map(function (i, el) {
                let img = $(el).find("img").attr("src");
                artwork.push(img);
            });
            get_artworks.push(...artwork);
        })
        return get_artworks;
    })).then((data) => {
        // filter the data based on limit and offset
        let final_data = [];
        for (x of data) {
            final_data.push(...x);
        }
        final_data = final_data.slice(startskip, final_data.length - endskip);

        return successHandler({
            req, res, data: {
                artworks: final_data,
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