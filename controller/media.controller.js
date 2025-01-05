const cheerio = require('cheerio');
const axios = require('axios');
const { mediaFormatQuery } = require('../helper/formatQuery');

exports.screenshots = async (req, res, next) => {
    const id = req.params.id;
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;

    const { newpageno, leave, newlimit } = mediaFormatQuery({ limit, offset });

    //direct review url
    let direct_screenshot_url = process.env['DIRECT_SCREENSHOTS_URL'];
    direct_screenshot_url = direct_screenshot_url.replace("${env_game_id}", id).replace("/\${env_pageno}/g", newpageno).replace("${env_offset}", offset).replace("${env_limit}", newlimit);

    //start requesting
    axios.get(direct_screenshot_url).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        let screenshot = [];
        $("div.apphub_Card > div.apphub_CardContentClickable > div.apphub_CardContentPreviewImageBorder > div.apphub_CardContentMain").map(function (i, el) {
            let img = $(el).find("img.apphub_CardContentPreviewImage").attr("src");
            screenshot.push(img);
        });
        screenshot.splice(0, leave);
        res.send(screenshot);
        res.end();
        next();
    }).catch((err) => {
        console.error(err);
        res.end();
        next();
    });
}

exports.videos = async (req, res, next) => {
    const id = req.params.id;
    const limit = req.query.limit;
    const offset = Math.ceil(Number(req.query.offset) / 10) > 0 ? Math.ceil(Number(req.query.offset) / 10) : 0;

    const { newpageno, leave, newlimit } = mediaFormatQuery({ limit, offset });

    //direct review url
    let direct_video_url = process.env['DIRECT_VIDEOS_URL'];
    direct_video_url = direct_video_url.replace("${env_game_id}", id).replace("/\${env_pageno}/g", newpageno).replace("${env_offset}", offset).replace("${env_limit}", newlimit);

    //start requesting
    axios.get(direct_video_url).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const regex_video = /\/vi\/([^\/]+)\//;
        let get_videos = [];

        $("div.apphub_Card > div.apphub_CardContentClickable > div.apphub_CardContentPreviewImageBorder > div.apphub_CardContentMain").map(function (i, el) {
            let img = $(el).find("img.apphub_CardContentPreviewImage").attr("src");
            get_videos.push("https://www.youtube.com/watch?v=" + img.match(regex_video)[1]);
        });
        get_videos.splice(0, leave);
        res.send(get_videos);
        res.end();
        next();
    }).catch((err) => {
        console.error(err);
        res.end();
        next();
    });
}

exports.broadcasts = async (req, res, next) => {
    const id = req.params.id;
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;

    const { newpageno, leave, newlimit } = mediaFormatQuery({ limit, offset });

    //direct review url
    let broadcast_url = process.env['BROADCAST_URL'];
    broadcast_url = broadcast_url.replace("${env_game_id}", id).replace("/\${env_pageno}/g", newpageno).replace("${env_offset}", offset).replace("${env_limit}", newlimit);

    //start requesting
    axios.get(broadcast_url).then((response) => {
        let get_broadcast = [];
        const html = response.data;
        const $ = cheerio.load(html);

        $("div.Broadcast_Card").map(function (i, el) {
            let img = $(el).find("a").attr("href");
            get_broadcast.push(img);
        });
        get_broadcast.splice(0, leave);
        res.send(get_broadcast);
        res.end();
        next();
    }).catch((err) => {
        console.error(err);
        res.end();
        next();
    });
}

exports.artwork = async (req, res, next) => {
    const id = req.params.id;
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;

    const { newpageno, leave, newlimit } = mediaFormatQuery({ limit, offset });

    //direct review url
    let artwork_url = process.env['ARTWORK_URL'];
    artwork_url = artwork_url.replace("${env_game_id}", id).replace("/\${env_pageno}/g", newpageno).replace("${env_offset}", offset).replace("${env_limit}", newlimit);

    //start requesting
    axios.get(artwork_url).then((response) => {
        let get_broadcast = [];
        const html = response.data;
        const $ = cheerio.load(html);

        $("div.apphub_Card > div.apphub_CardContentClickable > div.apphub_CardContentPreviewImageBorder > div.apphub_CardContentMain").map(function (i, el) {
            let img = $(el).find("img").attr("src");
            get_broadcast.push(img);
        });
        get_broadcast.splice(0, leave);
        res.send(get_broadcast);
        res.end();
        next();
    }).catch((err) => {
        console.error(err);
        res.end();
        next();
    });

}