const notFound = (req, res, next) => {
    const error = new Error('Undefined Endpoint!');
    error.status = 404;
    return next(error);
}

export default notFound;