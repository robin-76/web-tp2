const app = require('../server');
const url = `http://localhost:4000`;
const request = require('supertest')(url);
const { assert } = require('assertthat');

const ad = {
    query: `
        mutation {
            createAd(AdInput: {
                author: "Robin", 
                title: "Ceci est une annonce", 
                type: Sell, 
                publicationStatus: Published, 
                goodStatus: Rented, 
                description: "Ceci est une description", 
                price: 200, 
                firstDate: "2021-11-25", 
                secondDate: "2021-11-30", 
                photos: ["test_ad1.jpeg", "test_ad2.jpeg"]
            }) {
                id
                author
                title
                type
                publicationStatus
                goodStatus
                description
                price
                firstDate
                secondDate
                photos
            }
        }
    `
}

const ad2 = {
    query: `
        mutation {
            createAd(AdInput: {
                author: "Maxence", 
                title: "Deuxième annonce", 
                type: Location, 
                publicationStatus: Published, 
                goodStatus: Rented, 
                description: "Deuxième description", 
                price: 100, 
                firstDate: "2021-11-26", 
                secondDate: "2021-11-29", 
            }) {
                id
                author
                title
                type
                publicationStatus
                goodStatus
                description
                price
                firstDate
                secondDate
                photos
            }
        }
    `
}

let cookie;

describe('Log in an agent to manipulate the ads', () => {
    const login = {
        query: `
        mutation {
            login(Username: "agent76", Password: "123abc")
        }
    `
    }

    it('Returns the agent logged', (done) => {
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
});

describe('createAd', () => {
    it('Returns the ad created', (done) => {
        request
            .post('/graphql')
            .set('cookie', cookie)
            .send(ad)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(res, err);
                assert.that(res.body.data.createAd.author).is.ofType('string');
                assert.that(res.body.data.createAd.author).is.equalTo('Robin');
                assert.that(res.body.data.createAd.title).is.ofType('string');
                assert.that(res.body.data.createAd.title).is.equalTo('Ceci est une annonce');
                assert.that(res.body.data.createAd.type).is.ofType('string');
                assert.that(res.body.data.createAd.type).is.equalTo('Sell');
                assert.that(res.body.data.createAd.publicationStatus).is.ofType('string');
                assert.that(res.body.data.createAd.publicationStatus).is.equalTo('Published');
                assert.that(res.body.data.createAd.goodStatus).is.ofType('string');
                assert.that(res.body.data.createAd.goodStatus).is.equalTo('Rented');
                assert.that(res.body.data.createAd.description).is.ofType('string');
                assert.that(res.body.data.createAd.description).is.equalTo('Ceci est une description');
                assert.that(res.body.data.createAd.price).is.ofType('number');
                assert.that(res.body.data.createAd.price).is.equalTo(200);
                assert.that(res.body.data.createAd.firstDate).is.ofType('string');
                assert.that(res.body.data.createAd.firstDate).is.equalTo('2021-11-25T00:00:00.000Z');
                assert.that(res.body.data.createAd.secondDate).is.ofType('string');
                assert.that(res.body.data.createAd.secondDate).is.equalTo('2021-11-30T00:00:00.000Z');
                assert.that(res.body.data.createAd.photos).is.ofType('array');
                assert.that(res.body.data.createAd.photos[0]).is.equalTo('test_ad1.jpeg');
                assert.that(res.body.data.createAd.photos[1]).is.equalTo('test_ad2.jpeg');
                done();
            })
    })

    it('Returns the second ad created', (done) => {
        request
            .post('/graphql')
            .set('cookie', cookie)
            .send(ad2)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(res, err);
                assert.that(res.body.data.createAd.author).is.ofType('string');
                assert.that(res.body.data.createAd.author).is.equalTo('Maxence');
                assert.that(res.body.data.createAd.title).is.ofType('string');
                assert.that(res.body.data.createAd.title).is.equalTo('Deuxième annonce');
                assert.that(res.body.data.createAd.type).is.ofType('string');
                assert.that(res.body.data.createAd.type).is.equalTo('Location');
                assert.that(res.body.data.createAd.publicationStatus).is.ofType('string');
                assert.that(res.body.data.createAd.publicationStatus).is.equalTo('Published');
                assert.that(res.body.data.createAd.goodStatus).is.ofType('string');
                assert.that(res.body.data.createAd.goodStatus).is.equalTo('Rented');
                assert.that(res.body.data.createAd.description).is.ofType('string');
                assert.that(res.body.data.createAd.description).is.equalTo('Deuxième description');
                assert.that(res.body.data.createAd.price).is.ofType('number');
                assert.that(res.body.data.createAd.price).is.equalTo(100);
                assert.that(res.body.data.createAd.firstDate).is.ofType('string');
                assert.that(res.body.data.createAd.firstDate).is.equalTo('2021-11-26T00:00:00.000Z');
                assert.that(res.body.data.createAd.secondDate).is.ofType('string');
                assert.that(res.body.data.createAd.secondDate).is.equalTo('2021-11-29T00:00:00.000Z');
                done();
            })
    })

    it('Returns a login error', (done) => {
        request
            .post('/graphql')
            .send(ad)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(res, err);
                // When the user is not an agent
                if(res.body.errors[0].message.includes('Unauthorized'))
                    assert.that(res.body.errors[0].message).is.equalTo('Unauthorized !');
                // When the user is not logged in
                if(res.body.errors[0].message.includes('login'))
                    assert.that(res.body.errors[0].message).is.equalTo('You have to login first !');
                // When the ad is not 100% correct
                if(res.body.errors[0].message.includes('validation'))
                    assert.that(res.body.errors[0].message).is.startingWith('Ad validation failed:');
                done();
            })
    })

    const wrongAd = {
        query: `
        mutation {
            createAd(AdInput: {
                author: "Robin", 
                type: Sell, 
                publicationStatus: Published, 
                goodStatus: Rented, 
                description: "Ceci est une description", 
                price: 200, 
                firstDate: "2021-11-25", 
                secondDate: "2021-11-30", 
                photos: ["test_ad1.jpeg", "test_ad2.jpeg"]
            }) {
                id
                author
                title
                type
                publicationStatus
                goodStatus
                description
                price
                firstDate
                secondDate
                photos
            }
        }
    `
    }

    it('Returns a validation error', (done) => {
        request
            .post('/graphql')
            .send(wrongAd)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(res, err);
                // When the user is not an agent
                if(res.body.errors[0].message.includes('Unauthorized'))
                    assert.that(res.body.errors[0].message).is.equalTo('Unauthorized !');
                // When the user is not logged in
                if(res.body.errors[0].message.includes('login'))
                    assert.that(res.body.errors[0].message).is.equalTo('You have to login first !');
                // When the ad is not 100% correct
                if(res.body.errors[0].message.includes('validation'))
                    assert.that(res.body.errors[0].message).is.startingWith('Ad validation failed:');
                done();
            })
    })
});

describe('Get all the ads', () => {
    const allAds = {
        query: `
        query {
            getAllAds {
                id
                author
                title
                type
                publicationStatus
                goodStatus
                description
                price
                firstDate
                secondDate
                photos
                comments
            }
        }
    `
    }

    it('Returns all the ads', (done) => {
        request
            .post('/graphql')
            .set('cookie', cookie)
            .send(allAds)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(res, err);
                assert.that(res.body.data.getAllAds[0].author).is.ofType('string');
                assert.that(res.body.data.getAllAds[0].author).is.equalTo('Robin');
                assert.that(res.body.data.getAllAds[0].title).is.ofType('string');
                assert.that(res.body.data.getAllAds[0].title).is.equalTo('Ceci est une annonce');
                assert.that(res.body.data.getAllAds[0].type).is.ofType('string');
                assert.that(res.body.data.getAllAds[0].type).is.equalTo('Sell');
                assert.that(res.body.data.getAllAds[0].publicationStatus).is.ofType('string');
                assert.that(res.body.data.getAllAds[0].publicationStatus).is.equalTo('Published');
                assert.that(res.body.data.getAllAds[0].goodStatus).is.ofType('string');
                assert.that(res.body.data.getAllAds[0].goodStatus).is.equalTo('Rented');
                assert.that(res.body.data.getAllAds[0].description).is.ofType('string');
                assert.that(res.body.data.getAllAds[0].description).is.equalTo('Ceci est une description');
                assert.that(res.body.data.getAllAds[0].price).is.ofType('number');
                assert.that(res.body.data.getAllAds[0].price).is.equalTo(200);
                assert.that(res.body.data.getAllAds[0].firstDate).is.ofType('string');
                assert.that(res.body.data.getAllAds[0].firstDate).is.equalTo('2021-11-25T00:00:00.000Z');
                assert.that(res.body.data.getAllAds[0].secondDate).is.ofType('string');
                assert.that(res.body.data.getAllAds[0].secondDate).is.equalTo('2021-11-30T00:00:00.000Z');
                assert.that(res.body.data.getAllAds[0].photos).is.ofType('array');
                assert.that(res.body.data.getAllAds[0].photos[0]).is.equalTo('test_ad1.jpeg');
                assert.that(res.body.data.getAllAds[0].photos[1]).is.equalTo('test_ad2.jpeg');
                assert.that(res.body.data.getAllAds[0].comments).is.empty();

                assert.that(res.body.data.getAllAds[1].author).is.ofType('string');
                assert.that(res.body.data.getAllAds[1].author).is.equalTo('Maxence');
                assert.that(res.body.data.getAllAds[1].title).is.ofType('string');
                assert.that(res.body.data.getAllAds[1].title).is.equalTo('Deuxième annonce');
                assert.that(res.body.data.getAllAds[1].type).is.ofType('string');
                assert.that(res.body.data.getAllAds[1].type).is.equalTo('Location');
                assert.that(res.body.data.getAllAds[1].publicationStatus).is.ofType('string');
                assert.that(res.body.data.getAllAds[1].publicationStatus).is.equalTo('Published');
                assert.that(res.body.data.getAllAds[1].goodStatus).is.ofType('string');
                assert.that(res.body.data.getAllAds[1].goodStatus).is.equalTo('Rented');
                assert.that(res.body.data.getAllAds[1].description).is.ofType('string');
                assert.that(res.body.data.getAllAds[1].description).is.equalTo('Deuxième description');
                assert.that(res.body.data.getAllAds[1].price).is.ofType('number');
                assert.that(res.body.data.getAllAds[1].price).is.equalTo(100);
                assert.that(res.body.data.getAllAds[1].firstDate).is.ofType('string');
                assert.that(res.body.data.getAllAds[1].firstDate).is.equalTo('2021-11-26T00:00:00.000Z');
                assert.that(res.body.data.getAllAds[1].secondDate).is.ofType('string');
                assert.that(res.body.data.getAllAds[1].secondDate).is.equalTo('2021-11-29T00:00:00.000Z');
                assert.that(res.body.data.getAllAds[1].photos).is.ofType('array');
                assert.that(res.body.data.getAllAds[1].photos).is.empty();
                assert.that(res.body.data.getAllAds[1].comments).is.empty();
                done();
            })
    })
});








let cookie2;

describe('Log out the agent', () => {
    const logout = {
        query: `
        mutation {
            logout
        }  
    `
    }

    it('Returns the agent logged out', (done) => {
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
});

describe('Log in an user to manipulate the ads', () => {
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
                cookie2 = res.headers['set-cookie'];
                assert.that(res.body.data.login).is.equalTo("robin76 connected !");
                done();
            })
    })
});

describe('createAd with an user', () => {
    it('Returns an unauthorized error', (done) => {
        request
            .post('/graphql')
            .set('cookie', cookie2)
            .send(ad)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(res, err);
                // When the user is not an agent
                if(res.body.errors[0].message.includes('Unauthorized'))
                    assert.that(res.body.errors[0].message).is.equalTo('Unauthorized !');
                // When the user is not logged in
                if(res.body.errors[0].message.includes('login'))
                    assert.that(res.body.errors[0].message).is.equalTo('You have to login first !');
                // When the ad is not 100% correct
                if(res.body.errors[0].message.includes('validation'))
                    assert.that(res.body.errors[0].message).is.startingWith('Ad validation failed:');
                done();
            })
    })
});

