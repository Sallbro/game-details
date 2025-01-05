
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
    const newpageno = Math.floor(Number(offset) / 10) > 0 ? Math.floor(Number(offset) / 10) : 0;
    const leave = Math.floor(((Number(offset) / 10) - newpageno) * 10); // fundamental limitation of binary floating-point arithmetics 
    const newlimit = Number(limit) + leave;
    return {
        newpageno,
        leave,
        newlimit
    };
}


exports.reviewFormatQuery = ({ limit, offset } = query) => {
    const startpageno = Math.ceil(Number(offset) / 10);
    const endpageno = startpageno + Math.floor(Number(limit) / 10);
    const leave = ((endpageno * 10) - ((endpageno - startpageno) * 10)) - limit;
    const startleave = Number(offset) % 10;
    const endleave = (((endpageno - startpageno+1) * 10) - limit) - startleave;

    return {
        startpageno,
        endpageno,
        leave,
        startleave,
        endleave
    };
}