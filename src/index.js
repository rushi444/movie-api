const { GraphQLServer, PubSub } = require('graphql-yoga');
const { prisma } = require('../prisma/generated/prisma-client');
const mainResolver = require('./resolvers/index');

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: mainResolver,
  context: {
    pubsub,
    prisma,
  },
});

server.start(() => console.log('Server is running on localhost:4000'));
