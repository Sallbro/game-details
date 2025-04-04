const cheerio = require('cheerio');
const axios = require('axios');
const { successHandler, serverError, badRequest } = require('../helper/response');

exports.franchise = async (req, res, next) => {

    const game_id = req.params.id;

    if (!game_id) {
            return badRequest({ req, res, message: "Game id is required" });
        }

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

        //get franchise
        const franchise = [];
        result.franchise = franchise;
        $("#genresAndManufacturer > div.dev_row").map(function (i, e) {
            // get franchise
            if (i == 2) {
                $(e).find("a").map(function (i, e) {
                    franchise.push($(e).text());
                })
            }

        });

        return successHandler({
            req, res, data: result
        });
    }).catch((err) => {
        return serverError({
            req, res, message: err?.message, error: err
        });
    });
}

exports.developerName = async (req, res, next) => {

    const game_id = req.params.id;

    if (!game_id) {
        return badRequest({ req, res, message: "Game id is required" });
    }

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

        //get dev details
        const developer_name = [];
        result.developer_name = developer_name;
        $("#genresAndManufacturer > div.dev_row").map(function (i, e) {
            // get developer_name
            if (i == 0) {
                $(e).find("a").map(function (i, e) {
                    developer_name.push($(e).text());
                })
            }

        });
        result.developer_name = developer_name;

        return successHandler({
            req, res, data: result
        });
    }).catch((err) => {
        return serverError({
            req, res, message: err?.message, error: err
        });
    });
}

exports.publisher = async (req, res, next) => {

    const game_id = req.params.id;
    
    if (!game_id) {
        return badRequest({ req, res, message: "Game id is required" });
    }
    
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

        //get dev details
        const publisher = [];
        result.publisher = publisher;
        $("#genresAndManufacturer > div.dev_row").map(function (i, e) {
            // get publisher
            if (i == 1) {
                $(e).find("a").map(function (i, e) {
                    publisher.push($(e).text());
                })
            }

        });

        return successHandler({
            req, res, data: result
        });
    }).catch((err) => {
        return serverError({
            req, res, message: err?.message, error: err
        });
    });
}