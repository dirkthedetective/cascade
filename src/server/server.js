const express = require('express');
const hbs = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path'); // Include the path module
const bcrypt = require('bcrypt');
const session = require('express-session');

//const userRouter = require('./routes/user'); // assuming your user routes are in a separate file

const app = express();

const Item = require('./models/Item');
const User = require('./models/User');

app.use(session({
  secret: 'your_session_secret', // Replace with a strong secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true for HTTPS connections
}));

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
    var item;
    await Item.findById(req.params.itemID).exec().then((result) => {
      item = result;
   })
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/api/items', async (req, res) => {
  try {
    var { title, description, artist, genre, type, stock, image, price } = req.body;
    if (stock === '') stock = 0;
    if (price === '') price = 0;
    const newItem = new Item({ title, description, artist, genre, type, stock, image, price });
    await newItem.save();
    res.json({ message: 'Item added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.put('/api/items/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    const { title, description, artist, genre, type, stock, image, price } = req.body;

    // Find the item to update
    const itemToUpdate = await Item.findById(itemId);

    if (!itemToUpdate) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Update properties of the item
    if (title != '') itemToUpdate.title = title;
    if (description != '') itemToUpdate.description = description;
    if (artist != '') itemToUpdate.artist = artist;
    if (genre != '') itemToUpdate.genre = genre;
    if (type != '') itemToUpdate.type = type;
    if (stock != '') itemToUpdate.stock = stock;
    if (image != '') itemToUpdate.image = image;
    if (price != '') itemToUpdate.price = price;

    // Save the updated item
    await itemToUpdate.save();

    res.json({ message: 'Item updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    const itemId = req.params.id;

    // Find the item to delete
    const itemToDelete = await Item.findById(itemId);

    if (!itemToDelete) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Delete the item
    await itemToDelete.delete();

    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/api/users', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Check for existing username or email
    const existingUsername = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists!' });
    }
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists!' });
    }

    // Create new user with hashed password
    const newUser = new User({ username, password, email, userType: 'Pending' });
    await newUser.save();

    res.json({ success: true, message: 'Registration successful!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/api/users/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Login successful! (Handle user session or token)
    res.json({ success: true, message: 'Login successful!', user: user }); // Example: send user data for further processing
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/api/users/logout', async (req, res) => {
  try {
    // Handle logout logic (e.g., invalidate session, remove cookies)
    req.session.destroy(); // Example: Destroy session on logout (if using sessions)

    res.json({ success: true, message: 'Logout successful!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/api/control', async (req, res) => {
  try {
    const items = await User.find(); // Fetch all items from the database
    res.json(items); // Send the list of items as JSON response
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

app.get('/profile', (req, res) => {
  res.render('profile', { title: 'YOUR HUMBLE ABODE' });
});

app.get('/control', (req, res) => {
  res.render('control', { title: 'JUDGEMENT DAY' });
});

app.get('/item/:itemID', (req, res) => {
  res.render('item', { title: 'Our goodies >B)'});
});

const port = process.env.PORT || 3000; 

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
