exports.thisMonthTimestamp = () => {

    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    return firstDay.getTime();

}

exports.thisMonthTimestampUTC = () => {

    const now = new Date();
    const firstDay = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
    return firstDay.getTime();

}

exports.getTimeInMilis = async (year = 1, month = 1, day = 1, hour = 1, minute = 1, second = 1) => {

    return year * month * day * hour * minute * second * 1000;

}