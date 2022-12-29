import crypto from "crypto";

const access  = crypto.randomBytes(32).toString('hex');
const refresh = crypto.randomBytes(32).toString('hex');

console.table({ access, refresh });