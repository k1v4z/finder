const express = require('express')
const feedbackRouter = express.Router()
const submitFeedback = require('../../controller/FeedbackController');
const blockEndPoint = require('../../middleware/Block');

feedbackRouter.post('/feedback-submit', submitFeedback);

const feedbackSubmit = (app) => {
    feedbackRouter.post('/feedback-submit',blockEndPoint,submitFeedback)
    feedbackRouter.get('/feebacks-view',)
    app.use('/api/v1/', feedbackRouter)
}
module.exports = feedbackSubmit