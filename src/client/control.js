fetch('/api/control')
    .then(response => response.json())
    .then(data => {
        const tbody = document.getElementById('item-col');

        data.forEach(item => {
            const row = document.createElement('tr');

            const idCell = document.createElement('td');
            idCell.textContent = item._id;
            row.appendChild(idCell);

            const titleCell = document.createElement('td');
            titleCell.textContent = item.username || 'N/A';
            row.appendChild(titleCell);

            const emailCell = document.createElement('td');
            emailCell.textContent = item.email || 'N/A';
            row.appendChild(emailCell);

            const typeCell = document.createElement('td');
            typeCell.textContent = item.userType || 'N/A';
            row.appendChild(typeCell);

            tbody.appendChild(row);
        });
    })
    .catch(error => {
        console.error(error);
        // Handle errors (display an error message to the user)
    });