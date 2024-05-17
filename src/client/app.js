fetch('/api/items')
    .then(response => response.json())
    .then(data => {
        const tbody = document.getElementById('item-col');

        data.forEach(item => {
            const row = document.createElement('tr');

            const idCell = document.createElement('td');
            idCell.textContent = item._id;
            row.appendChild(idCell);

            const titleCell = document.createElement('td');
            titleCell.textContent = item.title || 'N/A';
            row.appendChild(titleCell);

            const descriptionCell = document.createElement('td');
            descriptionCell.textContent = item.description || 'N/A';
            row.appendChild(descriptionCell);

            const artistCell = document.createElement('td');
            artistCell.textContent = item.artist || 'N/A';  // Display 'N/A' if artist is missing
            row.appendChild(artistCell);

            const genreCell = document.createElement('td');
            genreCell.textContent = item.genre || 'N/A';
            row.appendChild(genreCell);

            const typeCell = document.createElement('td');
            typeCell.textContent = item.type || 'N/A';
            row.appendChild(typeCell);

            const stockCell = document.createElement('td');
            stockCell.textContent = item.stock || 'N/A';
            row.appendChild(stockCell);

            const imageCell = document.createElement('td');
            const image = document.createElement('img');
            image.classList.add('item-image');
            image.src = item.image;
            imageCell.appendChild(image);
            row.appendChild(imageCell);

            const priceCell = document.createElement('td');
            priceCell.textContent = `$${item.price.toFixed(2)}`;  // Format price with dollar sign and 2 decimals
            row.appendChild(priceCell);

            tbody.appendChild(row);
        });
    })
    .catch(error => {
        console.error(error);
        // Handle errors (display an error message to the user)
    });


const addItemForm = document.getElementById('add-item-form');

addItemForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const clickedButton = document.activeElement
    const id = document.getElementById('item-id').value;
    const title = document.getElementById('item-title').value;
    const description = document.getElementById('item-description').value;
    const artist = document.getElementById('item-artist').value;
    const genre = document.getElementById('item-genre').value;
    const type = document.getElementById('item-type').value;
    const stock = document.getElementById('item-stock').value;
    const image = document.getElementById('item-image').value;
    const price = document.getElementById('item-price').value;

    // Extract data from other form fields (category, description, etc.)

    let url = '/api/items';
    let method = 'POST';

    if (clickedButton.name === "button1") { // Assuming button1 is for Add
        // Keep URL and method as POST for adding a new item
    } else if (clickedButton.name === "button2") { // Assuming button2 is for Update
        if (!id) {
            alert('Please enter an item ID for update!');
            return; // Prevent further execution if no ID
        }
        url = `/api/items/${id}`; // Add ID to URL for updating
        method = 'PUT'; // Change method to PUT for update
    } else if (clickedButton.name === "button3") { // Assuming button3 is for Delete
        if (!id) {
            alert('Please enter an item ID for deletion!');
            return; // Prevent further execution if no ID
        }
        url = `/api/items/${id}`; // Add ID to URL for deletion
        method = 'DELETE'; // Change method to DELETE for deletion
    } else {
        console.error('Unexpected button clicked!' + clickedButton.textContent);
        return; // Handle unexpected button clicks (optional)
    }

    const itemData = { title, description, artist, genre, type, stock, image, price };

    fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData) // Send data as JSON
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Handle success based on the action (Add, Update, Delete)
                alert(`Item ${clickedButton.textContent} successfully!`); // Replace with specific messages
                addItemForm.reset(); // Clear the form after successful actions
                window.location = window.location
                alert("govno")
            } else {
                alert(data.message); // Display any error message from the server
            }
        })
        .catch(error => {
            console.error(error);
            alert('Error processing item!'); // Or display a generic error message
        });
});