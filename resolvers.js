require('./models/User');
require('./models/Ad');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Ad = mongoose.model('Ad');
const Comment = mongoose.model('Comment');

const resolvers = {
    Query: {
        getAllUsers: async () => {
            return await User.find();
        },
        getAllAds: async () => {
            return await Ad.find();
        },
        getPriceFilterAds: async (_, { min, max }) => {
            return await Ad.find({price: { '$gte': min, '$lte': max}});
        },
        getAd: async (_parent, {id}, _context, _info) => {
            return await Ad.findById(id);
        },
        getComments: async (_parent, {adId}, _context, _info) => {
            return await Comment.find({ad: adId});
        },
    },
    Mutation: {
        createUser: async (_, { UserInput }) => {
            const usernameExist = await User.findOne({username: UserInput.username});
            if(usernameExist) throw new Error("Username already exists");

            const emailExist = await User.findOne({email: UserInput.email});
            if(emailExist) throw new Error("Email already exists");

            const salt = await bcrypt.genSalt(10);
            UserInput.password = await bcrypt.hash(UserInput.password, salt);

            const user = await User.create(UserInput);
            await user.save();
            return user;
        },
        createAd: async (_, { AdInput }) => {
            const ad = await Ad.create(AdInput);
            await ad.save();
            return ad;
        },
        createComment: async (_, { adId, CommentInput }) => {
            const ad = await Ad.findById(adId).populate('comments');
            let tabComments = ad.comments;
            
            const comment = await Comment.create(CommentInput);
            comment.ad = adId

            tabComments.push(comment);

            await Ad.updateOne({_id: adId},{$set: {
                comments: tabComments
            }}
        );
    
            await comment.save();
            return comment;
          },
        deleteAd: async(_parent, args, _context, _info) => {
            const { id } = args;
            await Ad.findByIdAndDelete(id);
            await Comment.deleteMany({ ad: id });
            return 'Ad deleted !';
        },
        updateAd: async(_parent, args, _context, _info) => {
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
    },    
};

module.exports = resolvers;