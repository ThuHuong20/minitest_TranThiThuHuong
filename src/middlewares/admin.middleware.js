let isAmin = true;
module.exports = {
    adminCheck: function (req, res, next) {
        if (isAmin) {
            next();
        } else {
            res.status(200).json(
                {
                    message: "ban khong phai la admin"
                }
            )

        }
    }
}