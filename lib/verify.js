"use strict";
/**
 * Created by Amrit Ghimire on 2/26/19.
 */

module.exports = function (model) {
    if (model === undefined) {
        throw Error('Model is not provided.');
    }
    const User = model;

    return function (req, res, next) {
        User.findOne({'emails.token': req.params.token}, 'emails', function (err, user) {
            if (err) {
                next(err);
                return;
            }
            if (user === null) {
                next(new Error('Token invalid'));
                return;
            }
            var email = user.emails.find(function (email) {
                return email['token'] === req.params.token;
            });

            email.token = undefined;
            email.verified = true;
            user.save();
            next();
        });
    };
};
