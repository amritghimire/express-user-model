"use strict";

var should = require("should");
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EUM = require('../index');

// A single schema+model used across all unit tests (no DB connection required).
// Methods that call this.save() are tested only for their error paths (which throw
// before reaching save()), keeping these tests fully offline.
const UnitSchema = new Schema({});
UnitSchema.plugin(EUM);
const UnitAccount = mongoose.model('unit_account', UnitSchema);

// ---------------------------------------------------------------------------
// Basic Plugin
// ---------------------------------------------------------------------------
describe('Basic Plugin', function () {

    describe('full_name()', function () {

        it('returns the full name when both first and last name are set', function () {
            var account = new UnitAccount({ username: 'johndoe', first_name: 'John', last_name: 'Doe' });
            account.full_name().should.eql('John Doe');
        });

        it('returns first name only when only first name is set', function () {
            var account = new UnitAccount({ username: 'john', first_name: 'John' });
            account.full_name().should.eql('John');
        });

        it('returns last name only when only last name is set', function () {
            var account = new UnitAccount({ username: 'doe', last_name: 'Doe' });
            account.full_name().should.eql('Doe');
        });

        it('returns an empty string when neither first nor last name is set', function () {
            var account = new UnitAccount({ username: 'noname' });
            account.full_name().should.eql('');
        });
    });

    describe('custom usernameField option', function () {

        it('uses the provided custom field as the username field', function () {
            const CustomSchema = new Schema({});
            EUM.Basic(CustomSchema, { usernameField: 'handle' });
            const CustomModel = mongoose.model('custom_basic_account', CustomSchema);
            var account = new CustomModel({ handle: 'myhandle' });
            account.handle.should.eql('myhandle');
        });

        it('does not add the default username field when a custom one is given', function () {
            const CustomSchema2 = new Schema({});
            EUM.Basic(CustomSchema2, { usernameField: 'nickname' });
            const CustomModel2 = mongoose.model('custom_basic_account2', CustomSchema2);
            var account = new CustomModel2({ nickname: 'nick' });
            should.not.exist(account.username);
        });
    });
});

// ---------------------------------------------------------------------------
// Email Plugin
// ---------------------------------------------------------------------------
describe('Email Plugin', function () {

    describe('is_active field', function () {

        it('defaults to true on a new document', function () {
            var account = new UnitAccount({ username: 'activeuser' });
            account.is_active.should.eql(true);
        });
    });

    describe('addEmail()', function () {

        it('adds a new email and returns the email document', function () {
            var account = new UnitAccount({ username: 'addemail1' });
            var email = account.addEmail('test@example.com');
            email.address.should.eql('test@example.com');
            email.verified.should.eql(false);
            should.exist(email.token);
        });

        it('assigns a unique token to the new email', function () {
            var account = new UnitAccount({ username: 'addemail2' });
            account.addEmail('a@example.com');
            account.addEmail('b@example.com');
            var tokenA = account.getEmail('a@example.com').token;
            var tokenB = account.getEmail('b@example.com').token;
            tokenA.should.not.eql(tokenB);
        });

        it('returns false when the email already exists', function () {
            var account = new UnitAccount({ username: 'addemail3' });
            account.addEmail('dup@example.com');
            var result = account.addEmail('dup@example.com');
            result.should.eql(false);
        });

        it('can add multiple different emails', function () {
            var account = new UnitAccount({ username: 'addemail4' });
            account.addEmail('first@example.com');
            account.addEmail('second@example.com');
            account.emails.length.should.eql(2);
        });
    });

    describe('getEmail()', function () {

        it('returns the email subdocument when the address exists', function () {
            var account = new UnitAccount({ username: 'getemail1' });
            account.addEmail('found@example.com');
            var email = account.getEmail('found@example.com');
            should.exist(email);
            email.address.should.eql('found@example.com');
        });

        it('returns undefined when the address does not exist', function () {
            var account = new UnitAccount({ username: 'getemail2' });
            var email = account.getEmail('missing@example.com');
            should.not.exist(email);
        });
    });

    describe('getPrimaryEmail()', function () {

        it('returns false when no emails have been added', function () {
            var account = new UnitAccount({ username: 'primary1' });
            account.getPrimaryEmail().should.eql(false);
        });

        it('falls back to the first email in the list when no primary is set', function () {
            var account = new UnitAccount({ username: 'primary2' });
            account.addEmail('first@example.com');
            account.addEmail('second@example.com');
            account.getPrimaryEmail().should.eql('first@example.com');
        });

        it('returns the primary email address when one is explicitly set', function () {
            var account = new UnitAccount({ username: 'primary3' });
            account['email'] = 'primary@example.com';
            account.getPrimaryEmail().should.eql('primary@example.com');
        });
    });

    describe('sendVerificationToken()', function () {

        it('throws when the email address does not exist on the account', async function () {
            var account = new UnitAccount({ username: 'svt1' });
            try {
                await account.sendVerificationToken('noone@example.com');
                throw new Error('Expected error was not thrown');
            } catch (err) {
                err.message.should.eql('Email not found');
            }
        });

        it('returns null when the email is already verified', async function () {
            var account = new UnitAccount({ username: 'svt2' });
            account.addEmail('verified@example.com');
            account.getEmail('verified@example.com').verified = true;
            var result = await account.sendVerificationToken('verified@example.com');
            should.not.exist(result);
        });

        it('returns an object with address and token for an unverified email', async function () {
            var account = new UnitAccount({ username: 'svt3' });
            account.addEmail('unverified@example.com');
            var result = await account.sendVerificationToken('unverified@example.com');
            result.address.should.eql('unverified@example.com');
            should.exist(result.token);
        });

        it('throws when the email entry has no token', async function () {
            var account = new UnitAccount({ username: 'svt4' });
            // Push a subdocument without a token to simulate the edge case
            account.emails.push({ address: 'notoken@example.com', verified: false });
            try {
                await account.sendVerificationToken('notoken@example.com');
                throw new Error('Expected error was not thrown');
            } catch (err) {
                err.message.should.eql('Token not available');
            }
        });

        it('accepts an email subdocument object instead of a string address', async function () {
            var account = new UnitAccount({ username: 'svt5' });
            account.addEmail('docarg@example.com');
            var emailDoc = account.getEmail('docarg@example.com');
            var result = await account.sendVerificationToken(emailDoc);
            result.address.should.eql('docarg@example.com');
            should.exist(result.token);
        });
    });

    describe('setPrimaryEmail()', function () {

        it('throws when the given email has not been added to the account', async function () {
            var account = new UnitAccount({ username: 'spe1' });
            try {
                await account.setPrimaryEmail('ghost@example.com');
                throw new Error('Expected error was not thrown');
            } catch (err) {
                err.message.should.eql('Email does not exist');
            }
        });
    });
});

// ---------------------------------------------------------------------------
// Verify Middleware
// ---------------------------------------------------------------------------
describe('Verify Middleware', function () {

    it('throws when no model is provided', function () {
        try {
            EUM.Verify(undefined);
            throw new Error('Expected error was not thrown');
        } catch (err) {
            err.message.should.eql('Model is not provided.');
        }
    });

    it('returns a middleware function when a valid model is provided', function () {
        var middleware = EUM.Verify(UnitAccount);
        middleware.should.be.a.Function();
    });
});
