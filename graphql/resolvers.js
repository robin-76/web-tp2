require('../models/User');
require('../models/Ad');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Ad = mongoose.model('Ad');
const Comment = mongoose.model('Comment');

const resolvers = {
        // Query
        getAllUsers: async () => {
            return await User.find();
        },
        getAllAds: async () => {
            return await Ad.find();
        },
        getPriceFilterAds: async (args) => {
            return await Ad.find({price: { '$gte': args.min, '$lte': args.max}});
        },
        getAd: async (args) => {
            return await Ad.findById(args.id);
        },
        getComments: async (args) => {
            return await Comment.find({ad: args.adId});
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
          //  console.log(context.session);
            const user = await User.findOne({username: args.UserInput.username});

            // Checking if password is correct
            if(!user) throw new Error("User is not found");
                
            // Checking if password is correct
            const validPass = await bcrypt.compare(args.UserInput.password, user.password);
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

            if(username!=undefined){
                await context.session.destroy();
                return (username + " Diconnected !");
            }
            else return ("No user connected !");
          },
        createAd: async (args) => {
            const ad = await Ad.create(args.AdInput);
            await ad.save();
            return ad;
        },
        createComment: async (args) => {
            const ad = await Ad.findById(args.adId).populate('comments');
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
        updateAd: async(args) => {
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
            return ad;
        },  
        deleteAd: async(args) => {
            const { id } = args;
            await Ad.findByIdAndDelete(id);
            await Comment.deleteMany({ ad: id });
            return 'Ad deleted !';
        },
};

module.exports = resolvers;