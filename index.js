"use strict";


var basic_structure = require('./lib/basic');
var email_structure = require('./lib/email');
var verify = require('./lib/verify');


module.exports = function (schema, options) {
    basic_structure(schema, options);
    email_structure(schema);
};
module.exports.Basic = basic_structure;
module.exports.Email = email_structure;
module.exports.Verify = verify;

