require('../models/User');
require('../models/Ad');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Ad = mongoose.model('Ad');
const Comment = mongoose.model('Comment');

const resolvers = {
    // Query
    getAllUsers: async (_args, context) => {
        context.auth(context);
        return User.find();
    },
    getAllAds: async () => {
        return Ad.find();
    },
    getPriceFilterAds: async (args) => {
        return Ad.find({price: {'$gte': args.min, '$lte': args.max}});
    },
    getAd: async (args) => {
        const ad = await Ad.findById(args.id);
        if(!ad) throw new Error("Invalid ID !");
        return ad;
    },
    getComments: async (args) => {
        const comments = await Comment.find({ad: args.adId});
        if(!comments.length) throw new Error("Invalid ID !");
        return comments;
    },

    // Mutation
    createUser: async (args) => {
        const usernameExist = await User.findOne({username: args.UserInput.username});
        if(usernameExist) throw new Error("Username already exists");

        const emailExist = await User.findOne({email: args.UserInput.email});
        if(emailExist) throw new Error("Email already exists");

        const salt = await bcrypt.genSalt(10);
        args.UserInput.password = await bcrypt.hash(args.UserInput.password, salt);

        const user = await User.create(args.UserInput);
        await user.save();
        return user;
    },
    login: async (args, context) => {
        const user = await User.findOne({username: args.Username});

        // Checking if password is correct
        if(!user) throw new Error("User is not found");

        // Checking if password is correct
        const validPass = await bcrypt.compare(args.Password, user.password);
        if(!validPass) throw new Error("Invalid password");

        // Expires after 1 hour
        context.session.cookie.expires = new Date(Date.now() + 3600000);

        context.session.agent = !!user.agent;
        context.session.username = user.username;
        context.session.isAuth = true;

        return (user.username + " connected !");
    },
    logout: async (_args, context) => {
        const username = context.session.username

        if(username !== undefined) {
            await context.session.destroy();
            return (username + " disconnected !");
        }
        else throw new Error("No user connected !");
    },
    createAd: async (args, context) => {
        context.auth(context);

        const ad = await Ad.create(args.AdInput);
        await ad.save();
        return ad;
    },
    createComment: async (args, context) => {
        if(!context.session.isAuth) throw new Error("You have to login first !");

        const ad = await Ad.findById(args.adId).populate('comments');
        if(!ad) throw new Error("Invalid ID !");
        let tabComments = ad.comments;

        const comment = await Comment.create(args.CommentInput);
        comment.ad = args.adId

        tabComments.push(comment);

        await Ad.updateOne({_id: args.adId},{$set: {
                comments: tabComments
            }}
        );
        await comment.save();
        return comment;
    },
    updateAd: async(args, context) => {
        context.auth(context);

        const { id } = args;
        const { author, title, type, publicationStatus, goodStatus, description, price, firstDate, secondDate, photos } = args.AdInput;
        const updates = {};

        if (author !== undefined) updates.author = author;
        if (title !== undefined) updates.title = title;
        if (type !== undefined) updates.type = type;
        if (publicationStatus !== undefined) updates.publicationStatus = publicationStatus;
        if (goodStatus !== undefined) updates.goodStatus = goodStatus;
        if (description !== undefined) updates.description = description;
        if (price !== undefined) updates.price = price;
        if (firstDate !== undefined) updates.firstDate = firstDate;
        if (secondDate !== undefined) updates.secondDate = secondDate;
        if (photos !== undefined) updates.photos = photos;

        const ad = await Ad.findByIdAndUpdate(id, updates, {new: true});
        if(!ad) throw new Error("Invalid ID !");
        return ad;
    },
    deleteAd: async(args, context) => {
        context.auth(context);

        const { id } = args;
        const del = await Ad.findByIdAndDelete(id);
        if(!del) throw new Error("Invalid ID !");
        await Comment.deleteMany({ ad: id });
        return 'Ad deleted !';
    },
};

module.exports = resolvers;