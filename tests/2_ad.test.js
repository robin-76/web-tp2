const app = require('../server');
const url = `http://localhost:4000`;
const request = require('supertest')(url);
const { assert } = require('assertthat');

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

    it('Returns a login error', (done) => {
        request
            .post('/graphql')
            .send(ad)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(res, err);
                if(res.body.errors[0].message.includes('login'))
                    assert.that(res.body.errors[0].message).is.equalTo('You have to login first !');
                if(res.body.errors[0].message.includes('validation'))
                    assert.that(res.body.errors[0].message).is.startingWith('Ad validation failed:');
                done();
            })
    })

    const ad2 = {
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
            .send(ad2)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(res, err);
                if(res.body.errors[0].message.includes('login'))
                    assert.that(res.body.errors[0].message).is.equalTo('You have to login first !');
                if(res.body.errors[0].message.includes('validation'))
                    assert.that(res.body.errors[0].message).is.startingWith('Ad validation failed:');
                done();
            })
    })
});