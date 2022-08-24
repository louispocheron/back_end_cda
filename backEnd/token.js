const jwt = require('jsonwebtoken');

/* Récupération du header bearer */
const extractBearerToken = headerValue => {
    if (typeof headerValue !== 'string') {
        return false
    }
    const matches = headerValue.match(/(bearer)\s+(\S+)/i)
    return matches && matches[2]
}

/* Vérification du token */
const checkTokenMiddleware = (req, res, next) => {
    // Récupération du 
    const token = req.headers.authorization && extractBearerToken(req.headers.authorization)

    // Présence d'un token
    if (!token) {
        return res.status(401).json({ message: 'Besoin d"un token batard' })
    }

    // Véracité du token
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
        if (err) {
            res.status(401).json({ 
                message: 'mauvais token',
             })
        } else {
            req.user = decodedToken;
            return next();
        }
    })
}


module.exports = checkTokenMiddleware;
