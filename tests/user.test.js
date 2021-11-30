const app = require('../server');
const url = `http://localhost:4000`;
const request = require('supertest')(url);
const { assert } = require('assertthat');

let cookie;

describe('createUser', () => {
    const user = {
        query: `
        mutation {
            createUser(UserInput: {
                username: "robin76", 
                email: "robinguyomar@gmail.com", 
                password: "123abc", 
                agent: false
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

    it('Returns the user created', (done) => {
        request
            .post('/graphql')
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
                assert.that(res.body.data.createUser.agent).is.equalTo(false);
                done();
            })
    })
});

describe('createUser', () => {
    const userAgent = {
        query: `
        mutation {
            createUser(UserInput: {
                username: "agent76", 
                email: "agent@gmail.com", 
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

    it('Returns the agent created', (done) => {
        request
            .post('/graphql')
            .send(userAgent)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(res, err);
                assert.that(res.body.data.createUser.username).is.ofType('string');
                assert.that(res.body.data.createUser.username).is.equalTo('agent76');
                assert.that(res.body.data.createUser.email).is.ofType('string');
                assert.that(res.body.data.createUser.email).is.equalTo('agent@gmail.com');
                assert.that(res.body.data.createUser.password).is.ofType('string');
                assert.that(res.body.data.createUser.agent).is.ofType('boolean');
                assert.that(res.body.data.createUser.agent).is.equalTo(true);
                done();
            })
    })
});

describe('createUser already exists', () => {
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

    it('Returns an error', (done) => {
        request
            .post('/graphql')
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
    const login = {
        query: `
        mutation {
            login(Username: "robin76", Password: "123abc")
        }
    `
    }

    it('Returns the user logged', (done) => {
        request
            .post('/graphql')
            .send(login)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(res, err);
                cookie = res.headers['set-cookie'];
                assert.that(res.body.data.login).is.equalTo("robin76 connected !");
                done();
            })
    })
});

describe('Log in incorrect', () => {
    const login2 = {
        query: `
        mutation {
            login(Username: "rob", Password: "123abc")
        }
    `
    }

    it('Returns an error', (done) => {
        request
            .post('/graphql')
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

describe('Log out', () => {
    const logout = {
        query: `
        mutation {
            logout
        }  
    `
    }

    it('Returns the user logged out', (done) => {
        request
            .post('/graphql')
            .set('cookie', cookie)
            .send(logout)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(res, err);
                assert.that(res.body.data.logout).is.equalTo("robin76 disconnected !");
                done();
            })
    })
});

describe('Log out incorrect', () => {
    const logout2 = {
        query: `
        mutation {
            logout
        }  
    `
    }

    it('Returns an error', (done) => {
        request
            .post('/graphql')
            .send(logout2)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(res, err);
                if(res.body.errors[0].message.includes('user'))
                    assert.that(res.body.errors[0].message).is.equalTo('No user connected !');
                done();
            })
    })
});
