const loginForm = document.getElementById('registration-form'); // Assuming the ID remains the same

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            sessionStorage.setItem('loggedIn', true);
            console.log('Login successful!', data.message); 
            window.location.href = "/profile";
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error(error);
        alert('Error logging in!');
    }
});