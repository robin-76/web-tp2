const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const config = require('./config/key');

const app = express();

const schema = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true
  }));

mongoose.connect(config.MONGO_URI, { useNewUrlParser: true }, (err) => {
    if (err)
        console.log(err.message);
    else
        console.log('MongoDB Successfully Connected ...');
});

  const server = app.listen(process.env.PORT || 4000, () => {
    console.log(`Now browse to localhost:${server.address().port}/graphql`);
  });