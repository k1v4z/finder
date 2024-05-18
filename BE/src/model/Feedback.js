const db = require("../config/Firebase");

const feedbacks = db.collection('feedbacks')

module.exports = feedbacks