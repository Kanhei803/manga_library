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

const MangaModel = mongoose.model('Manga', mangaSchema)

module.exports = MangaModel;

// INSERT NEW DATA INTO DB
// app.get('/inserted', async (req, res) => {
//     let mangaModel = new MangaModel()
//     mangaModel.title = "Spy X Family"
//     mangaModel.publicRating = 8.6
//     mangaModel.personalRating = 9.5
//     mangaModel.volumeCount = 11
//     mangaModel.genre = ["Action", "Comedy"]
//     mangaModel.description = "For the agent known as `Twilight,` no order is too tall if it is for the sake of peace. Operating as Westalis' master spy, Twilight works tirelessly to prevent extremists from sparking a war with neighboring country Ostania. For his latest mission, he must investigate Ostanian politician Donovan Desmond by infiltrating his son's school: the prestigious Eden Academy. Thus, the agent faces the most difficult task of his career: get married, have a child, and play family" 
//     mangaModel.completion = false

//     await mangaModel.save()
//         .then(() => {
//             console.log(``);
//         })
//         .catch((err) => {
//             console.log(err);
//         })
//     })