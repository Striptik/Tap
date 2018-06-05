// Put on env variable
const SECRET = 'INSIGHTLAB';

// #Encrypt
const btoa = str => Buffer.from(str).toString('base64');

// #Decrypt
const atob = str => Buffer.from(str, 'base64').toString('utf-8');


const indexToCursor = index => btoa(`${SECRET}${index}`);
const cursorToIndex = cursor => Number(atob(cursor).replace(SECRET, ''));

module.exports = {
  indexToCursor,
  cursorToIndex,
};
