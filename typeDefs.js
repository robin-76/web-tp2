const { gql } = require('apollo-server-express');

const typeDefs = gql`
    scalar Date

    type User {
        id: ID
        username: String
        email: String
        password: String
        agent: Boolean
        date: Date
    }

    input UserInput {
        username: String
        email: String
        password: String
        agent: Boolean
        date: Date
    }

    enum type_enum {
    Sell
    Location
    }

    enum publicationStatus_enum {
    Published
    Unpublished
    }

    enum goodStatus_enum {
    Available
    Rented
    Sold
    }

    type Ad {
        id: ID
        author: String
        title: String
        type: type_enum
        publicationStatus: publicationStatus_enum
        goodStatus: goodStatus_enum
        description: String
        price: Float
        firstDate: Date
        secondDate: Date
        photos: [String]
        comments: [ID]
    }

    input AdInput {
        author: String
        title: String
        type: type_enum
        publicationStatus: publicationStatus_enum
        goodStatus: goodStatus_enum
        description: String
        price: Float
        firstDate: Date
        secondDate: Date
        photos: [String]
        comments: [ID]
    }

    type Comment {
        id: ID
        author: String
        text: String
        agent: Boolean
        date: Date
        ad: ID
    }

    input CommentInput {
        author: String
        text: String
        agent: Boolean
        date: Date
        ad: ID
    }

    type Query {
      getAllUsers: [User]  
      getAllAds: [Ad]
      getPriceFilterAds(min: Float, max: Float): [Ad]  
      getAd(id: ID): Ad 
      getComments(adId: ID): [Comment]  
    }

    type Mutation {
        createUser(UserInput: UserInput): User
        createAd(AdInput: AdInput): Ad
        createComment(adId: ID, CommentInput: CommentInput): Comment
        deleteAd(id: ID): String
        updateAd(id: ID, AdInput: AdInput): Ad
    }
`;

module.exports = typeDefs;