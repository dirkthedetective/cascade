
const registerButton = document.querySelector('li a[href="/register"]'); // Select the register link

registerButton.addEventListener('click', (event) => {
  // Check if user is logged in (replace with your actual logic)
  if (!isLoggedIn()) {
    // User not logged in, proceed with redirection
    return true;
  } else {
    // User logged in, redirect to profile
    event.preventDefault(); // Prevent default link behavior
    window.location.href = "/profile"; // Redirect to profile page
  }
});

// Function to check login status (replace with your implementation)
function isLoggedIn() {
  // Check user session storage, local storage, or cookies
  // for a token or user data indicating logged in state
  // This example assumes a "loggedIn" key in session storage
  return !!sessionStorage.getItem('loggedIn');
}