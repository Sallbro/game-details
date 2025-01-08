const cheerio = require('cheerio');
const axios = require('axios');

exports.single_game = async (req, res, next) => {

    const game_id = req.params.id;
    // actual url 
    let act_url = process.env['GET_SINGLE_GAME_URL'];
    act_url = act_url.replace("${game_id}", game_id);

    let set_header = {
        headers: {
            'Cookie': 'birthtime=1007145001'
        }
    };

    axios.get(act_url, set_header).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const result = {};
        // get Game name 
        const name = $("#appHubAppName").text();
        result.name = name;

        // get Game describtion 
        let desc = $("#game_highlights > div.rightcol > div > div.game_description_snippet").text();
        desc = desc.replace(/\t/g, '');
        desc = desc.replace(/\n/g, '');
        result.desc = desc;

        // get Game release date 
        const release_date = $("#game_highlights > div.rightcol > div > div.glance_ctn_responsive_left > div.release_date > div.date").text();
        result.release_date = release_date;

        // pricing section
        const pricing = [];
        // free pricing
        $("#game_area_purchase > div.game_area_purchase_game").map(function (i, e) {
            const name = $(this).find("h1").text().replace(/\t/g, '').trim();
            const price = $(this).find("div.game_purchase_action > div.game_purchase_action_bg > div.price").text().trim();
            if (name && price) {
                pricing.push({
                    name,
                    price
                });
            }
        });
        // paid pricing
        $("#game_area_purchase > div.game_area_purchase_game_wrapper").map(function (i, e) {
            const name = $(this).find("div.game_area_purchase_game > h1").text().replace(/\t/g, '').trim();
            const price = $(this).find("div.game_area_purchase_game > div.game_purchase_action > div.game_purchase_action_bg > div.price").text().trim();
            if (name && price) {
                pricing.push({
                    name,
                    price
                });
            }
        });
        result.pricing = pricing;

        // get external links
        const external_links = [];
        let website = $("#appDetailsUnderlinedLinks > div > div > div:nth-child(2) > a:nth-child(1)").attr("href");
        external_links.push({
            "name": "website",
            "link": decodeURIComponent(website).replace("https://steamcommunity.com/linkfilter/?u=", "")
        });
        for (let i = 2; i <= 5; i++) {
            let name = $(`#appDetailsUnderlinedLinks > div > div > div:nth-child(2) > a:nth-child(${i}) > span`).text();
            switch (name) {
                case "YouTube":
                    console.log(name);
                    external_links.push({
                        "name": "YouTube",
                        "link": decodeURIComponent($(`#appDetailsUnderlinedLinks > div > div > div:nth-child(2) > a:nth-child(${i})`).attr("href")).replace("https://steamcommunity.com/linkfilter/?u=", "")
                    });
                    break;
                case "X":
                    console.log(name);
                    external_links.push({
                        "name": "X",
                        "link": decodeURIComponent($(`#appDetailsUnderlinedLinks > div > div > div:nth-child(2) > a:nth-child(${i})`).attr("href")).replace("https://steamcommunity.com/linkfilter/?u=", "")
                    });
                    break;
                case "Instagram":
                    console.log(name);
                    external_links.push({
                        "name": "Instagram",
                        "link": decodeURIComponent($(`#appDetailsUnderlinedLinks > div > div > div:nth-child(2) > a:nth-child(${i})`).attr("href")).replace("https://steamcommunity.com/linkfilter/?u=", "")
                    });
                    break;
                case "Facebook":
                    console.log(name);
                    external_links.push({
                        "name": "Facebook",
                        "link": decodeURIComponent($(`#appDetailsUnderlinedLinks > div > div > div:nth-child(2) > a:nth-child(${i})`).attr("href")).replace("https://steamcommunity.com/linkfilter/?u=", "")
                    });
                    break;
            }
        }
        result.external_links = external_links;

        // get Game tags 
        const tags = [];
        result.tags = tags;
        $("#glanceCtnResponsiveRight > div.glance_tags_ctn.popular_tags_ctn > div.glance_tags.popular_tags > a").each(function () {
            tags.push($(this).text().trim());
        });

        // get language supported
        const lang = [];
        result.lang = lang;
        $("#languageTable > table > tbody > tr").map(function (i, el) {
            $(el).find('td:nth-of-type(1)').text().trim() !== "" ? lang.push($(el).find('td:nth-of-type(1)').text().trim()) : "";
        });

        //get dev details
        const developer_name = [];
        const publisher = [];
        const franchise = [];
        const dev_details = {
            developer_name,
            publisher,
            franchise
        }
        result.dev_details = dev_details;
        $("#genresAndManufacturer > div.dev_row").map(function (i, e) {
            // get developer_name
            if (i == 0) {
                $(e).find("a").map(function (i, e) {
                    developer_name.push($(e).text());
                })
            }
            // get publisher
            if (i == 1) {
                $(e).find("a").map(function (i, e) {
                    publisher.push($(e).text());
                })
            }
            // get franchise
            if (i == 2) {
                $(e).find("a").map(function (i, e) {
                    franchise.push($(e).text());
                })
            }

        });

        // get screenshot
        const screenshot = [];
        const videos = [];
        const images = {
            screenshot: screenshot,
            videos: videos
        }
        result.images = images;
        const sys_req = {}
        result.sys_req = sys_req;
        $("#highlight_player_area > div > div.screenshot_holder > a").each(function () {
            screenshot.push($(this).attr("href"));
        });

        // get videos
        let video_url = process.env['VIDEO_URL'];
        $("#highlight_strip_scroll > div > img").each(function () {
            if ($(this).attr("class") == "movie_thumb") {
                let str = $(this).attr("src");
                str = str.slice(str.indexOf("apps/") + 5, str.indexOf("/movie"));
                video_url = video_url.replace("${str}", str);
                videos.push(video_url);
            }
        });

        // get system_requirement
        $("div.sysreq_contents > div").each(function () {

            // get for Window 
            if ($(this).attr("data-os") == "win") {
                const min_window = [];
                const rec_window = [];
                const window = {
                    min: min_window,
                    recomm: rec_window
                }
                sys_req.window = window;
                //check types of sys_req [full] or [leftcol and rightcol]
                if ($("[data-os = 'win'] div").hasClass("game_area_sys_req_full") == true) {
                    $("[data-os = 'win'] div.game_area_sys_req_full > ul > ul > li").each(function () {
                        min_window.push($(this).text());
                        rec_window.push($(this).text());
                    })
                }
                else {
                    // get MINIMUM
                    $("[data-os = 'win'] div.game_area_sys_req_leftCol > ul > ul > li").each(function () {
                        min_window.push($(this).text());
                    })

                    // get RECOMMENDED
                    $("[data-os = 'win'] div.game_area_sys_req_rightCol > ul > ul > li").each(function () {
                        rec_window.push($(this).text());
                    })
                }
            }
            // get for Linux 
            if ($(this).attr("data-os") == "linux") {
                const min_linux = [];
                const rec_linux = [];
                const linux = {
                    min: min_linux,
                    recomm: rec_linux
                }
                sys_req.linux = linux;
                //check types of sys_req [full] or [leftcol and rightcol]
                if ($("[data-os = 'linux'] div").hasClass("game_area_sys_req_full") == true) {
                    $("[data-os = 'linux'] div.game_area_sys_req_full > ul > ul > li").each(function () {
                        min_linux.push($(this).text());
                        rec_linux.push($(this).text());
                    })
                }
                else {
                    // get MINIMUM
                    $("[data-os = 'linux'] div.game_area_sys_req_leftCol > ul > ul > li").each(function () {
                        min_linux.push($(this).text());
                    })

                    // get RECOMMENDED
                    $("[data-os = 'linux'] div.game_area_sys_req_rightCol > ul > ul > li").each(function () {
                        rec_linux.push($(this).text());
                    })
                }
            }
            // get for Macos 
            if ($(this).attr("data-os") == "mac") {
                const min_macos = [];
                const rec_macos = [];
                const mac_os = {
                    min: min_macos,
                    recomm: rec_macos
                }
                sys_req.mac_os = mac_os;
                //check types of sys_req [full] or [leftcol and rightcol]
                if ($("[data-os = 'mac'] div").hasClass("game_area_sys_req_full") == true) {
                    $("[data-os = 'mac'] div.game_area_sys_req_full > ul > ul > li").each(function () {
                        min_macos.push($(this).text());
                        rec_macos.push($(this).text());
                    })
                }
                else {
                    // get MINIMUM
                    $("[data-os = 'mac'] div.game_area_sys_req_leftCol > ul > ul > li").each(function () {
                        min_macos.push($(this).text());
                    })

                    // get RECOMMENDED
                    $("[data-os = 'mac'] div.game_area_sys_req_rightCol > ul > ul > li").each(function () {
                        rec_macos.push($(this).text());
                    })
                }
            }
        });

        // about Game 
        let about_game = $("#game_area_description").text();
        about_game = about_game.replace(/\t/g, '');
        about_game = about_game.replace(/\n/g, '');
        result.about_game = about_game;

        res.status(200).send(result);
        res.end();
        next();

    }).catch((err) => {
        console.error(err);
        res.end();
        next();

    });
}

exports.about_game = async (req, res, next) => {
    const game_id = req.params.id;
    // actual url 
    let act_url = process.env['GET_SINGLE_GAME_URL'];
    act_url = act_url.replace("${game_id}", game_id);

    let set_header = {
        headers: {
            'Cookie': 'birthtime=1007145001'
        }
    };

    axios.get(act_url, set_header).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const result = {};

        // about Game 
        let about_game = $("#game_area_description").text();
        about_game = about_game.replace(/\t/g, '');
        about_game = about_game.replace(/\n/g, '');
        result.about_game = about_game;

        res.status(200).send(result);
        res.end();
        next();

    }).catch((err) => {
        console.error(err);
        res.end();
        next();

    });
}

exports.requirements = async (req, res, next) => {
    const game_id = req.params.id;
    // actual url 
    let act_url = process.env['GET_SINGLE_GAME_URL'];
    act_url = act_url.replace("${game_id}", game_id);

    let set_header = {
        headers: {
            'Cookie': 'birthtime=1007145001'
        }
    };

    axios.get(act_url, set_header).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const result = {};

        // get system_requirement
        const sys_req = {}
        result.sys_req = sys_req;
        $("div.sysreq_contents > div").each(function () {

            // get for Window 
            if ($(this).attr("data-os") == "win") {
                const min_window = [];
                const rec_window = [];
                const window = {
                    min: min_window,
                    recomm: rec_window
                }
                sys_req.window = window;
                //check types of sys_req [full] or [leftcol and rightcol]
                if ($("[data-os = 'win'] div").hasClass("game_area_sys_req_full") == true) {
                    $("[data-os = 'win'] div.game_area_sys_req_full > ul > ul > li").each(function () {
                        min_window.push($(this).text());
                        rec_window.push($(this).text());
                    })
                }
                else {
                    // get MINIMUM
                    $("[data-os = 'win'] div.game_area_sys_req_leftCol > ul > ul > li").each(function () {
                        min_window.push($(this).text());
                    })

                    // get RECOMMENDED
                    $("[data-os = 'win'] div.game_area_sys_req_rightCol > ul > ul > li").each(function () {
                        rec_window.push($(this).text());
                    })
                }
            }
            // get for Linux 
            if ($(this).attr("data-os") == "linux") {
                const min_linux = [];
                const rec_linux = [];
                const linux = {
                    min: min_linux,
                    recomm: rec_linux
                }
                sys_req.linux = linux;
                //check types of sys_req [full] or [leftcol and rightcol]
                if ($("[data-os = 'linux'] div").hasClass("game_area_sys_req_full") == true) {
                    $("[data-os = 'linux'] div.game_area_sys_req_full > ul > ul > li").each(function () {
                        min_linux.push($(this).text());
                        rec_linux.push($(this).text());
                    })
                }
                else {
                    // get MINIMUM
                    $("[data-os = 'linux'] div.game_area_sys_req_leftCol > ul > ul > li").each(function () {
                        min_linux.push($(this).text());
                    })

                    // get RECOMMENDED
                    $("[data-os = 'linux'] div.game_area_sys_req_rightCol > ul > ul > li").each(function () {
                        rec_linux.push($(this).text());
                    })
                }
            }
            // get for Macos 
            if ($(this).attr("data-os") == "mac") {
                const min_macos = [];
                const rec_macos = [];
                const mac_os = {
                    min: min_macos,
                    recomm: rec_macos
                }
                sys_req.mac_os = mac_os;
                //check types of sys_req [full] or [leftcol and rightcol]
                if ($("[data-os = 'mac'] div").hasClass("game_area_sys_req_full") == true) {
                    $("[data-os = 'mac'] div.game_area_sys_req_full > ul > ul > li").each(function () {
                        min_macos.push($(this).text());
                        rec_macos.push($(this).text());
                    })
                }
                else {
                    // get MINIMUM
                    $("[data-os = 'mac'] div.game_area_sys_req_leftCol > ul > ul > li").each(function () {
                        min_macos.push($(this).text());
                    })

                    // get RECOMMENDED
                    $("[data-os = 'mac'] div.game_area_sys_req_rightCol > ul > ul > li").each(function () {
                        rec_macos.push($(this).text());
                    })
                }
            }
        });
        res.status(200).send(result);
        res.end();
        next();

    }).catch((err) => {
        console.error(err);
        res.end();
        next();

    });
}

exports.tags = async (req, res, next) => {
    const game_id = req.params.id;
    // actual url 
    let act_url = process.env['GET_SINGLE_GAME_URL'];
    act_url = act_url.replace("${game_id}", game_id);

    let set_header = {
        headers: {
            'Cookie': 'birthtime=1007145001'
        }
    };

    axios.get(act_url, set_header).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const result = {};

        // get Game tags 
        const tags = [];
        result.tags = tags;
        $("#glanceCtnResponsiveRight > div.glance_tags_ctn.popular_tags_ctn > div.glance_tags.popular_tags > a").each(function () {
            tags.push($(this).text().trim());
        });

        res.status(200).send(result);
        res.end();
        next();

    }).catch((err) => {
        console.error(err);
        res.end();
        next();

    });
}

exports.languages_supported = async (req, res, next) => {
    const game_id = req.params.id;
    // actual url 
    let act_url = process.env['GET_SINGLE_GAME_URL'];
    act_url = act_url.replace("${game_id}", game_id);

    let set_header = {
        headers: {
            'Cookie': 'birthtime=1007145001'
        }
    };

    axios.get(act_url, set_header).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const result = {};

        // get language supported
        const lang = [];
        result.lang = lang;
        $("#languageTable > table > tbody > tr").map(function (i, el) {
            $(el).find('td:nth-of-type(1)').text().trim() !== "" ? lang.push($(el).find('td:nth-of-type(1)').text().trim()) : "";
        });

        res.status(200).send(result);
        res.end();
        next();

    }).catch((err) => {
        console.error(err);
        res.end();
        next();

    });
}

exports.external_links = async (req, res, next) => {
    const game_id = req.params.id;
    // actual url 
    let act_url = process.env['GET_SINGLE_GAME_URL'];
    act_url = act_url.replace("${game_id}", game_id);

    let set_header = {
        headers: {
            'Cookie': 'birthtime=1007145001'
        }
    };

    axios.get(act_url, set_header).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const result = {};

        // get website
        const external_links = [];
        let website = $("#appDetailsUnderlinedLinks > div > div > div:nth-child(2) > a:nth-child(1)").attr("href");
        external_links.push({
            "name": "website",
            "link": decodeURIComponent(website).replace("https://steamcommunity.com/linkfilter/?u=", "")
        });
        for (let i = 2; i <= 5; i++) {
            let name = $(`#appDetailsUnderlinedLinks > div > div > div:nth-child(2) > a:nth-child(${i}) > span`).text();
            switch (name) {
                case "YouTube":
                    external_links.push({
                        "name": "YouTube",
                        "link": decodeURIComponent($(`#appDetailsUnderlinedLinks > div > div > div:nth-child(2) > a:nth-child(${i})`).attr("href")).replace("https://steamcommunity.com/linkfilter/?u=", "")
                    });
                    break;
                case "X":
                    external_links.push({
                        "name": "X",
                        "link": decodeURIComponent($(`#appDetailsUnderlinedLinks > div > div > div:nth-child(2) > a:nth-child(${i})`).attr("href")).replace("https://steamcommunity.com/linkfilter/?u=", "")
                    });
                    break;
                case "Instagram":
                    external_links.push({
                        "name": "Instagram",
                        "link": decodeURIComponent($(`#appDetailsUnderlinedLinks > div > div > div:nth-child(2) > a:nth-child(${i})`).attr("href")).replace("https://steamcommunity.com/linkfilter/?u=", "")
                    });
                    break;
                case "Facebook":
                    external_links.push({
                        "name": "Facebook",
                        "link": decodeURIComponent($(`#appDetailsUnderlinedLinks > div > div > div:nth-child(2) > a:nth-child(${i})`).attr("href")).replace("https://steamcommunity.com/linkfilter/?u=", "")
                    });
                    break;
            }
        }
        result.external_links = external_links;

        res.status(200).send(result);
        res.end();
        next();

    }).catch((err) => {
        console.error(err);
        res.end();
        next();

    });
}