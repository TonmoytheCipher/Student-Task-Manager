const jwt = require('jsonwebtoken');

const authentication = (req, res , next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token)
    {
        res.status(401).json({error : 'Access Denied ! '});
        return;
    }

    jwt.verify(token,process.env.JWT_SECRET, (err, user) =>{

        if(err)
        {
            res.status(403).json({error : 'Session expired !'});
            return;
        }
        req.user = user;
        next();

    });

};

module.exports = authentication;