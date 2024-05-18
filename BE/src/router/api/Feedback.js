const express = require('express')
const feedbackRouter = express.Router()
const submitFeedback = require('../../controller/FeedbackController')
feedbackRouter.post('/feedback-submit', submitFeedback);

module.exports = feedbackRouter