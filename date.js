// This module formats current date

let currentDate = new Date();

let options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
}

let dateText = {
    currentDateText: currentDate.toLocaleDateString([], options),
    currentDayName: currentDate.toLocaleDateString([], {weekday: 'long'})
}

module.exports = dateText;