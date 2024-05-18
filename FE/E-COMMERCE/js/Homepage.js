require('dotenv').config({ path: '../../../BE/.env' });
window.onload = function () {
    fetch(`http://localhost:${process.env.PORT}/`, {
        method: 'GET',
        contentType: 'application/json',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            window.location.href = '../Finder.html';
        })
        .catch(error => {
            console.error('Error:', error);
        });
}