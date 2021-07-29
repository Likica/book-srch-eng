const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');


const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')

                return userData;
            }

            throw new AuthenticationError('Not logged in');
        },
    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        },
        addBooks: async (args, parent, context) => {  // if async does not work - try 'addBooks: async (params)
            if (context.user) {
                let user = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    {
                        $addToSet: {
                            savedBooks: args,
                        },
                    },
                    { new: true }
                );
                let book = user.savedBooks[user.savedBooks.length - 1];
                console.log(book);

                return book;
            }
            throw new AuthenticationError("You need to be logged in!");
        },

        deleteBook: async (parent, args, context) => {
            if (context.user) {
                let user = await User.findOne({ _id: context.user._id });
                let savedBooks = user.savedBooks;
                let book = savedBooks.find((book) => book.bookId === args.bookId);
                console.log(book);
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: args.bookId } } },
                    { new: true }
                );
                return book;
            }
            throw new AuthenticationError("You need to be logged in!");
        },
    },
};

module.exports = resolvers;