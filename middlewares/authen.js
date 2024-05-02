module.exports = {
    isLogedin: (req, res, next) => {
        const jwt = require('jsonwebtoken');
        const token = req.cookies.access_token;
        if (!token) {
            return res.status(401).json({
                "success": false,
                "message": "Access token required NICE TRY BABY!",
            });
        }

        const secret = process.env.JWT_SECRET;

        try {
            const verify = jwt.verify(token, secret);

            if (verify !== null) {
                next();
            } else {
                res.status(401).send({
                    success: false,
                    msg: "Access denied!"
                });
            }
        } catch (error) {
            res.status(401).send({
                success: false,
                msg: "Invalid token!"
            });
        }
    }
}