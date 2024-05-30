fetch('/api/orders')
    .then(response => response.json())
    .then(async data => {
        data.forEach(item => {
            console.log(item);
         })
    })
    .catch(error => {
        console.error(error);
        // Handle errors (display an error message to the user)
    });