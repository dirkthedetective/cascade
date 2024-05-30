fetch('/api/items')
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