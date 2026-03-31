"use strict";

var should = require("should");
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db;
var EUM = require('../index');


const UserSchema = new Schema({});
UserSchema.plugin(EUM);
const Account = mongoose.model('user', UserSchema,'user');
var verify = EUM.Verify(Account);


describe('Account', function () {

    before(async function () {
        db = await mongoose.connect('mongodb://localhost/test_eum');
        var account = new Account({
            username: '12345',
            password: 'testy'
        });

        try {
            await account.save();
            console.log('no error');
        } catch (error) {
            console.log('error' + error.message);
            throw error;
        }
    });

    after(async function () {
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.db.dropDatabase();
            await mongoose.connection.close();
        }
    });


    it('find a user by username', async function () {
        var account = await Account.findOne({username: '12345'});
        account.username.should.eql('12345');
        console.log("   username: ", account.username);
    });

    it('Add an email to user', async function () {
        var account = await Account.findOne({username: '12345'});
        var email = account.addEmail('iamritghimire@gmail.com');
        email.address.should.eql('iamritghimire@gmail.com');
        account.addEmail('mail@ranjitghimire.com.np');
        var emailCount = account.emails.length;
        emailCount.should.eql(2);
        account.emails[0].address.should.eql('iamritghimire@gmail.com');
        var email2 = account.addEmail('iamritghimire@gmail.com');
        email2.should.eql(false);

        await account.setPrimaryEmail('mail@ranjitghimire.com.np');
        var email3 = account.getPrimaryEmail();
        email3.should.eql('mail@ranjitghimire.com.np');
        await account.save();
    });


    it('Adding primary email out of added email must cause error.', async function () {
        var account = await Account.findOne({username: '12345'});
        var e = 1;
        try {
            e = 2;
            await account.setPrimaryEmail('mail@amritghimire.com');
        } catch (p) {
            e = 3;
        }
        e.should.eql(3);
    });

    it('stores the username in lowercase (pre-save hook)', async function () {
        var account = new Account({ username: 'MixedCaseUser' });
        await account.save();
        var found = await Account.findOne({ username: 'mixedcaseuser' });
        found.username.should.eql('mixedcaseuser');
    });

    it('defaults is_active to true', async function () {
        var account = await Account.findOne({ username: '12345' });
        account.is_active.should.eql(true);
    });

    it('returns the correct full_name for a user with first and last name', async function () {
        var account = await Account.findOne({ username: '12345' });
        account.first_name = 'Amrit';
        account.last_name = 'Ghimire';
        account.full_name().should.eql('Amrit Ghimire');
    });

    it('sendVerificationToken returns null for an already-verified email', async function () {
        var account = await Account.findOne({ username: '12345' });
        account.addEmail('alreadyverified@example.com');
        account.getEmail('alreadyverified@example.com').verified = true;
        var result = await account.sendVerificationToken('alreadyverified@example.com');
        should.not.exist(result);
    });

    it('Check for verification code', async function () {
        var account = await Account.findOne({username: '12345'});
        var verificationData = await account.sendVerificationToken('iamritghimire@gmail.com');

        await new Promise(function (resolve, reject) {
            verify({params: {token: verificationData.token}}, null, function (err) {
                if (err) {
                    reject(new Error('Expected success but got: ' + err.message));
                } else {
                    resolve();
                }
            });
        });

        await new Promise(function (resolve, reject) {
            verify({params: {token: '1212'}}, null, function (err) {
                if (err) {
                    resolve();
                } else {
                    reject(new Error('Expected error for invalid token'));
                }
            });
        });
    });
});
