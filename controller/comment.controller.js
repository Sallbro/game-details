const cheerio = require('cheerio');
const axios = require('axios');
const { reviewFormatQuery } = require('../helper/formatQuery');
const { seperator } = require('../helper/enum');
const { decodeId, splitCommentIdAndId } = require('../helper/convertor');
const { serverError, successHandler } = require('../helper/response');

exports.comments = async (req, res, next) => {
    const comment_id = req.params.comment_id;
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;
    const formData = new FormData();
    formData.append("start", offset); // Set limit
    formData.append("count", limit); // Set offset
    const decodeid = decodeId(comment_id);
    if (!decodeid || !decodeid.includes(seperator)) {
        res.status(400).send("invalid review id");
    }
    const { commentid, gameid } = splitCommentIdAndId(decodeid);
    let comment_url = process.env['COMMENT_URL'];
    comment_url = comment_url.replace("${env_game_id}", gameid).replace("${env_comment_id}", commentid);

    // fetch review
    await axios.post(comment_url, formData).then((response) => {
        const html = response.data.comments_html;
        const $ = cheerio.load(html);

        // comment
        const get_comments = [];
        $("div.commentthread_comment").each(function () {
            let get_comment = {};
            // user profile
            let user_profile = $(this).find("div.playerAvatar > a > img").attr("src");
            if (user_profile != undefined) {
                user_profile = user_profile.replace(".jpg", "_full.jpg");
            }
            // user name
            const user_name = $(this).find("div.commentthread_comment_content > div.commentthread_comment_author > a > bdi").text().trim();

            // content
            const content = $(this).find("div.commentthread_comment_content > div.commentthread_comment_text").text().trim();

            // append data to get_comments object
            get_comment.user_name = user_name;
            get_comment.user_profile = user_profile;
            get_comment.content = content;

            get_comments.push(get_comment);
        });

        return successHandler({
            req, res, data: {
                comments: get_comments,
                total: response.data.total_count,
                limit: Number(limit),
                offset: Number(offset)
            }
        });
    }).catch((err) => {
        return serverError({
            req, res, message: err?.message, error: err
        });
    });

}
