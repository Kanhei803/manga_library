const mongoose = require('mongoose');

// MANGA LIST SCHEMA
const mangaSchema = new mongoose.Schema({
    englishTitle: {
        type: String,
        required: [true, 'Please add the English title.'],
        minLength: 1,
        unique: true
    },
    japaneseTitle: {
        type: String,
		minLength: 1,
        unique: true
    },
    romanjiTitle: {
		type: String,
		required: [true, 'Please add the Romanji title.'],
		minLength: 1,
        unique: true
    },
    file: {
        type: String,
        required: [true, 'Please add an image.']
    },
    publicRating: {
        type: Number,
        required: [true, 'Enter the public rating from myanimelist.com.']
    },
    personalRating: {
        type: Number,
        required: [true, 'Enter your own personal rating.']
    },
    volumeCount: {
        type: Number,
        min: [0, 'Need 1 volume'],
        required: [true, 'Enter the current available volume count.']
    },
    genre: {
        type: Array,
        default: undefined,
        required: [true],
    },
    theme: {
        type: Array,
        default: undefined,
    },
    demographic: {
        type: Array,
        default: undefined,
    },
    authorStory: {
        type: String,
        required: [true],
    },
    authorArtist: {
        type: String,
    },
    description: {
        type: String,
        required: [true],
    },
    releaseDate: {
        type: String,
        required: [true]
    },
    finishedDate: {
        type: String
    },
    completion: {
        type: Boolean,
        required: [true]
    }
})

// EXPORT MODULE
const MangaModelSchema = mongoose.model('Manga', mangaSchema)
module.exports = MangaModelSchema;

// genre: ['Action', 'Adventure', 'Award Winning', 'Yaoi', 'Comedy','Coming of Age', 'Drama', 'Fantasy', 'Yuri', 'Gourmet', 'Horror', 'Mystery', 'Romance', 'Romantic Comedy', 'Sci Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Suspense']

// theme: ['Adult Cast', 'Anthropomorphic', 'CGDCT', 'Childcare', 'Combat Sports', 'Crossdressing', 'Delinquents', 'Detective', 'Educational', 'Gag Humor', 'Gore', 'Harem', 'High Stakes Game', 'Historical', 'Idols (Female)', 'Idols (Male)', 'Isekai', 'Iyashikei', 'Love Polygon', 'Magical Sex Shift', 'Mahou Shojo', 'Martials Arts', 'Mecha', 'Medical', 'Memoir', 'Military', 'Music', 'Mythology', 'Organized Crime', 'Otaku Culture', 'Parody', 'Performing Arts', 'Pets', 'Psychological', 'Racing', 'Reincarnation', 'Reverse Harem', 'Romantic Subtext', 'Samurai', 'School', 'Showbix', 'Space', 'Strategy Game', 'Super Power', 'Survival', 'Team Sports', 'Time Travel', 'Vampire', 'Video Game', 'Villainess', 'Visual Arts', 'Workplace']

// demographic: ['Josei', 'Kids', 'Seinen', 'Shoujo', 'Shounen']