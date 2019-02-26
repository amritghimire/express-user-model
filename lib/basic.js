"use strict";

/**
 * Created by amrit on 2/26/19.
 */

module.exports = function (schema, options) {
    options = options || {};
    options.usernameField = options.usernameField || 'username';
    options.usernameUnique = options.usernameUnique === undefined? true: options.usernameUnique;
    options.findByUsername = options.findByUsername || function (model, queryParameters) {
            return model.findOne(queryParameters);
        };
    const schemaFields = {};
    if (!schema.path(options.usernameField)) {
        schemaFields[options.usernameField] = {type: String, unique: options.usernameUnique};
    }
    if (!schema.path(options.usernameField)) {
        schemaFields[options.usernameField] = {
            type: String,
            unique: options.usernameUnique,
            validate: /[a-z0-9]+/
        };
    }

    schemaFields['first_name'] = {
        type: String
    };
    schemaFields['last_name'] = {
        type: String
    };

    schema.add(schemaFields);
    schema.methods.full_name = function () {
        var full_name = '';
        if (this['first_name'])
            full_name += this['first_name'] + " ";
        if (this['last_name'])
            full_name += this['last_name'];
        return full_name;
    };


    schema.pre("save", function (next) {
        if (this.isNew) {
            this.username= this.username.toLowerCase();
        }
        return next();
    });


};