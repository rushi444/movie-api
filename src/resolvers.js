const resolvers = {
  Query: {
    async movies(parent, args, context, info) {
      const movies = await context.prisma.movies();
      return movies;
    },
    async users(parent, args, context, info) {
      const users = await context.prisma.users();
      return users;
    },
    async reviews(parent, args, context, info) {
      const reviews = await context.prisma.reviews();
      return reviews;
    },
    async reviewsByUser(parent, args, context, info) {
      const userExists = await context.prisma.$exists.user({ id: args.userId });
      if (!userExists) {
        throw new Error('User not found');
      }
      const reviews = await context.prisma.user({ id: args.userId }).reviews();
      return reviews;
    },
  },
  Mutation: {
    async signup(parent, args, context, info) {
      const user = await context.prisma.createUser({
        name: args.name,
        email: args.email,
      });
      return user;
    },
    async createMovie(parent, args, context, info) {
      const movie = await context.prisma.createMovie({
        title: args.title,
      });
      return movie;
    },
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
  User: {
    reviews(parent, args, context, info) {
      return context.prisma.user({ id: parent.id }).reviews();
    },
  },
  Movie: {
    reviews(parent, args, context, info) {
      return context.prisma.movie({ id: parent.id }).reviews();
    },
  },
};

module.exports = resolvers;
