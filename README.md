## Express User Model
[![Build Status](https://travis-ci.org/amritghimire/express-user-model.svg?branch=master)](https://travis-ci.org/amritghimire/express-user-model) 
[![Coverage Status](https://coveralls.io/repos/github/amritghimire/express-user-model/badge.svg?branch=master)](https://coveralls.io/github/amritghimire/express-user-model?branch=master)
[![npm version](https://badge.fury.io/js/express-user-model.svg)](https://badge.fury.io/js/express-user-model)

This is a library to provide a user backbone with basic requirements to
start with. It assumes you are using mongoose with the driver for Mongoose.
This plugin will add following fields to your User Model.
- username
- email
- first_name
- last_name

For password storage we recommend [passport-local-mongoose](https://github.com/saintedlama/passport-local-mongoose) with
[passport](http://passportjs.org) though you are free to use any required.


## Installation
This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```sh
$ npm install express-user-model
```

## Usage

Create a user schema first and use the plugin as below.
```js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EUM = require('express-user-model');

const UserSchema = new Schema({});
UserSchema.plugin(EUM);

```

Optionally, To add authentication and password fields, you can use passport-local as below.

```js
const passportLocalMongoose = require('passport-local-mongoose');
UserSchema.plugin(passportLocalMongoose);
```

If you want to use Email verification and email management only , you can use the following code instead of whole EUM plugin as:
```js
UserSchema.plugin(EUM.Email);
```
For basic features of first_name, last_name and username only, you can use as:
```js
UserSchema.plugin(EUM.Basic);
```


## Motivation

Coming from Django background, I thought of bringing all user related features to one place. 

## API Reference
### Options:

You can pass options to the plugin as 
```js
UserSchema.plugin(EUM.Basic,options);
```
#### Main options:
- **usernameField**:-  Default username field to create ,Default value is *username*
- **usernameUnique**:- Default value: *true*
 
 Let us consider following scenario.
 ```js
var user = new User({username: '12345'});
```

### Basic:
Fields: 
```js
user.username = '12345'; 
user.first_name = 'Amrit';
user.last_name = 'Ghimire';
```
Methods:
```js
user.full_name() // Returns the full name of user account (Amrit Ghimire)
```

### Email 
Fields:
```js
user.emails = [{address:'',verified:false,token:''}]; // An array of subdocument each with address,verified and token
user.email = '' // To store primary email
```

***Methods***:

**Add email**: 
```js
user.addEmail(emailToAdd); // Add an email to user account
user.save(); 
```
Returns *false* if email already exists else return the email sub-document.

**GetEmail**:
```js
var email = user.getEmail(email) // Get email object
// { address: ,verified: , token: }
```
Return email objects if exists

**setPrimaryEmail**
```js
user.setPrimaryEmail(email); // Set email as primary key 
```
Sets email as primary email and it will throw an error if the email is not in users account.
Will return new primary email otherwise.

**getPrimaryEmail**
```js
user.getPrimaryEmail(); // Will return primary Email 
``` 
Primary key will be either the first email or the email set as primary key exclusively. Will return false if there is no primary key.

**sendVerificationToken**
```js
user.sendVerificationToken(email, function (email, token) {
   console.log(email, 'Has token ', token, 'associated with it.') 
   // Replace this part with real email sending function. You can use any library to send email.
});
``` 
The call back function will be responsible for sending the token. The call back will receive parameter in one of these 3 formats.
- *email, token* : In successful scenario
- *null, null* : If email is already verified. 
- *email, null* : If email is not found or token is not found.

For verification of the token, use the middleware as: 
```js
app.get('verify/:token',EUM.Verify(User),function (req, res) {
                                           res.send('hello world');
});
```
Verify middleware is passed with the User Model. If the verification code cause some error, standard error is raised.

## Tests

For development purpose, you can clone this repository and run test with following commands.
```sh
make test
```
You can view `test.js` file under `test` directory for some example usage of the library.

## Contributors

All bugs, feature requests, pull requests, feedback, etc., are welcome. [Create an issue](https://github.com/amritghimire/express-user-model/issues).

## License

This library is licensed under [MIT License](https://github.com/amritghimire/express-user-model/blob/master/LICENSE)