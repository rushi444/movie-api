const userResolver = {
  Query: {
    async users(parent, args, context, info) {
      const users = await context.prisma.users();
      return users;
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
  },
  User: {
    reviews(parent, args, context, info) {
      return context.prisma.user({ id: parent.id }).reviews();
    },
  },
};

module.exports = userResolver