const cheerio = require('cheerio');
const axios = require('axios');

exports.search = async (req, res, next) => {
     const sugg = req.query.sugg;
        let act_url = process.env['GET_SEARCH_URL'];
        act_url = act_url.replace("${sugg}", sugg);
        axios.get(act_url).then((response) => {
            const data = response.data;
            let img_url = "";
            for (x of data) {
                img_url = x.img;
                img_url = img_url.replace("capsule_sm_120", "header");
                x.img = img_url;
            }
            res.send(data);
            res.end();
    next();
        }).catch(e => {
            console.log(e);
            res.end();
            next();
        });

}
