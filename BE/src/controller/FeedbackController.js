const feedbackSubmit = require('../service/Feedback/FeedbackService')


const submitFeedback = async (req, res) => {
    const data = [req.body.name, req.body.email, req.body.phone, req.body.satisfy, req.body.message]
    console.log(data)
    try {
        await feedbackSubmit(data)
        return res.status(200).json({
            message: 'Feedback submitted successfully'
        })
    }
    catch (error) {
        return res.status(500).json({
            message: 'failed to submit feedback'
        })
    }
}

module.exports = submitFeedback