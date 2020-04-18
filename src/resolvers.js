const resolvers = {
  Query: {
    movies(parent, args, context, info) {
      return context.movies;
    },
    users(parent, args, context, info) {
      return context.users;
    },
    reviews(parent, args, context, info) {
      return context.reviews;
    },
  },
  Mutation: {
    signup(parent, args, context, info) {
      const user = {
        id: `100${context.users.length + 1}`,
        name: args.name,
        email: args.email,
      };
      context.users.push(user);
      return user;
    },
    createMovie(parent, args, context, info) {
      const movie = {
        id: `200${context.movies.length + 1}`,
        title: args.title,
      };
      context.movies.push(movie);
      return movie;
    },
    createReview(parent, args, context, info) {
      const review = {
        id: `300${context.reviews.length + 1}`,
        movie: args.movieId,
        reviewText: args.reviewText,
        rating: args.rating,
        user: args.userId,
      };
      context.reviews.push(review);
      context.pubsub.publish('newReview', { review });
      return review;
    },
  },
  Subscription: {
    review: {
      subscribe(parent, args, context, info) {
        return context.pubsub.asyncIterator('newReview');
      },
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
