/**
 * Check is fields are present in object properties, not less not more
 * @param {*} required, array of required fields
 * @param {*} object, object where needed to find the required fields
 * @return {*} Object,  {more: [string], miss: [string], ok: Boolean }
 */
const checkFields = (required, object) => {
  const miss = [];
  const extra = [];

  // # Check missing fields
  required.forEach((prop) => {
    if (!(prop in object)) miss.push(prop);
  });

  // #Check extra fields
  for (const prop in object) {
    if (required.indexOf(prop) === -1) extra.push(prop);
  }

  // #Is there extra or missing fields
  const ok = (extra.length === 0 && miss.length === 0);

  return { ok, extra, miss };
};

module.exports = {
  checkFields,
};
