const itemList = document.getElementById('item-info');

fetch('/api/item/' + itemID)
    .then(response => response.json())
    .then(data => {
        data.forEach(item => {
            const stock = document.createElement('div');
            stock.innerHTML = item.title

            itemList.appendChild(stock);
        });
    })
    .catch(error => {
        console.error(error);
        // Handle errors (display an error message to the user)
    });