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