const { app } = require('../server');
const url = `http://localhost:4000`;
const request = require('supertest')(url);
const { assert } = require('assertthat');

const user = {
    query: `
        mutation {
            createUser(UserInput: {
                username: "robin76", 
                email: "robinguyomar@gmail.com", 
                password: "123abc", 
                agent: true
            }) {
                username
                email
                password
                agent
                date
            }
        }
    `
}

const user2 = {
    query: `
        mutation {
            createUser(UserInput: {
                username: "robin", 
                email: "robinguyomar@gmail.com", 
                password: "123abc", 
                agent: true
            }) {
                username
                email
                password
                agent
                date
            }
        }
    `
}

const login = {
    query: `
        mutation {
            login(Username: "robin76", Password: "123abc")
        }
    `
}

const login2 = {
    query: `
        mutation {
            login(Username: "rob", Password: "123abc")
        }
    `
}

describe('createUser', () => {
    it('Returns the user created', (done) => {
        request.post('/graphql')
            .send(user)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(res, err);
                assert.that(res.body.data.createUser.username).is.ofType('string');
                assert.that(res.body.data.createUser.username).is.equalTo('robin76');
                assert.that(res.body.data.createUser.email).is.ofType('string');
                assert.that(res.body.data.createUser.email).is.equalTo('robinguyomar@gmail.com');
                assert.that(res.body.data.createUser.password).is.ofType('string');
                assert.that(res.body.data.createUser.agent).is.ofType('boolean');
                assert.that(res.body.data.createUser.agent).is.equalTo(true);
                done();
            })
    })
});

describe('createUser already exists', () => {
    it('Returns an error', (done) => {
        request.post('/graphql')
            .send(user2)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(res, err);
                if(res.body.errors[0].message.includes('Username'))
                    assert.that(res.body.errors[0].message).is.equalTo('Username already exists');
                if(res.body.errors[0].message.includes('Email'))
                    assert.that(res.body.errors[0].message).is.equalTo('Email already exists');
                done();
            })
    })
});

describe('Log in', () => {
    it('Returns the user logged', (done) => {
        request.post('/graphql')
            .send(login)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(res, err);
                assert.that(res.body.data.login).is.equalTo("robin76 connected !");
                done();
            })
    })
});

describe('Log in incorrect', () => {
    it('Returns an error', (done) => {
        request.post('/graphql')
            .send(login2)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(res, err);
                if(res.body.errors[0].message.includes('User'))
                    assert.that(res.body.errors[0].message).is.equalTo('User is not found');
                if(res.body.errors[0].message.includes('password'))
                    assert.that(res.body.errors[0].message).is.equalTo('Invalid password');
                done();
            })
    })
});