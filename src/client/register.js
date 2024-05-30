const registerForm = document.getElementById('registration-form');

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const email = document.getElementById('email').value;
  const userType = "Pending";

  // Basic form validation (optional)
  if (!username || !password) {
    alert('Please fill in both username and password fields!');
    return;
  }

  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email, userType })
    });

    const data = await response.json();

    if (data.success) {
      alert('Registration successful! Please wait for confirmation.');
      // Clear the form
      registerForm.reset();
    } else {
      alert(data.message); // Display any error message from the server
    }
  } catch (error) {
    console.error(error);
    alert('Error registering user!');
  }
});
