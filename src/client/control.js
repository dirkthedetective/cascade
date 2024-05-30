fetch('/api/control')
    .then(response => response.json())
    .then(data => {
        const tbody = document.getElementById('item-col');

        data.forEach(item => {
            console.log(item);
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

            const actionCell = document.createElement('td');
            const rejectButton = document.createElement('button');
            rejectButton.textContent = "Reject";

            rejectButton.addEventListener('click', async (event) => {
                event.preventDefault();

                try {
                    const response = await fetch('/api/users/update', { // Replace with your update endpoint
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: item._id, userType: 'Rejected' }) // Send user ID and new userType
                    });

                    const data = await response.json();

                    if (data.success) {
                        console.log('User rejected successfully!', data.message);
                        // Handle success (e.g., display message, update UI)
                    } else {
                        alert(data.message); // Display any error message from the server
                    }
                    window.location = window.location
                } catch (error) {
                    console.error(error);
                    alert('Error rejecting user!');
                }
            });

            const confirmButton = document.createElement('button');
            confirmButton.textContent = "Confirm";

            confirmButton.addEventListener('click', async (event) => {
                event.preventDefault();

                try {
                    const response = await fetch('/api/users/update', { // Replace with your update endpoint
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: item._id, userType: 'Confirmed' }) // Send user ID and new userType
                    });

                    const data = await response.json();

                    if (data.success) {
                        console.log('User confirmed successfully!', data.message);
                        // Handle success (e.g., display message, update UI)
                    } else {
                        alert(data.message); // Display any error message from the server
                    }
                    window.location = window.location
                } catch (error) {
                    console.error(error);
                    alert('Error confirming user!');
                }
            });
            actionCell.appendChild(rejectButton);
            actionCell.appendChild(confirmButton);
            if (item.userType === "Pending") row.appendChild(actionCell);

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
    const username = document.getElementById('item-username').value;
    const password = document.getElementById('item-password').value;
    const email = document.getElementById('item-email').value;
    const userType = document.getElementById('item-type').value;

    // Extract data from other form fields (category, description, etc.)

    let url = '/api/users';
    let method = 'POST';

    if (clickedButton.name === "button1") { // Assuming button1 is for Add
        // Keep URL and method as POST for adding a new item
    } else if (clickedButton.name === "button2") { // Assuming button2 is for Update
        if (!id) {
            alert('Please enter an item ID for update!');
            return; // Prevent further execution if no ID
        }
        url = `/api/users/${id}`; // Add ID to URL for updating
        method = 'PUT'; // Change method to PUT for update
    } else if (clickedButton.name === "button3") { // Assuming button3 is for Delete
        if (!id) {
            alert('Please enter an item ID for deletion!');
            return; // Prevent further execution if no ID
        }
        url = `/api/users/${id}`; // Add ID to URL for deletion
        method = 'DELETE'; // Change method to DELETE for deletion
    } else {
        console.error('Unexpected button clicked!' + clickedButton.textContent);
        return; // Handle unexpected button clicks (optional)
    }

    const itemData = { username, password, email, userType };

    fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData) // Send data as JSON
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Handle success based on the action (Add, Update, Delete)
                alert(`Item updated successfully!`); // Replace with specific messages
                addItemForm.reset(); // Clear the form after successful actions
                window.location = window.location

            } else {
                alert(data.message); // Display any error message from the server
                addItemForm.reset(); // Clear the form after successful actions
                window.location = window.location
            }
        })
        .catch(error => {
            console.error(error);
            alert('Error processing item!'); // Or display a generic error message
        });
});