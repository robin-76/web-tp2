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

    type Ad {
        id: ID
        author: String
        title: String
        type: String
        publicationStatus: String
        goodStatus: String
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
        type: String
        publicationStatus: String
        goodStatus: String
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