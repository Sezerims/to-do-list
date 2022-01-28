// This module formats current date

let currentDate = new Date();

let options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
}

let dateText = {
    currentDateText: currentDate.toLocaleDateString([], options),
    currentDayName: currentDate.toLocaleDateString([], {weekday: 'long'}),
    currentYear: currentDate.toLocaleDateString([], {year: 'numeric'})
}

module.exports = dateText;