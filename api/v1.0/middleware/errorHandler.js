const errorHandler = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).json({ success: false, msg: err.message });
    } else {
        res.status(500).json({ success: false, msg: err.message });
    }
}

export default errorHandler;