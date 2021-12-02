const app = require('../server');
const expect = require('chai').expect;
const { parse } = require("graphql/language");
const { validate } = require("graphql/validation");
const schema = require("../graphql/schema");

function validationErrors(query) {
    const queryAST = parse(query);
    return validate(schema, queryAST);
}

describe('User validation tests', () => {
    describe('createUser', () => {
        it('Create an user', () => {
            const query = `mutation { createUser(UserInput: { username: "robin76", email: "robinguyomar@gmail.com", 
                password: "123abc", agent: true }) { username email password agent date } }`;
            return expect(validationErrors(query)).to.be.empty;
        })

        it('Non-existent fields are invalid', () => {
            const query = `mutation { createUser(UserInput: { username: "robin76", email: "robinguyomar@gmail.com", 
                password: "123abc", agent: true }) { test } }`;
            return expect(validationErrors(query)).not.to.be.empty;
        })

        it('Requires fields on objects', () => {
            const query = `mutation { createUser(UserInput: { username: "robin76", email: "robinguyomar@gmail.com", 
                password: "123abc", agent: true }) }`;
            return expect(validationErrors(query)).not.to.be.empty;
        })
    });

    describe('getAllUsers', () => {
        it('Get all users', () => {
            const query = `query { getAllUsers { username email password agent date } }`;
            return expect(validationErrors(query)).to.be.empty;
        })

        it('Non-existent fields are invalid', () => {
            const query = `query { getAllUsers { test } }`;
            return expect(validationErrors(query)).not.to.be.empty;
        })

        it('Requires fields on objects', () => {
            const query = `query { getAllUsers }`;
            return expect(validationErrors(query)).not.to.be.empty;
        })
    });

    describe('login', () => {
        it('Log in', () => {
            const query = `mutation { login(Username: "robin76", Password: "123abc") }`;
            return expect(validationErrors(query)).to.be.empty;
        })
    });

    describe('logout', () => {
        it('Log out', () => {
            const query = `mutation { logout }`;
            return expect(validationErrors(query)).to.be.empty;
        })
    });
});
