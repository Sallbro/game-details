const { status } = require("./enum");

exports.globalErrorHandler = (err, req, res, next) => {

    res.status(500).json({
        status: 'fail',
        message: 'Something went wrong',
    });
}

exports.badRequestHandler = ({ res, message, err, data },) => {
    if (!message) {
        message = 'Bad Request';
    }
    if (!err) {
        err = message;
    }
    if (data) {
        return res.status(400).json({
            status: status.fail,
            data: data,
            message: message,
            error: err
        })
    }
    return res.status(400).json({
        status: status.fail,
        message: message,
        error: err
    })
}