const express = require('express')
const feedbackRouter = express.Router()
const submitFeedback = require('../../controller/FeedbackController')
feedbackRouter.post('/feedback-submit', submitFeedback);

const feedbackSubmit = (app) => {
    feedbackRouter.post('/feedback-submit', submitFeedback)
    app.use('/api/v1/', feedbackRouter)
}
module.exports = feedbackSubmit