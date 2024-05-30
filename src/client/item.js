const itemList = document.getElementById('item-info');
const itemID = window.location.pathname.split('/').pop();

fetch('/api/item/' + itemID)
    .then(response => response.json())
    .then(data => {
        const info = document.createElement('div');
        info.classList.add('item-content');
        const image = document.createElement('img');
        image.classList.add('full-image');
        image.src = data.image;
        const title = document.createElement('h1');
        title.innerHTML = data.title
        const desc = document.createElement('div');
        desc.innerHTML = data.description
        const genre = document.createElement('div');
        genre.innerHTML = "Genre: " + data.genre
        const artist = document.createElement('div');
        artist.innerHTML = "Created by " + data.artist

        const promo = document.createElement('h1');
        promo.innerHTML = data.stock + " in stock - buy this " + data.type + " today only for " + data.price + "$!"

        const addButton = document.createElement('button');
        addButton.textContent = "Add to order!";
        addButton.style = "margin: auto 0; width = 80px;"

        const amount = document.createElement('input');
        amount.id = 'quantity';
        amount.size = 12;

        let cart = retrieveCartFromSession();

        addButton.addEventListener('click', () => {
            const itemId = data._id; // Replace with logic to get item ID
            const quantity = document.getElementById('quantity').value; // Assuming quantity input
          
            // Check if item already exists in cart
            const existingItem = cart.find(item => item.itemId === itemId);
          
            if (existingItem) {
              existingItem.quantity += parseInt(quantity); // Update quantity
            } else {
              cart.push({ itemId, quantity: parseInt(quantity) }); // Add new item
            }
          
            storeCartInSession(cart); // Update cart in session storage
            
            alert(quantity + " copies of " + data.title + " added to cart!");
            // Update cart display on the page
            //updateCartDisplay(cart);
          });

        function retrieveCartFromSession() {
            try {
                const cartData = sessionStorage.getItem('cart');
                return cartData ? JSON.parse(cartData) : []; // Parse or return empty array
            } catch (error) {
                console.error('Error retrieving cart from session:', error);
                return []; // Return empty array on error
            }
        }

        function storeCartInSession(cart) {
            try {
                sessionStorage.setItem('cart', JSON.stringify(cart));
            } catch (error) {
                console.error('Error storing cart in session:', error);
            }
        }


        itemList.appendChild(image)
        info.appendChild(title)
        info.appendChild(desc)
        info.appendChild(genre)
        info.appendChild(artist)
        info.appendChild(document.createElement('br'))

        info.appendChild(promo)

        info.appendChild(document.createElement('br'))
        user = sessionStorage.getItem('user');
        console.log(user);
        if (user) {
            info.appendChild(amount)
            info.appendChild(addButton)
        }

        itemList.appendChild(info);
    })
    .catch(error => {
        console.error(error);
        // Handle errors (display an error message to the user)
    });
