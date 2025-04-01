
exports.formatQuery = ({ limit, offset } = query) => {
    const newpageno = Math.floor(Number(offset) / 10) > 0 ? Math.floor(Number(offset) / 10) : 0;
    const leave = Math.floor(((Number(offset) / 10) - newpageno) * 10); // fundamental limitation of binary floating-point arithmetics 
    const newlimit = Number(limit) + leave;
    return {
        newpageno,
        leave,
        newlimit
    };
}

exports.mediaFormatQuery = ({ limit, offset } = query) => {
    const startpageno = Math.floor(Number(offset) / 10) + 1;
    // const endpageno = Math.floor(((Number(offset) / 10) - newpageno) * 10); // fundamental limitation of binary floating-point arithmetics 
    const leave = Math.abs(((Number(offset) / 10) * 10) - 10);
    const newlimit = Number(limit) + leave;
    return {
        startpageno, leave, newlimit
    };
}

exports.reviewFormatQuery = ({ limit, offset } = query) => {
    const startpageno = Math.floor(Number(offset) / 10) + 1;
    const endpageno = startpageno + Math.ceil(Number(limit) / 10);
    const startskip = Math.floor(offset % 10);
    const endskip = Math.floor(limit % 10);

    return {
        startpageno,
        endpageno,
        startskip,
        endskip
    }
}

exports.formateData = (data) => {
    return data.replace(/\n/g, "").replace(/\r/g, "").replace(/\t/g, "");
}