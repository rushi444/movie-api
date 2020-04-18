const reviewResolver = {
  Query: {
    async reviews(parent, args, context, info) {
      const reviews = await context.prisma.reviews();
      return reviews;
    },
  },
  Mutation: {
    async createReview(parent, args, context, info) {
      const user = context.prisma.$exists.user({ id: args.userId });
      const movie = context.prisma.$exists.movie({ id: args.movieId });
      if (!user) {
        throw new Error('User not found');
      }
      if (!movie) {
        throw new Error('Movie not found');
      }
      const review = await context.prisma.createReview({
        movie: {
          connect: {
            id: args.movieId,
          },
        },
        reviewText: args.reviewText,
        rating: args.rating,
        user: {
          connect: {
            id: args.userId,
          },
        },
      });
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
      return context.prisma.review({ id: parent.id }).movie();
    },
    user(parent, args, context, info) {
      return context.prisma.review({ id: parent.id }).user();
    },
  },
};

module.exports = reviewResolver