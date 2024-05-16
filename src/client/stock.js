const itemList = document.getElementById('film-row');

fetch('/api/items')
    .then(response => response.json())
    .then(data => {
        data.forEach(item => {
            const stock = document.createElement('div');
            const link = document.createElement('a');
            link.href="/item/" + item._id;
            const image = document.createElement('img');
            image.classList.add('row-image');
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