const resolvers = {
  Query: {
    movies(parent, args, context, info) {
      context.movies;
    },
    users(parent, args, context, info) {
      return context.users;
    },
    reviews(parent, args, context, info) {
      return context.reviews;
    },
  },
  Review: {
    movie(parent, args, context, info) {
      return context.movies.find((movie) => {
        return movie.id === parent.movie;
      });
    },
    user(parent, args, context, info) {
      return context.users.find((user) => {
        return user.id === parent.user;
      });
    },
  },
  User: {
    reviews(parent, args, context, info) {
      return context.reviews.filter((review) => {
        return review.user === parent.id;
      });
    },
  },
  Movie: {
    reviews(parent, args, context, info) {
      return context.reviews.filter((review) => {
        return review.id === parent.reviews;
      });
    },
  },
};

module.exports = resolvers;
