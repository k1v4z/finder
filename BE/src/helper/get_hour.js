function getCurrentHour() {
    var now = new Date();
    var hours = now.getHours();

    return hours
}

module.exports = getCurrentHour