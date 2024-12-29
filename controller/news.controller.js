const cheerio = require('cheerio');
const axios = require('axios');

exports.allnews = async (req, res, next) => {
    const id = req.params.id;
    const category = allnews;
    const limit = req.query.limit;
    const offset = Math.ceil(Number(req.query.offset) / 10) > 0 ? Math.ceil(Number(req.query.offset) / 10) : 0;


    // actual url 
    let news_url = process.env['NEWS_URL'];
    news_url = news_url.replace("${env_game_id}", id);
    news_url = news_url.replace("${env_newscategory}", category);

    //direct review url
    let direct_news_url = process.env['DIRECT_NEWS_URL'];

    //endpoints
    let endpoints = [news_url];

    //check the limit 
    if (limit > 10 && limit < 100) {
        for (var i = 1 + offset; i <= Math.ceil((Number(limit) / 10)) + offset; i++) {
            let env_dir_rev_url = direct_news_url;
            env_dir_rev_url = env_dir_rev_url.replace(/\${env_newspageno}/g, i).replace(/\${env_newscategory}/g, category).replace("${env_announcementsoffset}", (i - 1) * 10).replace("${env_game_id}", id);

            endpoints.push(env_dir_rev_url);
        }
    }
    else {
        for (var i = 1; i <= 10; i++) {
            let env_dir_rev_url = direct_news_url;
            env_dir_rev_url = env_dir_rev_url.replace(/\${env_newspageno}/g, i).replace(/\${env_newscategory}/g, category).replace("${env_announcementsoffset}", (i - 1) * 10).replace("${env_game_id}", id);

            endpoints.push(env_dir_rev_url);
        }
    }

    //start requesting
    axios.all(endpoints.map(async (endpoint) => {
        let get_reviews = [];
        await axios.get(endpoint).then((response) => {
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
        });
        return get_reviews;
    }
    )).then((data) => {
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

exports.announcements = async (req, res, next) => {
    const id = req.params.id;
    const category = announcements;
    const limit = req.query.limit;
    const offset = Math.ceil(Number(req.query.offset) / 10) > 0 ? Math.ceil(Number(req.query.offset) / 10) : 0;


    // actual url 
    let news_url = process.env['NEWS_URL'];
    news_url = news_url.replace("${env_game_id}", id);
    news_url = news_url.replace("${env_newscategory}", category);

    //direct review url
    let direct_news_url = process.env['DIRECT_NEWS_URL'];

    //endpoints
    let endpoints = [news_url];

    //check the limit 
    if (limit > 10 && limit < 100) {
        for (var i = 1 + offset; i <= Math.ceil((Number(limit) / 10)) + offset; i++) {
            let env_dir_rev_url = direct_news_url;
            env_dir_rev_url = env_dir_rev_url.replace(/\${env_newspageno}/g, i).replace(/\${env_newscategory}/g, category).replace("${env_announcementsoffset}", (i - 1) * 10).replace("${env_game_id}", id);

            endpoints.push(env_dir_rev_url);
        }
    }
    else {
        for (var i = 1; i <= 10; i++) {
            let env_dir_rev_url = direct_news_url;
            env_dir_rev_url = env_dir_rev_url.replace(/\${env_newspageno}/g, i).replace(/\${env_newscategory}/g, category).replace("${env_announcementsoffset}", (i - 1) * 10).replace("${env_game_id}", id);

            endpoints.push(env_dir_rev_url);
        }
    }

    //start requesting
    axios.all(endpoints.map(async (endpoint) => {
        let get_reviews = [];
        await axios.get(endpoint).then((response) => {
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
        });
        return get_reviews;
    }
    )).then((data) => {
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
