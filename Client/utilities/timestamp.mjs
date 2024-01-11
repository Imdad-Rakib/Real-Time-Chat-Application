/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import moment from 'moment'
const timestamp = (time) => {
    const currentTime = moment();
    const messageTime = moment(time);
    const timeDifference = currentTime.diff(messageTime, 'hours');

    if (timeDifference < 24) {
        return messageTime.format('h:mm A');
    } else if (timeDifference < 24 * 7) {
        return messageTime.format('dddd');
    } else if (messageTime.isSame(currentTime, 'year')) {
        return messageTime.format('MMMM D');
    } else {
        return messageTime.format('MMMM D, YYYY');
    }
};
export {timestamp}