const mongoose = require('mongoose');
const mangaSchema = new mongoose.Schema({
	title:{
		type: String,
		required: [true],
		minLength: 3,
        maxLength: 30
    },
    publicRating:{
        type: Number,
        required: [true]
    },
    personalRating:{
        type: Number,
        required: [true]
    },
    volumeCount:{
        type: Number,
        min: [0, 'Need 1 volume'],
        required: [true]
    },
    genre:{
        type: Array,
        default: undefined,
        required: [true],        
    },
    description:{
        type: String,
        required: [true],
    },
    completion:{
        type: Boolean,
        required: [true]
    }
})