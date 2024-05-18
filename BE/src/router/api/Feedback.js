const express = require('express')
const feedbackRouter = express.Router()
const submitFeedback = require('../../controller/FeedbackController')
feedbackRouter.post('/feedback-submit', submitFeedback);

const feedbackSubmit = (app) => {
    app.use('/api/v1/feedback-submit', submitFeedback)
}
module.exports = feedbackSubmit