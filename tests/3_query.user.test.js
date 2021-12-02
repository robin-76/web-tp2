const app = require('../server');
const url = `http://localhost:4000`;
const request = require('supertest')(url);
const { assert } = require('assertthat');

// Cookie for the agent
let cookie;

describe('User query tests', () => {
    describe('createUser', () => {
        it('Returns the user created', (done) => {
            request
                .post('/graphql')
                .send({
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
                })
                .expect(200)
                .end((err, res) => {
                    if(err)
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

        it('Returns the agent created', (done) => {
            request
                .post('/graphql')
                .send({query:`mutation { createUser(UserInput: { username: "agent76", email: "agent@gmail.com", 
                    password: "123abc", agent: true }) { username email password agent date }}`})
                .expect(200)
                .end((err, res) => {
                    if(err)
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

        it('Returns an username already exists error', (done) => {
            request
                .post('/graphql')
                .send({query:`mutation { createUser(UserInput: { username: "robin76", email: "robinguyomar@gmail.com", 
                    password: "123abc", agent: false }) { username email password agent date }}`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    if(res.body.errors[0].message.includes('Username'))
                        assert.that(res.body.errors[0].message).is.equalTo('Username already exists');
                    done();
                })
        })

        it('Returns an email already exists error', (done) => {
            request
                .post('/graphql')
                .send({query:`mutation { createUser(UserInput: { username: "robin", email: "robinguyomar@gmail.com", 
                    password: "123abc", agent: false }) { username email password agent date }}`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    if(res.body.errors[0].message.includes('Email'))
                        assert.that(res.body.errors[0].message).is.equalTo('Email already exists');
                    done();
                })
        })

        it('Returns a validation error', (done) => {
            request
                .post('/graphql')
                .send({query:`mutation { createUser(UserInput: { password: "123abc", agent: false }) { username email 
                    password agent date }}`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    if(res.body.errors[0].message.includes('validation'))
                        assert.that(res.body.errors[0].message).is.startingWith('User validation failed:');
                    done();
                })
        })
    });

    describe('Log in', () => {
        it('Returns the agent logged', (done) => {
            request
                .post('/graphql')
                .send({query:`mutation { login(Username: "agent76", Password: "123abc") }`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    cookie = res.headers['set-cookie'];
                    assert.that(res.body.data.login).is.equalTo("agent76 connected !");
                    done();
                })
        })

        it('Returns a not found user error', (done) => {
            request
                .post('/graphql')
                .send({query:`mutation { login(Username: "rob", Password: "123abc") }`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    if(res.body.errors[0].message.includes('User'))
                        assert.that(res.body.errors[0].message).is.equalTo('User is not found');
                    done();
                })
        })

        it('Returns an invalid password error', (done) => {
            request
                .post('/graphql')
                .send({query:`mutation { login(Username: "robin76", Password: "") }`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    if(res.body.errors[0].message.includes('password'))
                        assert.that(res.body.errors[0].message).is.equalTo('Invalid password');
                    done();
                })
        })

        it('Returns an illegal arguments error', (done) => {
            request
                .post('/graphql')
                .send({query:`mutation { login(Username: "robin76") }`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    if(res.body.errors[0].message.includes('arguments'))
                        assert.that(res.body.errors[0].message).is.equalTo('Illegal arguments: undefined, string');
                    done();
                })
        })
    });

    describe('Get all the users', () => {

        it('Returns all the users', (done) => {
            request
                .post('/graphql')
                .set('cookie', cookie)
                .send({query:`query { getAllUsers { username email password agent date }}`})
                .expect(200)
                .end((err, res) => {
                    if(err)
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
                .send({query:`query { getAllUsers { username email password agent date }}`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    if(res.body.errors[0].message)
                        assert.that(res.body.errors[0].message).is.equalTo('You have to login first !');
                    done();
                })
        })
    });

    describe('Log out', () => {
        it('Returns the agent logged out', (done) => {
            request
                .post('/graphql')
                .set('cookie', cookie)
                .send({query:`mutation { logout } `})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    assert.that(res.body.data.logout).is.equalTo("agent76 disconnected !");
                    done();
                })
        })

        it('Returns a connection error', (done) => {
            request
                .post('/graphql')
                .send({query:`mutation { logout }`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    if(res.body.errors[0].message)
                        assert.that(res.body.errors[0].message).is.equalTo('No user connected !');
                    done();
                })
        })
    });
});