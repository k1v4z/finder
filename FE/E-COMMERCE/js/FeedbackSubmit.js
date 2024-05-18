window.onload = function () {
    document.getElementById('feedbackSubmit').addEventListener('submit', function (event) {
        const uname = document.getElementById('uname').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const satisfyChoice = document.querySelector('input[name="satisfy"]:checked').value;
        const suggestion = document.getElementById('msg').value;

        let feedbackData = {
            uname: uname,
            email: email,
            phone: phone,
            satisfy: satisfyChoice,
            suggestion: suggestion
        };

        fetch('/feedback-submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(feedbackData),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                alert('Feedback submitted successfully');
                document.getElementById('uname').value = '';
                document.getElementById('email').value = '';
                document.getElementById('phone').value = '';
                document.getElementById('msg').value = '';
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to submit feedback');
            });

    });
}