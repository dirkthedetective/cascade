const express = require('express');
const hbs = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path'); // Include the path module
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();

const Item = require('./models/Item');
const User = require('./models/User');
const Order = require('./models/Order');

const managerRoutes = require('./routes/managerRoutes');

app.use(session({
  secret: 'cookiedough',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  cart: []
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
app.use(express.json());

function isManager(req) {
  // Check session data or other authentication mechanism for userType
  return req.session && req.session.user && req.session.user.userType === 'Manager';
}


app.use((req, res, next) => {
  if (managerRoutes.includes(req.path) && !isManager(req)) {
    res.status(403).send('Unauthorized'); // Send unauthorized response
  } else {
    next(); // Continue processing the request
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    var { userId, cart } = req.body;
    if (cart.length > 0) {
      const newOrder = new Order({ user: userId, items: cart });
      await newOrder.save();

      for (const element of cart) {
        var item;
        await Item.findById(element.itemId).exec().then((result) => {
          item = result;
        })
        item.stock -= element.quantity;
        item.save();
      }

      res.json({ message: 'Order added successfully' });
    }
    else {
      res.status(500).json({ message: 'The cart is empty!' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

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

app.post('/api/users/update', async (req, res) => {
  const { userId, userType } = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, { userType }, { new: true }); // Update and return updated user

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, message: 'User updated successfully!', user }); // Send updated user data (optional)
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
    req.session.user = user;
    res.json({ success: true, message: 'Login successful!', user: user });
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
  res.render('register', { title: 'CREATE NEW VESSEL' });
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'WELCOME BACK' });
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
  res.render('item', { title: 'Our goodies >B)' });
});

app.get('/reject', (req, res) => {
  res.render('reject', { title: 'GO AWAY' });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
