const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const config = require('./config/key');
const schema = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const auth = require('./auth');
const bodyParser = require("express");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect(config.MONGO_URI, { useNewUrlParser: true }, (err) => {
    if (err)
        console.log(err.message);
    else
        console.log('MongoDB Successfully Connected ...');
});

const store = new MongoDBStore({
    uri: config.MONGO_URI,
    collection: "sessions",
});

app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: false,
        store: store
    })
);

app.use("/graphql", graphqlHTTP( req => ({
        schema,
        rootValue: resolvers,
        context: { session: req.session, auth },
        graphiql: true
    }))
);

const server = app.listen(process.env.PORT || 4000, () => {
    console.log(`Now browse to localhost:${server.address().port}/graphql`);
});

module.exports = { app }
