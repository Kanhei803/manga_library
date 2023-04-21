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

app.get('/about', (req,res) => {
    res.render('about')
})

app.get('/login', (req,res) => {
    res.render('login')
})

app.get('/signup', (req,res) => {
    res.render('signup')
})

app.get('/mangas', async (req,res) => {
    const titles = await MangaModel.find()
    res.render('mangas/index', { titles })
})

app.get('/mangas/new', (req, res) => {
    res.render('mangas/new')
})

app.post('/mangas', async(req, res) => {
    const newManga = new MangaList(req.body);
    console.log(newManga)
    res.send("Yay")
    await newManga.save()
    res.redirect("/mangas")
})

app.get('/mangas/:id', async (req, res) => {
    const { id } = req.params;
    const manga = await MangaModel.findById(id)
    res.render('mangas/show', { manga })
})

app.get('/mangas/update/:id', async (req, res) => {
    const { id } = req.params;
    const manga = await MangaModel.findById();
    res.render('mangas/update', { manga })
})

app.get('/inserted', async (req, res) => {
    // await (MangaModel.insertMany(mangaData.mangas[2]))
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


app.listen(PORT, () => {
    console.log(`Manga App listening on port ${PORT}`)
})

