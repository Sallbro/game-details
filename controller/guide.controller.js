const cheerio = require('cheerio');
const axios = require('axios');
const { mediaFormatQuery } = require('../helper/formatQuery');

exports.guides = async (req, res, next) => {
    const id = req.params.id;
    const page_no = req.params.page_no || 1;

    // actual url 
    let guides_url = process.env['GUIDE_URL'];
    guides_url = guides_url.replace("${env_game_id}", id);
    guides_url = guides_url.replace("${env_guide_pageno}", page_no);

    //start requesting
    await axios.get(guides_url).then((response) => {
        let get_guides = [];
        const html = response.data;
        const $ = cheerio.load(html);

        $("div.workshopItemCollectionContainer").map(function (i, el) {
            const guide = {};
            const guide_id = $(el).find("a").attr("data-publishedfileid");
            guide.guide_id = guide_id;

            const guide_title = $(el).addClass("a > div.workshopItemDetails > div.workshopItemTitle").text().trim().replace(/\n/g, "").replace(/\t/g, "");
            guide.title = guide_title;

            const guide_shortdesc = $(el).addClass("a > div.workshopItemDetails > div.workshopItemShortDesc").text().trim().replace(/\n/g, "").replace(/\t/g, "");
            guide.short_desc = guide_shortdesc;

            get_guides.push(guide);
        });
        res.send(get_guides);
        res.end();
        next();
    }).catch((err) => {
        console.error(err);
        res.end();
        next();
    });
}
exports.fullGuide = async (req, res, next) => {
     const guide_id = req.params.guide_id;
    
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
            const short_desc = $("div.guideTopContent > div.guideTopDescription").text();
            const full_desc = $("div.guide > div.subSection > div.subSectionDesc > b").html()?.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, '');
    
            get_guide.guide_id = guide_id;
            get_guide.postdate = postdate;
            get_guide.author = author;
            get_guide.title = title;
            get_guide.short_desc = short_desc;
            get_guide.full_desc = full_desc;
    
            res.send(get_guide);
            res.end();
        }).catch((err) => {
            console.error(err);
            res.end();
        });
}

