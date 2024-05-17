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
            if (data.user && (data.user.userType === 'Pending' || data.user.userType === 'Rejected')) {
                window.location.href = "/reject";
            } else {
                window.location.href = "/profile";
                sessionStorage.setItem('loggedIn', true);
                sessionStorage.setItem('user', JSON.stringify(data.user));
                sessionStorage.setItem('cart', JSON.stringify([]));
                console.log('Login successful!', data.message);
            }
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error(error);
        alert('Error logging in!');
    }
});