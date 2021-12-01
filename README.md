# Express & GraphQL [![pipeline status](https://www-apps.univ-lehavre.fr/forge/gr161657/web-tp2/badges/master/pipeline.svg)](https://www-apps.univ-lehavre.fr/forge/gr161657/web-tp2/commits/master) [![coverage report](https://www-apps.univ-lehavre.fr/forge/gr161657/web-tp2/badges/master/coverage.svg)](https://www-apps.univ-lehavre.fr/forge/gr161657/web-tp2/commits/master)

- Année : M1 IWOCS
- Matière: WEB
- TP : n°5

## Auteur(s)

|Nom|Prénom|login|email|
|--|--|--|--|
| *Guyomar* | *Robin*| *gr161657* | *robin.guyomar@etu.univ-lehavre.fr* |
| *Bourgeaux* | *Maxence*| *bm142013* | *maxence.bourgeaux@etu.univ-lehavre.fr* |

## Travail à réaliser

Détail du tp : <https://pigne.org/teaching/webdev1/lab/ReactRouterLab>


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


- Year : M2 IWOCS
- Subject : WEB
- TP : n°2

## Author(s)

|Name|First Name|
|--|--|
| *Guyomar* | *Robin*|
| *Bourgeaux* | *Maxence*|

# Description

Using GraphiQL as a query system for our real estate listings database.

# Commands to launch the server

Installing the dependencies :

    npm i

Launch the server :

    npm start 

GraphQL Interface : http://localhost:4000/graphql

# GraphQL Queries

## Users

Create an user :

    mutation {
        createUser(UserInput: {
            username: "robin76", 
            email: "robinguyomar@gmail.com", 
            password: "123abc", 
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

Login :

    mutation {
        login(Username: "robin76", Password: "123abc")
    }

Logout :

    mutation {
        logout
    }           

## Ads

Creation of an ad :

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

Ads price filter :

    query {
        getPriceFilterAds(min:1500, max:2000) {
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
        createComment(adId: "61a4d94589730c586fb727ec", CommentInput: {
            author: "Robin", 
            text: "Commentaire ahah", 
            agent: true
        }) {
            id
            author
            text
            agent
            date
        }
    }


Display an ad and his comments according to its id :

    query {
        getAd(id: "61a4d94589730c586fb727ec") {
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
        getComments(adId: "61a4d94589730c586fb727ec") {
            author
            text
            agent
            date
        }
    } 

Update an ad according to its id :

    mutation {
        updateAd(id: "61a4d94589730c586fb727ec", AdInput: {
            title: "Nouvelle annonce", 
            price: 2000
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

Delete an ad according to its id :

    mutation {
        deleteAd(id: "61a4d94589730c586fb727ec")
    }                
