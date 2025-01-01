const cheerio = require('cheerio');
const axios = require('axios');

exports.screenshots = async (req, res, next) => {
    const id = req.params.id;
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;

    // actual url 
    // let screenshot_url = process.env['SCREENSHOTS_URL'];
    // screenshot_url = screenshot_url.replace("${env_game_id}", id);

    //direct review url
    let direct_screenshot_url = process.env['DIRECT_SCREENSHOTS_URL'];
    direct_screenshot_url = direct_screenshot_url.replace("${env_game_id}", id).replace("${env_offset}", offset).replace("${env_limit}", limit);

    //start requesting
    axios.get(direct_screenshot_url).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        let screenshot = [];
        $("div.apphub_Card > div.apphub_CardContentClickable > div.apphub_CardContentPreviewImageBorder > div.apphub_CardContentMain").map(function (i, el) {
            let img = $(el).find("img.apphub_CardContentPreviewImage").attr("src");
            screenshot.push(img);
        });
        res.send(final_data);
        res.end();
    }).catch((err) => {
        console.error(err);
        res.end();
    });
    next();
}

exports.videos = async (req, res, next) => {
    const id = req.params.id;
    const limit = req.query.limit;
    const offset = Math.ceil(Number(req.query.offset) / 10) > 0 ? Math.ceil(Number(req.query.offset) / 10) : 0;

    // actual url 
    let screenshot_url = process.env['VIDEOS_URL'];
    screenshot_url = screenshot_url.replace("${env_game_id}", id);

    //direct review url
    let direct_screenshot_url = process.env['DIRECT_VIDEOS_URL'];

    //endpoints
    let endpoints = [screenshot_url];

    //check the limit 
    if (limit > 10 && limit < 100) {
        for (var i = 1 + offset; i <= Math.ceil((Number(limit) / 10)) + offset; i++) {
            let env_dir_rev_url = direct_screenshot_url;
            env_dir_rev_url = env_dir_rev_url.replace(/\${env_videospageno}/g, i).replace("${env_game_id}", id);

            endpoints.push(env_dir_rev_url);
        }
    }
    else {
        let env_dir_rev_url = direct_screenshot_url;
        env_dir_rev_url = env_dir_rev_url.replace(/\${env_videospageno}/g, i).replace("${env_game_id}", id);

        endpoints.push(env_dir_rev_url);
    }

    //start requesting
    axios.all(endpoints.map(async (endpoint) => {
        let get_videos = [];

        await axios.get(endpoint).then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            const regex_video = /\/vi\/([^\/]+)\//;

            $("div.apphub_Card > div.apphub_CardContentClickable > div.apphub_CardContentPreviewImageBorder > div.apphub_CardContentMain").map(function (i, el) {
                let img = $(el).find("img.apphub_CardContentPreviewImage").attr("src");
                get_videos.push("https://www.youtube.com/watch?v=" + img.match(regex_video)[1]);
            });
        })
        return get_videos;
    })).then((data) => {
        const final_data = [];
        for (x of data) {
            final_data.push(...x);
        }
        res.send(final_data);
        res.end();
    }).catch((err) => {
        console.error(err);
        res.end();
    });
    next();
}

exports.broadcasts = async (req, res, next) => {
    const id = req.params.id;
    const limit = req.query.limit;
    const offset = Math.ceil(Number(req.query.offset) / 10) > 0 ? Math.ceil(Number(req.query.offset) / 10) : 0;


    // actual url 
    let broadcast_url = process.env['BROADCAST_URL'];
    broadcast_url = broadcast_url.replace("${env_game_id}", id);
    broadcast_url = broadcast_url.replace("${env_broadcastpageno}", 1 + offset);
    broadcast_url = broadcast_url.replace("${env_broadcast_limit}", limit || 10);

    //start requesting
    await axios.get(broadcast_url).then((response) => {
        let get_broadcast = [];
        const html = response.data;
        const $ = cheerio.load(html);

        $("div.Broadcast_Card").map(function (i, el) {
            let img = $(el).find("a").attr("href");
            get_broadcast.push(img);
        });
        res.send(get_broadcast);
        res.end();
    }).catch((err) => {
        console.error(err);
        res.end();
    });
    next();
}
exports.artwork = async (req, res, next) => {
    const id = req.params.id;
    const limit = req.query.limit;
    const offset = Math.ceil(Number(req.query.offset) / 10) > 0 ? Math.ceil(Number(req.query.offset) / 10) : 0;


    // actual url 
    let artwork_url = process.env['ARTWORK_URL'];
    artwork_url = artwork_url.replace(/\${env_game_id}/g, id);
    artwork_url = artwork_url.replace(/\${env_artworkpageno}/g, 1 + offset);
    artwork_url = artwork_url.replace(/\${env_artwork_limit}/g, limit || 10);

    //start requesting
    await axios.get(artwork_url).then((response) => {
        let get_broadcast = [];
        const html = response.data;
        const $ = cheerio.load(html);

        $("div.apphub_Card > div.apphub_CardContentClickable > div.apphub_CardContentPreviewImageBorder > div.apphub_CardContentMain").map(function (i, el) {
            let img = $(el).find("img").attr("src");
            get_broadcast.push(img);
        });
        res.send(get_broadcast);
        res.end();
    }).catch((err) => {
        console.error(err);
        res.end();
    });
    next();
}