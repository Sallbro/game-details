
exports.successHandler = ({ req, res, data }) => {
    res.status(200).json({
        status: 200,
        message: "success",
        data: data
    });
}



exports.badRequest = ({ req, res, message, error }) => {
    if (!message) message = "something went wrong";
    if (!error) error = message;
    res.status(400).json({
        status: 400,
        message,
        error
    });
}

exports.serverError = ({ req, res, message, error }) => {
    if (!error) error = "something went wrong";
    if (!message) message=error;
    res.status(500).json({
        status: 500,
        message,
        error
    });
}