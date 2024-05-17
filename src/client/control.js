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