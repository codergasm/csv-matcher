import * as crypto from "crypto";

const createPasswordHash = (password) => {
    return crypto
        .createHash('sha256')
        .update(password)
        .digest('hex');
}

export default createPasswordHash;
