const app = require('../server');
const url = `http://localhost:4000`;
const request = require('supertest')(url);
const { assert } = require('assertthat');

// Cookie for the agent
let cookie;
// Cookie for the user
let cookie2;
// Id of the first ad created
let id;
// Id of the second ad created (without comments)
let id2;

describe('Ad query tests', () => {
    describe('Log in an agent to manipulate the ads', () => {
        it('Returns the agent logged', (done) => {
            request
                .post('/graphql')
                .send({query:`mutation {login(Username: "agent76", Password: "123abc")}`})
                .expect(200)
                .end((err, res) => {
                    if(err)
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
                .send({query:`mutation { createAd(AdInput: { author: "Robin", title: "Ceci est une annonce", type: Sell, 
                    publicationStatus: Published, goodStatus: Rented, description: "Ceci est une description", price: 200, 
                    firstDate: "2021-11-25", secondDate: "2021-11-30", photos: ["test_ad1.jpeg", "test_ad2.jpeg"] }) { 
                    id author title type publicationStatus goodStatus description price firstDate secondDate photos }}`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    id = res.body.data.createAd.id;
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
                .send({query:`mutation { createAd(AdInput: { author: "Maxence", title: "Deuxième annonce", type: Location, 
                    publicationStatus: Published, goodStatus: Rented, description: "Deuxième description", price: 100, 
                    firstDate: "2021-11-26", secondDate: "2021-11-29" }) { id author title type publicationStatus goodStatus 
                    description price firstDate secondDate photos }}`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    id2 = res.body.data.createAd.id;
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
                .send({query:`mutation { createAd(AdInput: { author: "Robin", title: "Ceci est une annonce", type: Sell, 
                    publicationStatus: Published, goodStatus: Rented, description: "Ceci est une description", price: 200, 
                    firstDate: "2021-11-25", secondDate: "2021-11-30", photos: ["test_ad1.jpeg", "test_ad2.jpeg"] }) { 
                    id author title type publicationStatus goodStatus description price firstDate secondDate photos }}`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    // When the user is not logged in
                    if(res.body.errors[0].message.includes('login'))
                        assert.that(res.body.errors[0].message).is.equalTo('You have to login first !');
                    done();
                })
        })

        it('Returns a validation error', (done) => {
            request
                .post('/graphql')
                .send({query:`mutation { createAd(AdInput: { author: "Robin", type: Sell, publicationStatus: Published, 
                    goodStatus: Rented, description: "Ceci est une description", price: 200, firstDate: "2021-11-25", 
                    secondDate: "2021-11-30", photos: ["test_ad1.jpeg", "test_ad2.jpeg"] }) { id author title type
                    publicationStatus goodStatus description price firstDate secondDate photos }}`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    // When the ad is not 100% correct
                    if(res.body.errors[0].message.includes('validation'))
                        assert.that(res.body.errors[0].message).is.startingWith('Ad validation failed:');
                    done();
                })
        })
    });

    describe('createComment', () => {
        it('Returns the comment created', (done) => {
            request
                .post('/graphql')
                .set('cookie', cookie)
                .send({query:` mutation { createComment(adId: "${id}", CommentInput: { author: "Robin", text: "Commentaire ahah", 
                    agent: true }) { id author text agent date }}`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    assert.that(res.body.data.createComment.author).is.ofType('string');
                    assert.that(res.body.data.createComment.author).is.equalTo('Robin');
                    assert.that(res.body.data.createComment.text).is.ofType('string');
                    assert.that(res.body.data.createComment.text).is.equalTo('Commentaire ahah');
                    assert.that(res.body.data.createComment.agent).is.ofType('boolean');
                    assert.that(res.body.data.createComment.agent).is.equalTo(true);
                    assert.that(res.body.data.createComment.date).is.ofType('string');
                    done();
                })
        })

        it('Returns a login error', (done) => {
            request
                .post('/graphql')
                .send({query:`mutation { createComment(adId: "${id}", CommentInput: { author: "Robin", text: "Commentaire ahah", 
                    agent: true }) { id author text agent date }}`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    // When the user is not logged in
                    if(res.body.errors[0].message.includes('login'))
                        assert.that(res.body.errors[0].message).is.equalTo('You have to login first !');
                    done();
                })
        })

        it('Returns an invalid ID error', (done) => {
            request
                .post('/graphql')
                .set('cookie', cookie)
                .send({query:`mutation { createComment(adId: "00a0a00000000a0a00aa00a0", CommentInput: { author: "Robin", 
                    text: "Commentaire ahah", agent: true }) { id author text agent date }}`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    if(res.body.errors[0].message.includes('Invalid'))
                        assert.that(res.body.errors[0].message).is.equalTo('Invalid ID !');
                    done();
                })
        })
    });

    describe('Get all the ads', () => {
        it('Returns all the ads', (done) => {
            request
                .post('/graphql')
                .send({query:`query { getAllAds { id author title type publicationStatus goodStatus description price
                    firstDate secondDate photos comments }}`})
                .expect(200)
                .end((err, res) => {
                    if(err)
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

    describe('Get all ad with a price filter', () => {
        it('Returns all the ad between the min and max of the price filter', (done) => {
            request
                .post('/graphql')
                .send({query:`query { getPriceFilterAds(min:50, max:150) { id author title type publicationStatus goodStatus
                    description price firstDate secondDate photos comments }}`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    assert.that(res.body.data.getPriceFilterAds[0].author).is.ofType('string');
                    assert.that(res.body.data.getPriceFilterAds[0].author).is.equalTo('Maxence');
                    assert.that(res.body.data.getPriceFilterAds[0].title).is.ofType('string');
                    assert.that(res.body.data.getPriceFilterAds[0].title).is.equalTo('Deuxième annonce');
                    assert.that(res.body.data.getPriceFilterAds[0].type).is.ofType('string');
                    assert.that(res.body.data.getPriceFilterAds[0].type).is.equalTo('Location');
                    assert.that(res.body.data.getPriceFilterAds[0].publicationStatus).is.ofType('string');
                    assert.that(res.body.data.getPriceFilterAds[0].publicationStatus).is.equalTo('Published');
                    assert.that(res.body.data.getPriceFilterAds[0].goodStatus).is.ofType('string');
                    assert.that(res.body.data.getPriceFilterAds[0].goodStatus).is.equalTo('Rented');
                    assert.that(res.body.data.getPriceFilterAds[0].description).is.ofType('string');
                    assert.that(res.body.data.getPriceFilterAds[0].description).is.equalTo('Deuxième description');
                    assert.that(res.body.data.getPriceFilterAds[0].price).is.ofType('number');
                    assert.that(res.body.data.getPriceFilterAds[0].price).is.equalTo(100);
                    assert.that(res.body.data.getPriceFilterAds[0].firstDate).is.ofType('string');
                    assert.that(res.body.data.getPriceFilterAds[0].firstDate).is.equalTo('2021-11-26T00:00:00.000Z');
                    assert.that(res.body.data.getPriceFilterAds[0].secondDate).is.ofType('string');
                    assert.that(res.body.data.getPriceFilterAds[0].secondDate).is.equalTo('2021-11-29T00:00:00.000Z');
                    assert.that(res.body.data.getPriceFilterAds[0].photos).is.ofType('array');
                    assert.that(res.body.data.getPriceFilterAds[0].photos).is.empty();
                    assert.that(res.body.data.getPriceFilterAds[0].comments).is.empty();
                    done();
                })
        })
    });

    describe('Get a specific ad with id', () => {
        it('Returns the ad', (done) => {
            request
                .post('/graphql')
                .send({query:`query { getAd(id : "${id}") { author title type publicationStatus goodStatus description
                    price firstDate secondDate photos }}`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    assert.that(res.body.data.getAd.author).is.ofType('string');
                    assert.that(res.body.data.getAd.author).is.equalTo('Robin');
                    assert.that(res.body.data.getAd.title).is.ofType('string');
                    assert.that(res.body.data.getAd.title).is.equalTo('Ceci est une annonce');
                    assert.that(res.body.data.getAd.type).is.ofType('string');
                    assert.that(res.body.data.getAd.type).is.equalTo('Sell');
                    assert.that(res.body.data.getAd.publicationStatus).is.ofType('string');
                    assert.that(res.body.data.getAd.publicationStatus).is.equalTo('Published');
                    assert.that(res.body.data.getAd.goodStatus).is.ofType('string');
                    assert.that(res.body.data.getAd.goodStatus).is.equalTo('Rented');
                    assert.that(res.body.data.getAd.description).is.ofType('string');
                    assert.that(res.body.data.getAd.description).is.equalTo('Ceci est une description');
                    assert.that(res.body.data.getAd.price).is.ofType('number');
                    assert.that(res.body.data.getAd.price).is.equalTo(200);
                    assert.that(res.body.data.getAd.firstDate).is.ofType('string');
                    assert.that(res.body.data.getAd.firstDate).is.equalTo('2021-11-25T00:00:00.000Z');
                    assert.that(res.body.data.getAd.secondDate).is.ofType('string');
                    assert.that(res.body.data.getAd.secondDate).is.equalTo('2021-11-30T00:00:00.000Z');
                    assert.that(res.body.data.getAd.photos).is.ofType('array');
                    assert.that(res.body.data.getAd.photos[0]).is.equalTo('test_ad1.jpeg');
                    assert.that(res.body.data.getAd.photos[1]).is.equalTo('test_ad2.jpeg');
                    done();
                })
        })

        it('Returns an ID error', (done) => {
            request
                .post('/graphql')
                .send({query:`query { getAd(id : "00a0a00000000a0a00aa00a0") { author title type publicationStatus goodStatus 
                    description price firstDate secondDate photos }}`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    if(res.body.errors[0].message.includes("Invalid"))
                        assert.that(res.body.errors[0].message).is.equalTo("Invalid ID !");
                    done();
                })
        })

        it('Returns a cast to ObjetID error', (done) => {
            request
                .post('/graphql')
                .send({query:`query { getAd(id : "1234") { author title type publicationStatus goodStatus description price 
                    firstDate secondDate photos }}`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    if(res.body.errors[0].message.includes("ObjectId"))
                        assert.that(res.body.errors[0].message).is.startingWith("Cast to ObjectId failed for value");
                    done();
                })
        })
    });

    describe('Get a specific ad\'s comment(s) with id', () => {
        it('Returns the comment(s)', (done) => {
            request
                .post('/graphql')
                .send({query:`query { getComments(adId: "${id}") { author text agent date }}`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    assert.that(res.body.data.getComments[0].author).is.ofType('string');
                    assert.that(res.body.data.getComments[0].author).is.equalTo('Robin');
                    assert.that(res.body.data.getComments[0].text).is.ofType('string');
                    assert.that(res.body.data.getComments[0].text).is.equalTo('Commentaire ahah');
                    assert.that(res.body.data.getComments[0].agent).is.ofType('boolean');
                    assert.that(res.body.data.getComments[0].agent).is.equalTo(true);
                    done();
                })
        })

        it('Returns an invalide ID error', (done) => {
            request
                .post('/graphql')
                .send({query:`query { getComments(adId: "${id2}") { author text agent date }}`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    if(res.body.errors[0].message.includes("Invalid"))
                        assert.that(res.body.errors[0].message).is.equalTo("Invalid ID !");
                    done();
                })
        })

        it('Returns a cast to objectID error', (done) => {
            request
                .post('/graphql')
                .send({query:`query { getComments(adId: "1234") { author text agent date }}`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    if(res.body.errors[0].message.includes("ObjectId"))
                        assert.that(res.body.errors[0].message).is.startingWith("Cast to ObjectId failed for value");
                    done();
                })
        })
    });

    describe('Modify a specific ad with id', () => {
        it('Returns the ad updated', (done) => {
            request
                .post('/graphql')
                .set('cookie', cookie)
                .send({query:`mutation { updateAd(id: "${id}", AdInput: { author: "Maxence", title: "Nouveau titre",
                    type: Location, publicationStatus: Unpublished, goodStatus: Available, description: "New text",
                    price: 1, firstDate: "2021-11-01", secondDate: "2021-11-02", photos: ["test.jpeg", "test2.jpeg"] }) { 
                    id author title type publicationStatus goodStatus description price firstDate secondDate photos comments }}`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    assert.that(res.body.data.updateAd.author).is.ofType('string');
                    assert.that(res.body.data.updateAd.author).is.equalTo('Maxence');
                    assert.that(res.body.data.updateAd.title).is.ofType('string');
                    assert.that(res.body.data.updateAd.title).is.equalTo('Nouveau titre');
                    assert.that(res.body.data.updateAd.type).is.ofType('string');
                    assert.that(res.body.data.updateAd.type).is.equalTo('Location');
                    assert.that(res.body.data.updateAd.publicationStatus).is.ofType('string');
                    assert.that(res.body.data.updateAd.publicationStatus).is.equalTo('Unpublished');
                    assert.that(res.body.data.updateAd.goodStatus).is.ofType('string');
                    assert.that(res.body.data.updateAd.goodStatus).is.equalTo('Available');
                    assert.that(res.body.data.updateAd.description).is.ofType('string');
                    assert.that(res.body.data.updateAd.description).is.equalTo('New text');
                    assert.that(res.body.data.updateAd.price).is.ofType('number');
                    assert.that(res.body.data.updateAd.price).is.equalTo(1);
                    assert.that(res.body.data.updateAd.firstDate).is.ofType('string');
                    assert.that(res.body.data.updateAd.firstDate).is.equalTo('2021-11-01T00:00:00.000Z');
                    assert.that(res.body.data.updateAd.secondDate).is.ofType('string');
                    assert.that(res.body.data.updateAd.secondDate).is.equalTo('2021-11-02T00:00:00.000Z');
                    assert.that(res.body.data.updateAd.photos).is.ofType('array');
                    assert.that(res.body.data.updateAd.photos[0]).is.equalTo('test.jpeg');
                    assert.that(res.body.data.updateAd.photos[1]).is.equalTo('test2.jpeg');
                    done();
                })
        })

        it('Fake to modify the ad to see if it keeps the same values', (done) => {
            request
                .post('/graphql')
                .set('cookie', cookie)
                .send({query:`mutation { updateAd(id: "${id}", AdInput: { }) { id author title type publicationStatus 
                    goodStatus description price firstDate secondDate photos comments }}`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    assert.that(res.body.data.updateAd.author).is.ofType('string');
                    assert.that(res.body.data.updateAd.author).is.equalTo('Maxence');
                    assert.that(res.body.data.updateAd.title).is.ofType('string');
                    assert.that(res.body.data.updateAd.title).is.equalTo('Nouveau titre');
                    assert.that(res.body.data.updateAd.type).is.ofType('string');
                    assert.that(res.body.data.updateAd.type).is.equalTo('Location');
                    assert.that(res.body.data.updateAd.publicationStatus).is.ofType('string');
                    assert.that(res.body.data.updateAd.publicationStatus).is.equalTo('Unpublished');
                    assert.that(res.body.data.updateAd.goodStatus).is.ofType('string');
                    assert.that(res.body.data.updateAd.goodStatus).is.equalTo('Available');
                    assert.that(res.body.data.updateAd.description).is.ofType('string');
                    assert.that(res.body.data.updateAd.description).is.equalTo('New text');
                    assert.that(res.body.data.updateAd.price).is.ofType('number');
                    assert.that(res.body.data.updateAd.price).is.equalTo(1);
                    assert.that(res.body.data.updateAd.firstDate).is.ofType('string');
                    assert.that(res.body.data.updateAd.firstDate).is.equalTo('2021-11-01T00:00:00.000Z');
                    assert.that(res.body.data.updateAd.secondDate).is.ofType('string');
                    assert.that(res.body.data.updateAd.secondDate).is.equalTo('2021-11-02T00:00:00.000Z');
                    assert.that(res.body.data.updateAd.photos).is.ofType('array');
                    assert.that(res.body.data.updateAd.photos[0]).is.equalTo('test.jpeg');
                    assert.that(res.body.data.updateAd.photos[1]).is.equalTo('test2.jpeg');
                    done();
                })
        })

        it('Returns a login error', (done) => {
            request
                .post('/graphql')
                .send({query:`mutation { updateAd(id: "${id}", AdInput: { title: "Updated ad v2", price: 1234 }) { id author 
                    title type publicationStatus goodStatus description price firstDate secondDate photos comments }}`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    // When the user is not logged in
                    if(res.body.errors[0].message.includes('login'))
                        assert.that(res.body.errors[0].message).is.equalTo('You have to login first !');
                    done();
                })
        })

        it('Returns an ID error', (done) => {
            request
                .post('/graphql')
                .set('cookie', cookie)
                .send({query:`mutation { updateAd(id: "00a0a00000000a0a00aa00a0", AdInput: { title: "Updated ad v2", 
                    price: 1234 }) { id author title type publicationStatus goodStatus description price firstDate 
                    secondDate photos comments }}`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    // When the id has the good format but is incorrect
                    if(res.body.errors[0].message.includes("Invalid"))
                        assert.that(res.body.errors[0].message).is.equalTo("Invalid ID !");
                    done();
                })
        })

        it('Returns a cast objectID error', (done) => {
            request
                .post('/graphql')
                .set('cookie', cookie)
                .send({query:`mutation { updateAd(id: "1234", AdInput: { title: "Updated ad v2", 
                    price: 1234 }) { id author title type publicationStatus goodStatus description price firstDate 
                    secondDate photos comments }}`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    // When the id doesn't have the good format
                    if(res.body.errors[0].message.includes("ObjectId"))
                        assert.that(res.body.errors[0].message).is.startingWith("Cast to ObjectId failed for value");
                    done();
                })
        })
    });

    describe('Delete a specific ad with id', () => {
        it('Returns the ad deleted', (done) => {
            request
                .post('/graphql')
                .set('cookie', cookie)
                .send({query:`mutation { deleteAd(id: "${id}") }`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    assert.that(res.body.data.deleteAd).is.equalTo('Ad deleted !');
                    done();
                })
        })

        it('Returns a login error', (done) => {
            request
                .post('/graphql')
                .send({query:`mutation { deleteAd(id: "${id}") }`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    // When the user is not logged in
                    if(res.body.errors[0].message.includes('login'))
                        assert.that(res.body.errors[0].message).is.equalTo('You have to login first !');
                    done();
                })
        })

        it('Returns an ID error', (done) => {
            request
                .post('/graphql')
                .set('cookie', cookie)
                .send({query:`mutation { deleteAd(id: "00a0a00000000a0a00aa00a0") }`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    // When the id has the good format but is incorrect
                    if(res.body.errors[0].message.includes("Invalid"))
                        assert.that(res.body.errors[0].message).is.equalTo("Invalid ID !");
                    done();
                })
        })

        it('Returns a cast objectID error', (done) => {
            request
                .post('/graphql')
                .set('cookie', cookie)
                .send({query:`mutation { deleteAd(id: "1234") }`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    // When the id doesn't have the good format
                    if(res.body.errors[0].message.includes("ObjectId"))
                        assert.that(res.body.errors[0].message).is.startingWith("Cast to ObjectId failed for value");
                    done();
                })
        })
    });

    describe('Log out the agent', () => {
        it('Returns the agent logged out', (done) => {
            request
                .post('/graphql')
                .set('cookie', cookie)
                .send({query:`mutation { logout }`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    assert.that(res.body.data.logout).is.equalTo("agent76 disconnected !");
                    done();
                })
        })
    });

    describe('Log in an user to manipulate the ads', () => {
        it('Returns the user logged', (done) => {
            request
                .post('/graphql')
                .send({query:`mutation { login(Username: "robin76", Password: "123abc") }`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    cookie2 = res.headers['set-cookie'];
                    assert.that(res.body.data.login).is.equalTo("robin76 connected !");
                    done();
                })
        })
    });

    describe('Try to create an ad with an user', () => {
        it('Returns an unauthorized error', (done) => {
            request
                .post('/graphql')
                .set('cookie', cookie2)
                .send({query:`mutation { createAd(AdInput: { author: "Robin", title: "Ceci est une annonce", type: Sell, 
                    publicationStatus: Published, goodStatus: Rented, description: "Ceci est une description", price: 200, 
                    firstDate: "2021-11-25", secondDate: "2021-11-30", photos: ["test_ad1.jpeg", "test_ad2.jpeg"] }) {
                    id author title type publicationStatus goodStatus description price firstDate secondDate photos }}`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    // When the user is not an agent
                    if(res.body.errors[0].message.includes('Unauthorized'))
                        assert.that(res.body.errors[0].message).is.equalTo('Unauthorized !');
                    done();
                })
        })
    });

    describe('Try to modify an ad with an user', () => {
        it('Returns an unauthorized error', (done) => {
            request
                .post('/graphql')
                .set('cookie', cookie2)
                .send({query:`mutation { updateAd(id: "${id}", AdInput: { title: "Updated ad v2", price: 1234 }) { id author 
                    title type publicationStatus goodStatus description price firstDate secondDate photos comments }}`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    // When the user is not an agent
                    if(res.body.errors[0].message.includes('Unauthorized'))
                        assert.that(res.body.errors[0].message).is.equalTo('Unauthorized !');
                    done();
                })
        })
    });

    describe('Try to delete an ad with an user', () => {
        it('Returns an unauthorized error', (done) => {
            request
                .post('/graphql')
                .set('cookie', cookie2)
                .send({query:`mutation { deleteAd(id: "${id}") }`})
                .expect(200)
                .end((err, res) => {
                    if(err)
                        return done(res, err);
                    // When the user is not an agent
                    if(res.body.errors[0].message.includes('Unauthorized'))
                        assert.that(res.body.errors[0].message).is.equalTo('Unauthorized !');
                    done();
                })
        })
    });
});