import { matchedData, validationResult } from 'express-validator';

const validationResultHandler = (req, res, next) => {
    try {
        const result = validationResult(req).array({ onlyFirstError: true });
        if (result.length !== 0) {
            const err = new Error(result[0].msg);
            err.status = 400;
            return next(err);
        }
        
        req.validatedData = matchedData(req);
        
        next();
    } catch (err) {
        console.log(`Error in validationResultHandler : ${err}`);
        const error = new Error(`Internal Server Error`);
        error.status = 500;
        return next(error);
    }
}

export default validationResultHandler;