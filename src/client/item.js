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
            promo.innerHTML = data.stock + " in stock - buy this "+ data.type + " today only for " + data.price + "$!"

            itemList.appendChild(image)
            info.appendChild(title)
            info.appendChild(desc)
            info.appendChild(genre)
            info.appendChild(artist)
            info.appendChild(document.createElement('br'))

            info.appendChild(promo)
            itemList.appendChild(info);
    })
    .catch(error => {
        console.error(error);
        // Handle errors (display an error message to the user)
    });