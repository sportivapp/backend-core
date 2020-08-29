exports.create4DigitsOTP = () => {

    //1000 - 9999
    const otpCode = Math.floor(1000 + Math.random() * 9000);

    return otpCode;

}

exports.create6DigitsOTP = () => {

    //100000 - 999999
    const otpCode = math.floor(100000 + Math.random() * 900000);

    return otpCode;

}