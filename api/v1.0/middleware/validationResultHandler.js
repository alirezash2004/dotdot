import { matchedData, validationResult } from 'express-validator';

const validationResultHandler = (req, res, next) => {
    const result = validationResult(req).array({ onlyFirstError: true });
    if (result.length !== 0) {
        const err = new Error(result[0].msg);
        err.status = 400;
        return next(err);
    }

    req.validatedData = matchedData(req);

    next();
}

export default validationResultHandler;