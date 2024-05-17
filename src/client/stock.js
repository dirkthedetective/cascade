const itemList = document.getElementById('film-row');
const itemList2 = document.getElementById('film-row2');
const itemList3 = document.getElementById('film-row3');

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

            if (item.type == 'CD') itemList.appendChild(stock);
            
            if (item.type == 'DVD') itemList2.appendChild(stock);
            
            if (item.type == 'Cassette') itemList3.appendChild(stock);
        });
    })
    .catch(error => {
        console.error(error);
        // Handle errors (display an error message to the user)
    });