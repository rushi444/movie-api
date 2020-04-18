const GMR = require('graphql-merge-resolvers');

const userResolver = require('./userResolver');
const movieResolver = require('./movieResolver');
const reviewResolver = require('./reviewResolver');

const mainResolver = GMR.merge([userResolver, movieResolver, reviewResolver]);

module.exports = mainResolver;
