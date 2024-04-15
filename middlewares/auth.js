const {validateToken} = require('../services/auth');

function checkForAuthenticationCookie(cookie)
{
    return async function(req,res,next){
        const token = req.cookies[cookie];
        if(!token){
            return next();
        }
        try
        {
            const payload = validateToken(token);
            req.user = payload;
        }
        catch(err){}
        return next();
    }
}

module.exports = {
    checkForAuthenticationCookie
}