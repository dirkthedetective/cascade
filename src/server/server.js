const express = require('express');
const hbs = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path'); // Include the path module

//const userRouter = require('./routes/user'); // assuming your user routes are in a separate file

const app = express();

const Item = require('./models/Item');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/cascade', {
});
// Configure Handlebars
app.set('view engine', '.hbs');

app.engine('hbs', hbs.engine({
  layoutsDir: __dirname + '/../../views/layouts',
  extname: 'hbs'
  }));

app.use(express.static(path.join(__dirname, '../client')));
app.set('view options', { layout: 'layout' });
// Body parser middleware (to handle form data or JSON requests)
app.use(express.json());

app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find(); // Fetch all items from the database
    res.json(items); // Send the list of items as JSON response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/api/item/:itemID', async (req, res) => {
  try {
    const item = Item.find((item) => item.id === req.params.itemID)
    res.json(item); // Send the list of items as JSON response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/api/items', async (req, res) => {
  try {
    const { title, description, artist, genre, type, stock, image, price } = req.body;
    const newItem = new Item({ title, description, artist, genre, type, stock, image, price });
    await newItem.save();
    res.json({ message: 'Item added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/', (req, res) => {
  res.render('index', { title: 'Home' }); 
});

app.get('/restock', (req, res) => {
  res.render('restock', { title: 'Restock' }); 
});

app.get('/register', (req, res) => {
  res.render('register', { title: 'CREATE NEW VESSEL'}); 
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'WELCOME BACK'}); 
});

app.get('/stock', (req, res) => {
  res.render('items', { title: 'Our goodies >B)' });
});

app.get('/item/:itemID', (req, res) => {
  res.render('item', { title: 'Our goodies >B)'});
});

const port = process.env.PORT || 3000; 

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
