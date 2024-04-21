const format = require('date-fns/format');

function formatMessages(username, text){
    return {
        username,
        text,
        time: format('h:mm a')
    }
}

module.exports = formatMessages;