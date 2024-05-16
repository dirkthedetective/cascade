
const itemList = document.getElementById('items');

fetch('/api/items')
    .then(response => response.json())
    .then(data => {
        const tbody = document.getElementById('item-col');

        data.forEach(item => {
            const row = document.createElement('tr');

            const titleCell = document.createElement('td');
            titleCell.textContent = item.title;
            row.appendChild(titleCell);

            const descriptionCell = document.createElement('td');
            descriptionCell.textContent = item.description;
            row.appendChild(descriptionCell);

            const artistCell = document.createElement('td');
            artistCell.textContent = item.artist || 'N/A';  // Display 'N/A' if artist is missing
            row.appendChild(artistCell);

            const genreCell = document.createElement('td');
            genreCell.textContent = item.genre;
            row.appendChild(genreCell);

            const typeCell = document.createElement('td');
            typeCell.textContent = item.type;
            row.appendChild(typeCell);

            const stockCell = document.createElement('td');
            stockCell.textContent = item.stock;
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

    const title = document.getElementById('item-title').value;
    const description = document.getElementById('item-description').value;
    const artist = document.getElementById('item-artist').value;
    const genre = document.getElementById('item-genre').value;
    const type = document.getElementById('item-type').value;
    const stock = document.getElementById('item-stock').value;
    const image = document.getElementById('item-image').value;
    const price = document.getElementById('item-price').value;

    // Extract data from other form fields (category, description, etc.)

    const itemData = { title, description, artist, genre, type, stock, image, price }; // Assuming other data from form fields

    fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData) // Send data as JSON
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Item added successfully
                alert('Item added!'); // Or update UI to show success message
                // Clear the form
                addItemForm.reset();
            } else {
                alert(data.message); // Display any error message from the server
            }
        })
        .catch(error => {
            console.error(error);
            alert('Error adding item!'); // Or display a generic error message
        });
});