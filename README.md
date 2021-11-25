
- Year : M2 IWOCS
- Subject : WEB
- TP : n°2

## Author(s)

|Nom|Prénom|
|--|--|
| *Guyomar* | *Robin*|
| *Bourgeaux* | *Maxence*|

# Description

Using GraphQL as a query system for our real estate listings database.

# Commands to launch the server

Installing the dependencies :

    npm i

Launch the server :

    npm start 

GraphQL URL : http://localhost:4000/graphql

# GraphQL Queries

Create an user :

    mutation {
        createUser(UserInput: {
            username: "robin76"
            email: "robinguyomar@gmail.com"
            password: "123abc"
            agent: true
            }) {	
            username
            email
            password
            agent
            date
            }
        }

List of all users :

    query {
        getAllUsers {
            username
            email
            password
            agent
            date
            }
        }

Creation of an ad :

    mutation {
        createAd(AdInput: {
            author: "Robin"
            title: "Ceci est une nouvelle annonce 3"
            type: "Sell"
            publicationStatus: "Published"
            goodStatus: "Rented"
            description: "Ceci est une description"
            price: 200
            firstDate: "2021-11-25"
            secondDate: "2021-11-30"
            photos: [
                "test_ad1.jpeg",
                "test_ad2.jpeg"
                ]
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

List of all ads :

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

Create a comment :

    mutation {
        createComment(adId : "619e4fc2fe6a687f4b3248a5",
        CommentInput: {
            author: "Robin"
            text: "Commentaire ahah"
            agent: true
            }) {	
            id
            author
            text
            agent
            date
            }
        }       

Display comments associated with the ad id :

    query {
        getComments(adId: "619e4fc2fe6a687f4b3248a5") {
            author
            text
            agent
            date
            }
        }         

Display an ad according to its id :

    query {
        getAd(id: "619cbf57b7facb4b075bcc2e") {
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

Delete an ad according to its id :

    mutation {
        deleteAd(id: "619d08781b2e49341532ea59")
        }   

Update an ad according to its id :

    mutation {
        updateAd(id: "619d09361b2e49341532ea5d", AdInput: {
            title: "Nouvelle annonce"
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
            comments
            }
        }              