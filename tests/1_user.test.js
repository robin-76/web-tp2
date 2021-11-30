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

    const user2 = {
        query: `
        mutation {
            createUser(UserInput: {
                username: "robin", 
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

    it('Returns an already exists error', (done) => {
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

    const user3 = {
        query: `
        mutation {
            createUser(UserInput: {
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

    it('Returns a validation error', (done) => {
        request
            .post('/graphql')
            .send(user3)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(res, err);
                if(res.body.errors[0].message.includes('Username'))
                    assert.that(res.body.errors[0].message).is.equalTo('Username already exists');
                if(res.body.errors[0].message.includes('Email'))
                    assert.that(res.body.errors[0].message).is.equalTo('Email already exists');
                if(res.body.errors[0].message.includes('validation'))
                    assert.that(res.body.errors[0].message).is.startingWith('User validation failed:');
                done();
            })
    })
});

describe('Log in', () => {
    const login = {
        query: `
        mutation {
            login(Username: "agent76", Password: "123abc")
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
                assert.that(res.body.data.login).is.equalTo("agent76 connected !");
                done();
            })
    })

    const login2 = {
        query: `
        mutation {
            login(Username: "rob", Password: "123abc")
        }
    `
    }

    it('Returns a not found user error', (done) => {
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
                if(res.body.errors[0].message.includes('arguments'))
                    assert.that(res.body.errors[0].message).is.equalTo('Illegal arguments: undefined, string');
                done();
            })
    })

    const login3 = {
        query: `
        mutation {
            login(Username: "robin76", Password: "")
        }
    `
    }

    it('Returns an invalid password error', (done) => {
        request
            .post('/graphql')
            .send(login3)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(res, err);
                if(res.body.errors[0].message.includes('User'))
                    assert.that(res.body.errors[0].message).is.equalTo('User is not found');
                if(res.body.errors[0].message.includes('password'))
                    assert.that(res.body.errors[0].message).is.equalTo('Invalid password');
                if(res.body.errors[0].message.includes('arguments'))
                    assert.that(res.body.errors[0].message).is.equalTo('Illegal arguments: undefined, string');
                done();
            })
    })

    const login4 = {
        query: `
        mutation {
            login(Username: "robin76")
        }
    `
    }

    it('Returns an illegal arguments error', (done) => {
        request
            .post('/graphql')
            .send(login4)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(res, err);
                if(res.body.errors[0].message.includes('User'))
                    assert.that(res.body.errors[0].message).is.equalTo('User is not found');
                if(res.body.errors[0].message.includes('password'))
                    assert.that(res.body.errors[0].message).is.equalTo('Invalid password');
                if(res.body.errors[0].message.includes('arguments'))
                    assert.that(res.body.errors[0].message).is.equalTo('Illegal arguments: undefined, string');
                done();
            })
    })
});

describe('Get all the users', () => {
    const allUsers = {
        query: `
        query {
            getAllUsers {
                username
                email
                password
                agent
                date
            }
        }
    `
    }

    it('Returns all the users', (done) => {
        request
            .post('/graphql')
            .set('cookie', cookie)
            .send(allUsers)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(res, err);
                assert.that(res.body.data.getAllUsers[0].username).is.equalTo("robin76");
                assert.that(res.body.data.getAllUsers[0].email).is.equalTo("robinguyomar@gmail.com");
                assert.that(res.body.data.getAllUsers[0].agent).is.equalTo(false);

                assert.that(res.body.data.getAllUsers[1].username).is.equalTo("agent76");
                assert.that(res.body.data.getAllUsers[1].email).is.equalTo("agent@gmail.com");
                assert.that(res.body.data.getAllUsers[1].agent).is.equalTo(true);
                done();
            })
    })

    it('Returns a login error', (done) => {
        request
            .post('/graphql')
            .send(allUsers)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(res, err);
                if(res.body.errors[0].message)
                    assert.that(res.body.errors[0].message).is.equalTo('You have to login first !');
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
                assert.that(res.body.data.logout).is.equalTo("agent76 disconnected !");
                done();
            })
    })

    it('Returns a connection error', (done) => {
        request
            .post('/graphql')
            .send(logout)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(res, err);
                if(res.body.errors[0].message)
                    assert.that(res.body.errors[0].message).is.equalTo('No user connected !');
                done();
            })
    })
});
