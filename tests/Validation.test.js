const expect = require('chai').expect;
const { parse } = require("graphql/language");
const { validate } = require("graphql/validation");
const schema = require("../graphql/schema");

function validationErrors(query) {
    const queryAST = parse(query);
    return validate(schema, queryAST);
  }

describe('Ads Validation Tests', () => {
    it('List of ads', () => {
        const query = `
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
        `;
        return expect(validationErrors(query)).to.be.empty;
    })

    it('Notes that non-existent fields are invalid', () => {
        const query = `
            query {
                getAllAds {
                   titre
                }
            }
        `;
        return expect(validationErrors(query)).not.to.be.empty;
    })

    it('Requires fields on objects', () => {
        const query = `
            query {
                getAllAds
            }
        `;
        return expect(validationErrors(query)).not.to.be.empty;
    })
});
    