const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const mongoose = require('mongoose');

async function startServer() {
    const app = express()
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ app: app });

    app.use((_req, res) => {
        res.send('Hello from express apollo server');
    })

    await mongoose.connect('mongodb://localhost:27017/LeBonLogement', {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    });
    console.log('Mongoose connected...');
    
    const server = app.listen(4000, () => {
        console.log(`Express is running on port ${server.address().port}`);
    });    
}
startServer();