"use strict";
/**
 * Created by Amrit Ghimire on 2/26/19.
 */

module.exports = function (model) {
    if (model === undefined) {
        throw Error('Model is not provided.');
    }
    const User = model;

    return async function (req, res, next) {
        try {
            const user = await User.findOne({'emails.token': req.params.token}, 'emails');
            if (user === null) {
                return next(new Error('Invalid token'));
            }
            var email = user.emails.find(function (email) {
                return email['token'] === req.params.token;
            });

            email.token = undefined;
            email.verified = true;
            await user.save();
            return next();
        } catch (err) {
            return next(err);
        }
    };
};
