const logoutButton = document.getElementById('logout-button');

logoutButton.addEventListener('click', async () => {
  try {
    const response = await fetch('/api/users/logout', {
      method: 'GET' // Assuming logout uses GET method (adjust if needed)
    });

    const data = await response.json();

    if (data.success) {
      // Logout successful! Clear login flag and redirect
      sessionStorage.removeItem('loggedIn');
      console.log('Logout successful!', data.message);
      window.location.href = "/"; // Redirect to home page (or adjust)
    } else {
      alert(data.message); // Display any error message from the server
    }
  } catch (error) {
    console.error(error);
    alert('Error logging out!');
  }
});
