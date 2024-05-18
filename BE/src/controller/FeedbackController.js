const feedbackSubmit = require('../service/Feedback/FeedbackService')


const submitFeedback = async (req, res) => {
    const data = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        satisfy: req.body.satisfy,
        message: req.body.message
    }
    //console.log(data)
    try {
        await feedbackSubmit(data)
            .then(() => {
                return res.status(200).json({
                    message: 'feedback submitted'
                })
            })
    }
    catch (error) {
        return res.status(500).json({
            message: 'failed to submit feedback'
        })
    }
}

module.exports = submitFeedback