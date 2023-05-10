// IMPORT MODULES
const express = require('express');
const app = express();
const path = require('path');
const crypto = require('crypto');
const multer = require('multer')
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const MangaModel = require('./models/mangaSchema');
const mangaData = require('./models/mangaDB.json');
const UserModel = require('./models/userSchema');

// PORT NUMBER
const PORT = 8080;

// MONGOOSE CONNECTION
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dbUrl = "mongodb+srv://Kenhie_Manga:Yuru1camp2is3the4best5@mangaapp.87cpygr.mongodb.net/manga_db";
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
    
mongoose.connect(dbUrl, connectionParams)
.then(() => {
    console.log("Connected to the MangaDB");
})
.catch((e) => {
    console.log("Error", e);
})

// MIDDLEWARE
app.engine('ejs', ejsMate)
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');

// Init gfs
let gfs;

const conn = mongoose.createConnection(dbUrl)

conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
})

// @desc: Variables to use
const genre = ['Action', 'Adventure', 'Award Winning', 'Comedy', 'Coming of Age', 'Drama', 'Fantasy', 'Gourmet', 'Horror', 'Mystery', 'Romance', 'Romantic Comedy', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Suspense', 'Yaoi', 'Yuri']
const theme = ['Adult Cast', 'Anthropomorphic', 'CGDCT', 'Childcare', 'Combat Sports', 'Crossdressing', 'Delinquents', 'Detective', 'Educational', 'Gag Humor', 'Gore', 'Harem', 'High Stakes Game', 'Historical', 'Idols (Female)', 'Idols (Male)', 'Isekai', 'Iyashikei', 'Love Polygon', 'Magical Sex Shift', 'Mahou Shojo', 'Martials Arts', 'Mecha', 'Medical', 'Memoir', 'Military', 'Music', 'Mythology', 'Organized Crime', 'Otaku Culture', 'Parody', 'Performing Arts', 'Pets', 'Psychological', 'Racing', 'Reincarnation', 'Reverse Harem', 'Romantic Subtext', 'Samurai', 'School', 'Showbix', 'Space', 'Strategy Game', 'Super Power', 'Survival', 'Team Sports', 'Time Travel', 'Vampire', 'Video Game', 'Villainess', 'Visual Arts', 'Workplace']
const demographic = ['Josei', 'Kids', 'Seinen', 'Shoujo', 'Shounen']

// @desc: Create storage engine
const storage = new GridFsStorage({
    url: dbUrl,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString("hex") + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: "uploads"
          };
          resolve(fileInfo);
        });
      });
    }
  });
  const upload = multer({ storage });

// @route GET /
// @desc: Loads form
app.get('/', (req, res) => {
    res.render('index');
});

//
//
app.get('/secret', isLoggedIn, (req, res) => {
    res.render('secret')
})

// @route POST /upload
// @desc: Uploads file to DB
app.post('/upload', upload.single('file'), (req, res) => {
    res.redirect('/');
});

// @route GET /files
// @desc: Display all files in JSON
app.get('/files', (req, res) => {
    gfs.files.find()((err, files) => {
        if(!files || files.length === 0) {
            return res.status(404).json({
                err: 'No files exist'
            });
        }
        return console.log(files);
    });
});

// @route GET /login
// desc: Rendering the login page
app.get('/login', (req,res) => {
    res.render('login')
});

// @route POST /auth
// desc: Check if user + password exist
app.post("/auth", async function(req, res){
    try {
        // check if the user exists
        const user = await UserModel.findOne({ username: req.body.username });
        if (user) {
          //check if password matches
          const result = req.body.password === user.password;
          if (result) {
            console.log('It worked!')
            res.redirect('secret');
          } else {
            res.status(400).json({ error: "password doesn't match" });
          }
        } else {
          res.status(400).json({ error: "User doesn't exist" });
        }
      } catch (error) {
        res.status(400).json({ error });
      }
});

// @route GET /signup
// desc: Rendering the signup page
app.get('/signup', (req,res) => {
    res.render('signup')
});

// @route POST /singup
// desc: Adding a user into the DB
app.post('/signup', async (req, res) => {
    const NewUser = new UserModel(req.body)
    await NewUser.save()
    .then(() => {
        console.log("User as been saved into DB!");
    })
    .catch((err) => {
        console.log(err);
    })
    res.send("It worked?")
});

// @route GET /mangas
// desc: Rendering all manga page
app.get('/mangas', async (req,res) => {
    const titles = await MangaModel.find().sort({englishTitle: 1})
    res.render('mangas/index', { titles })
});

// POST NEW MANGA INTO DB
// desc: Adding new manga into DB
app.post('/mangasNew', upload.single('file'), async (req, res) => {
    const SaveManga = new MangaModel(req.body)
    await SaveManga.save() 
    .then(() => {
        console.log("It worked!");
    }) 
    .catch((err) => {
        console.log(err)
    })
    res.redirect('mangas')
});

// GET ADD NEW MANGA PAGE
app.get('/mangas/new', async (req, res) => {
    const { id } = req.params;
    const manga = await MangaModel.findById(id);
    res.render('mangas/new', { manga, genre, theme, demographic })
});

// @route GET edit page
// desc: get the edit page of each manga
app.get('/mangas/:id/edit', async (req, res) => {
    const { id } = req.params;
    const manga = await MangaModel.findById(id);
    res.render('mangas/edit', { manga, genre, theme, demographic })
});

// @route /mangas/:id
// desc: Edit info in specific manga.
app.put('/mangas/:id', async (req, res) => {
    const { id } = req.params;
    const manga = await MangaModel.findByIdAndUpdate(id, { ...req.body.manga });
    res.redirect('mangas', {manga, genre, theme, demographic})
});

// SPECIFIC MANGA PAGE
app.get('/mangas/:id', async (req, res) => {
    const { id } = req.params;
    const manga = await MangaModel.findById(id)
    res.render('mangas/show', { manga })
});

// @route GET /inserted
// @desc refill DB with entires using json file
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
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}

// @route USE
// Error Page if not found 
app.use((req, res) => {
    res.status(404).send("APP NOT FOUND!")
})

// PORT LISTEN
app.listen(PORT, () => {
    console.log(`Manga App listening on port ${PORT}`)
});

