const app = require('../server');
const expect = require('chai').expect;
const { parse } = require("graphql/language");
const { validate } = require("graphql/validation");
const schema = require("../graphql/schema");

function validationErrors(query) {
    const queryAST = parse(query);
    return validate(schema, queryAST);
}

describe('Ad validation tests', () => {
    describe('createAd', () => {
        it('Create an ad', () => {
            const query = `mutation { createAd(AdInput: { author: "Robin", title: "Ceci est une annonce", type: Sell, 
                publicationStatus: Published, goodStatus: Rented, description: "Ceci est une description", price: 200, 
                firstDate: "2021-11-25", secondDate: "2021-11-30", photos: ["test_ad1.jpeg", "test_ad2.jpeg"] }) { 
                id author title type publicationStatus goodStatus description price firstDate secondDate photos } }`;
            return expect(validationErrors(query)).to.be.empty;
        })

        it('Non-existent fields are invalid', () => {
            const query = `mutation { createAd(AdInput: { author: "Robin", title: "Ceci est une annonce", type: Sell, 
                publicationStatus: Published, goodStatus: Rented, description: "Ceci est une description", price: 200, 
                firstDate: "2021-11-25", secondDate: "2021-11-30", photos: ["test_ad1.jpeg", "test_ad2.jpeg"] }) { 
                test } }`;
            return expect(validationErrors(query)).not.to.be.empty;
        })

        it('Requires fields on objects', () => {
            const query = `mutation { createAd(AdInput: { author: "Robin", title: "Ceci est une annonce", type: Sell, 
                publicationStatus: Published, goodStatus: Rented, description: "Ceci est une description", price: 200, 
                firstDate: "2021-11-25", secondDate: "2021-11-30", photos: ["test_ad1.jpeg", "test_ad2.jpeg"] }) }`;
            return expect(validationErrors(query)).not.to.be.empty;
        })
    });

    describe('createComment', () => {
        it('Create a comment', () => {
            const query = `mutation { createComment(adId: "61a4d94589730c586fb727ec", CommentInput: { author: "Robin", 
                text: "Commentaire ahah", agent: true }) { id author text agent date } }`;
            return expect(validationErrors(query)).to.be.empty;
        })

        it('Non-existent fields are invalid', () => {
            const query = `mutation { createComment(adId: "61a4d94589730c586fb727ec", CommentInput: { author: "Robin", 
                text: "Commentaire ahah", agent: true }) { test } }`;
            return expect(validationErrors(query)).not.to.be.empty;
        })

        it('Requires fields on objects', () => {
            const query = `mutation { createComment(adId: "61a4d94589730c586fb727ec", CommentInput: { author: "Robin", 
                text: "Commentaire ahah", agent: true }) }`;
            return expect(validationErrors(query)).not.to.be.empty;
        })
    });

    describe('getAllAds', () => {
        it('List of ads', () => {
            const query = `query { getAllAds { id author title type publicationStatus goodStatus description price 
                firstDate secondDate photos comments } }`;
            return expect(validationErrors(query)).to.be.empty;
        })

        it('Non-existent fields are invalid', () => {
            const query = `query { getAllAds { test } }`;
            return expect(validationErrors(query)).not.to.be.empty;
        })

        it('Requires fields on objects', () => {
            const query = `query { getAllAds }`;
            return expect(validationErrors(query)).not.to.be.empty;
        })
    });

    describe('getPriceFilterAds', () => {
        it('Price filter', () => {
            const query = `query { getPriceFilterAds(min:0, max:10) { id author title type publicationStatus goodStatus description price 
                firstDate secondDate photos comments } }`;
            return expect(validationErrors(query)).to.be.empty;
        })

        it('Non-existent fields are invalid', () => {
            const query = `query { getPriceFilterAds(min:0, max:10) { test } }`;
            return expect(validationErrors(query)).not.to.be.empty;
        })

        it('Requires fields on objects', () => {
            const query = `query { getPriceFilterAds(min:0, max:10) }`;
            return expect(validationErrors(query)).not.to.be.empty;
        })
    });

    describe('getAd', () => {
        it('Find an ad with id', () => {
            const query = `query { getAd(id:"61a4d94589730c586fb727ec") { author title type publicationStatus goodStatus
                description price firstDate secondDate photos } }`;
            return expect(validationErrors(query)).to.be.empty;
        })

        it('Non-existent fields are invalid', () => {
            const query = `query { getAd(id:"61a4d94589730c586fb727ec") { test } }`;
            return expect(validationErrors(query)).not.to.be.empty;
        })

        it('Requires fields on objects', () => {
            const query = `query { getAd(id:"61a4d94589730c586fb727ec") }`;
            return expect(validationErrors(query)).not.to.be.empty;
        })
    });

    describe('getComments', () => {
        it('Find a comment with id', () => {
            const query = `query { getComments(adId: "61a4d94589730c586fb727ec") { author text agent date } }`;
            return expect(validationErrors(query)).to.be.empty;
        })

        it('Non-existent fields are invalid', () => {
            const query = `query { getComments(adId: "61a4d94589730c586fb727ec") { test } }`;
            return expect(validationErrors(query)).not.to.be.empty;
        })

        it('Requires fields on objects', () => {
            const query = `query { getComments(adId: "61a4d94589730c586fb727ec") }`;
            return expect(validationErrors(query)).not.to.be.empty;
        })
    });

    describe('updateAd', () => {
        it('Update an ad', () => {
            const query = `mutation { updateAd(id: "61a4d94589730c586fb727ec", AdInput: { title: "Nouvelle annonce", 
                price: 2000 }) { id author title type publicationStatus goodStatus description price firstDate
                secondDate photos comments }  }`;
            return expect(validationErrors(query)).to.be.empty;
        })

        it('Non-existent fields are invalid', () => {
            const query = `mutation { updateAd(id: "61a4d94589730c586fb727ec", AdInput: { title: "Nouvelle annonce", 
                price: 2000 }) { test } }`;
            return expect(validationErrors(query)).not.to.be.empty;
        })

        it('Requires fields on objects', () => {
            const query = `mutation { updateAd(id: "61a4d94589730c586fb727ec", AdInput: { title: "Nouvelle annonce", 
                price: 2000 }) }`;
            return expect(validationErrors(query)).not.to.be.empty;
        })
    });

    describe('deleteAd', () => {
        it('Delete an ad', () => {
            const query = `mutation { deleteAd(id: "61a4d94589730c586fb727ec") }`;
            return expect(validationErrors(query)).to.be.empty;
        })
    });
});
    