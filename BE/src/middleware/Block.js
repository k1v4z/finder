const getCurrentHour = require("../helper/get_hour")

//block api when user access endpoint from 11h pm to 5h am
const blockEndPoint = (req, res, next) => {
    var hours = getCurrentHour()

    if (hours >=23 || hours < 5) {
        return res.status(403).json({
            message: "Hệ thống đang bảo trì"
        })
    }

    next()
}

module.exports = blockEndPoint