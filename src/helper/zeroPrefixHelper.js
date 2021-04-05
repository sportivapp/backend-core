exports.zeroPrefixCodeByLength = (code, length) => {

    const codeString = code.toString();
    const zeroPrefixNum = length - codeString.length;

    if (zeroPrefixNum.length === length)
        return code.toString();

    let prefixedCode = '';

    for(let i=0;i<zeroPrefixNum;i++) {
        prefixedCode += '0';
    }

    return prefixedCode.concat(codeString);

}