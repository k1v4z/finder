const feedbacks = require("../../model/Feedback");
const feedbackSubmit = async (feedbackData) => {
    try {
        //save feedback to database
        const docRef = await feedbacks.add(feedbackData);
        console.log("Document written with ID: ", docRef.id);
    } catch (error) {
        console.error("Error adding document: ", error);
    }
}

module.exports = feedbackSubmit