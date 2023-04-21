// IMPORT MODULES
const express = require('express');
const app = express();
const MangaModel = require('./models/mangaSchema');
const mangaData = require('./models/mangaDB.json')

// PORT NUMBER
const PORT = 8080;

// MONGOOSE CONNECTION
const mongoose = require('mongoose');
const dbUrl = "mongodb+srv://Kenhie_Manga:Yuru1camp2is3the4best5@mangaapp.87cpygr.mongodb.net/manga_db";
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(dbUrl, connectionParams)
.then(() => {
    console.log("Connected to the MangaDB");
})
.catch((e) => {
    console.log("Error", e);
})

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));

// SET VIEW ENGINE
app.set('view engine', 'ejs');

// INDEX PAGE
app.get('/', (req, res) => {
    res.render('index')
})

// ABOUT PAGE
app.get('/about', (req,res) => {
    res.render('about')
})

// LOGIN PAGE
app.get('/login', (req,res) => {
    res.render('login')
})

// SIGN UP PAGE
app.get('/signup', (req,res) => {
    res.render('signup')
})

// ALL MANGA LIST PAGE
app.get('/mangas', async (req,res) => {
    const titles = await MangaModel.find().sort({englishTitle: 1})
    res.render('mangas/index', { titles })
})

// ADD NEW MANGA PAGE
app.get('/mangas/new', async (req, res) => {
    const { id } = req.params;
    const manga = await MangaModel.find(id);
    res.render('mangas/new', { manga })
})

// POST NEW MANGA INTO DB
app.post('/mangas', async (req, res) => {
    const SaveManga = new MangaModel(req.body)
    await SaveManga.save() 
    .then(() => {
        console.log("It worked!");
    }) 
    .catch((err) => {
        console.log(err)
    })
    res.redirect('/mangas/index')
})

// INDIVIDUAL MANGA UPDATE PAGE
app.get('/mangas/update/:id', async (req, res) => {
    const { id } = req.params;
    const manga = await MangaModel.findById(id);
    res.render('mangas/update', { manga })
})

// POST UPDATES TO MANGA 
app.post('/mangas/update/:id', async (req, res) => {
        // const { id } = req.params;
        // const manga = await MangaModel.findById(id)
        // res.render('mangas/update')
    })

// SPECIFIC MANGA PAGE
app.get('/mangas/:id', async (req, res) => {
    const { id } = req.params;
    const manga = await MangaModel.findById(id)
    res.render('mangas/show', { manga })
})

// USE JSON DATABASE TO REUPLOAD INTO MONGO ATLAS DB
app.get('/inserted', async (req, res) => {
    for (let i = 0; i < mangaData.mangas.length; i++){
        await (MangaModel.insertMany(mangaData.mangas[i]))
        .then(() => {
            console.log("It worked!");
        })
        .catch((err) => {
            console.log(err);
        })
    }
    res.redirect('mangas')
})

// PORT LISTEN
app.listen(PORT, () => {
    console.log(`Manga App listening on port ${PORT}`)
})

