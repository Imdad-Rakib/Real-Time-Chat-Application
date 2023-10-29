import createHttpError from "http-errors";

// 404 not found handler
function notFoundHandler(req, res, next) {
    next(createHttpError(404, 'Your requested content was not found!'))
}

// default error handler
function errorHandler(err, req, res, next){
    res.locals.error = 
        process.env.NODE_ENV === 'development' ? err : {message: err.message};

    if(!res.locals.html){
        // html response
        res.render('error', {
            title: 'Error Page',
            error: err,
        });
    }
    else{
        // json response
        res.json(res.locals.error)
    }
}

export {notFoundHandler, errorHandler}