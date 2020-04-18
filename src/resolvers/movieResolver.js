const movieResolver = {
  Query: {
    async movies(parent, args, context, info) {
      const movies = await context.prisma.movies();
      return movies;
    },
  },
  Mutation: {
    async createMovie(parent, args, context, info) {
      const movie = await context.prisma.createMovie({
        title: args.title,
      });
      return movie;
    },
  },
  Movie: {
    reviews(parent, args, context, info) {
      return context.prisma.movie({ id: parent.id }).reviews();
    },
  },
};

module.exports = movieResolver