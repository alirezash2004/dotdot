const customHeaders = (req, res, next) => {
    res.setHeader('X-Powered-By', 'DotDot');
    next();
}

export default customHeaders