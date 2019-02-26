"use strict";

const uuidv4 = require('uuid/v4');


module.exports = function (schema) {
    const schemaFields = {};

    schemaFields['emails'] = [{
        address: {
            type: String,
            validate: /\S+@\S+\.\S+/,
            required: true
        },
        verified: {
            type: Boolean,
            default: false
        },
        token: String
    }];
    schemaFields['email'] = {
        type: String,
        validate: /\S+@\S+\.\S+/,

        alias: 'primary_email'
    };
    schemaFields['is_active'] = {
        type: Boolean,
        default: true
    };
    schema.add(schemaFields);


    schema.methods.addEmail = function (emailToAdd) {
        var newEmail = this.getEmail(emailToAdd);
        if (newEmail) return false;

        this['emails'].push({address: emailToAdd, verified: false, token: uuidv4()});
        // this.save();
        return this.getEmail(emailToAdd);
    };

    schema.methods.getEmail = function (emailToFind) {
        return this['emails'].find(function (email) {
            return email['address'] === emailToFind;
        });
    };

    schema.methods.setPrimaryEmail = function (email) {
        var currentPrimaryEmail = this['email'];
        var newPrimaryEmail = this.getEmail(email);

        if (!newPrimaryEmail) throw new Error('Email does not exist');

        if (currentPrimaryEmail !== newPrimaryEmail) {
            this['email'] = email;
            this.save();
        }
        return newPrimaryEmail;
    };

    schema.methods.getPrimaryEmail = function () {
        var currentPrimaryEmail = this['email'];
        if (currentPrimaryEmail) {
            return currentPrimaryEmail;
        } else if (this['emails'].length > 0) {
            return this['emails'][0].address;
        } else {
            return false;
        }
    };
    schema.methods.sendVerificationToken = function (email, callback) {
        var email_doc = (typeof email === 'string' ? this.getEmail(email) : email);
        if (!email_doc) {
            return callback(email, null);
        }
        if(email_doc.verified === true){
            return callback(null, null);
        }
        if (email_doc.token === undefined) {
            return callback(email, null);
        }


        return callback(email_doc.address, email_doc.token);
    };
};

