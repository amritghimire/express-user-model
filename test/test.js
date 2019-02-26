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

    before(function (done) {
        db = mongoose.connect('mongodb://localhost/test_eum', {useNewUrlParser: true, useCreateIndex: true});
        var account = new Account({
            username: '12345',
            password: 'testy'
        });

        account.save(function (error) {
            if (error) console.log('error' + error.message);
            else console.log('no error');
            done();
        });
    });

    after(function (done) {
        mongoose.connection.db.dropDatabase(function () {
            mongoose.connection.close(done);
        });

    });


    it('find a user by username', function (done) {
        Account.findOne({username: '12345'}, function (err, account) {
            account.username.should.eql('12345');
            console.log("   username: ", account.username);
            done();
        });
    });

    it('Add an email to user', function (done) {
        Account.findOne({username: '12345'}, function (err, account) {
            var email = account.addEmail('iamritghimire@gmail.com');
            email.address.should.eql('iamritghimire@gmail.com');
            account.addEmail('mail@ranjitghimire.com.np');
            var emailCount = account.emails.length;
            emailCount.should.eql(2);
            account.emails[0].address.should.eql('iamritghimire@gmail.com');
            var email2 = account.addEmail('iamritghimire@gmail.com');
            email2.should.eql(false);

            account.setPrimaryEmail('mail@ranjitghimire.com.np');
            var email3 = account.getPrimaryEmail();
            email3.should.eql('mail@ranjitghimire.com.np');
            done();
        });
    });


    it('Adding primary email out of added email must cause error.', function (done) {
        Account.findOne({username: '12345'}, function (err, account) {
            var e = 1;
            try {
                e = 2;

                var email = account.setPrimaryEmail('mail@amritghimire.com');
            } catch (p) {
                e = 3;
            }
            e.should.eql(3);
            done();

        });
    });

    it('Check for verification code', function (done) {
        Account.findOne({username: '12345'}, function (err, account) {
            account.sendVerificationToken('iamritghimire@gmail.com', function (email, token) {

                verify({params: {token: token}}, null, function (err) {
                    if(err){
                        throw Error('error');
                    }
                });
                verify({params: {token: '1212'}}, null, function (err) {
                    if(err){
                        done();
                    }else{
                        throw Error('error');
                    }
                });
            });
        });
    });
});
