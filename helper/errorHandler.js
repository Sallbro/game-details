
exports.globalErrorHandler = (err, req, res, next) => {
    console.log(err);
    res.status(500).json({
        status: 'fail',
        message: 'Something went wrong',
    });
}