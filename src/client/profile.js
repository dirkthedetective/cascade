const logoutButton = document.getElementById('logout-button');

logoutButton.addEventListener('click', async () => {
  try {
    const response = await fetch('/api/logout', {
      method: 'GET' // Assuming logout uses GET method (adjust if needed)
    });

    const data = await response.json();

    if (data.success) {
      // Logout successful! Clear login flag and redirect
      sessionStorage.removeItem('loggedIn');
      sessionStorage.removeItem('user');
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
const role = document.createElement('div');
role.classList.add('order-pos');
role.innerHTML = "Logged in as confirmed client. You can use our catalogue to make an order!"
info.appendChild(title);
info.appendChild(role);
//info.appendChild(desc);
userInfo.appendChild(info);
if (user.userType == 'Manager') {
  role.innerHTML = "Logged in as manager. Manage database: "
  orders = document.createElement('a');
  orders.href = "/orders"
  orders.innerHTML = "  Manage orders";
  stock = document.createElement('a');
  stock.href = "/restock"
  stock.innerHTML = "  Manage stock";
  role.appendChild(orders);
  role.appendChild(stock);
}
if (user.userType == 'Admin') {
  role.innerHTML = "Logged in as admin. Manage database: "
  control = document.createElement('a');
  control.href = "/control"
  control.innerHTML = "  Manage users";
  role.appendChild(control);
}

fetch('/api/orders')
  .then(response => response.json())
  .then(async data => {
    const tbody = document.getElementById('orders');
    for (let order of data) {
      if (order.user != user._id) continue;
      const response = await fetch('/api/users/' + order.user, {
        method: 'GET'
      });

      const data = await response.json();

      const orderCell = document.createElement('div')
      orderCell.classList.add('order-box');

      const headCell = document.createElement('div')
      orderCell.appendChild(headCell);

      const bodyCell = document.createElement('div')
      bodyCell.classList.add('order-pos');
      orderCell.appendChild(bodyCell);

      let sum = 0;

      for (item of order.items) {
        const row = document.createElement('ul');

        const response2 = await fetch('/api/item/' + item.itemId, {
          method: 'GET'
        });

        const data2 = await response2.json();

        const image = document.createElement('img');
        image.classList.add('logo');
        image.src = data2.image;
        row.appendChild(image);

        const titleCell = document.createElement('li');
        titleCell.textContent = data2.title || 'N/A';
        row.appendChild(titleCell);

        const quantityCell = document.createElement('li');
        quantityCell.textContent = item.quantity + " items" || 'N/A';
        row.appendChild(quantityCell);

        const priceCell = document.createElement('li');
        priceCell.textContent = item.quantity * data2.price + "$" || 'N/A';
        row.appendChild(priceCell);

        sum += data2.price;

        bodyCell.appendChild(row);
      }

      headCell.textContent = "Order #" + order._id + " | Status: " + order.status + " | Total: " + sum + "$";

      const actionCell = document.createElement('div');
      actionCell.classList.add('order-pos');
      const rejectButton = document.createElement('button');
      rejectButton.textContent = "Cancel";

      rejectButton.addEventListener('click', async (event) => {
        event.preventDefault();

        try {
          const response = await fetch('/api/orders/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: order._id, status: 'returned' })
          });

          const data = await response.json();

          if (data.success) {
            console.log('Order returned successfully!', data.message);
            // Handle success (e.g., display message, update UI)
          } else {
            window.location = window.location
            alert(data.message); // Display any error message from the server
          }
        } catch (error) {
          console.error(error);
          alert('Error returning order!');
        }
      });

      actionCell.appendChild(rejectButton);
      if (order.status == 'pending') orderCell.appendChild(actionCell);
      //if (item.userType === "Pending") row.appendChild(actionCell);

      tbody.appendChild(orderCell);
    };
  })
  .catch(error => {
    console.error(error);
    // Handle errors (display an error message to the user)
  });