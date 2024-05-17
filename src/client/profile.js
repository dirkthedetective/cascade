const logoutButton = document.getElementById('logout-button');

logoutButton.addEventListener('click', async () => {
  try {
    const response = await fetch('/api/users/logout', {
      method: 'GET' // Assuming logout uses GET method (adjust if needed)
    });

    const data = await response.json();

    if (data.success) {
      // Logout successful! Clear login flag and redirect
      sessionStorage.removeItem('loggedIn');
      console.log('Logout successful!', data.message);
      window.location.href = "/"; // Redirect to home page (or adjust)
    } else {
      alert(data.message); // Display any error message from the server
    }
  } catch (error) {
    console.error(error);
    alert('Error logging out!');
  }
});

const orderButton = document.getElementById('order');

orderButton.addEventListener('click', async (event) => {
  event.preventDefault();

  try {
    const cart = JSON.parse(sessionStorage.getItem('cart'));
    const userId = JSON.parse(sessionStorage.getItem('user'))._id;

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userId, cart: cart })// Send user ID and new userType
    });

    const data = await response.json();

    if (data.success) {
      console.log('Order made successfully!', data.message);
      // Handle success (e.g., display message, update UI)
    } else {
      sessionStorage.setItem('cart', JSON.stringify([]));
      alert(data.message); // Display any error message from the server
    }
  } catch (error) {
    console.error(error);
    alert('Error making order!');
  }
});

const itemList = document.getElementById('film-row');

fetch('/api/items')
  .then(response => response.json())
  .then(data => {
    let cart = sessionStorage.getItem('cart');
    cart = JSON.parse(cart);
    console.log(typeof cart)
    console.log(cart);
    data.forEach(item => {
      const itemExists = cart.find(item2 => item2.itemId === item._id);
      if (!itemExists) return;
      const stock = document.createElement('div');
      const link = document.createElement('a');
      link.href = "/item/" + item._id;
      const image = document.createElement('img');
      image.classList.add('item-image');
      image.src = item.image;
      link.appendChild(image);
      stock.appendChild(link);

      itemList.appendChild(stock);
    });
  })
  .catch(error => {
    console.error(error);
    // Handle errors (display an error message to the user)
  });

const userInfo = document.getElementById('user-info');

user = sessionStorage.getItem('user');
user = JSON.parse(user);
const info = document.createElement('div');
info.classList.add('item-content');
const title = document.createElement('h1');
title.innerHTML = "Welcome back, " + user.username + "!";
const desc = document.createElement('div');
desc.innerHTML = user.email
info.appendChild(title);
//info.appendChild(desc);
userInfo.appendChild(info);