const input = document.getElementById("password-input");
const submitButton = document.getElementById("submit-button");
const retryButton = document.getElementById("retry-button");
const popup = document.getElementById("popup");
const status = document.getElementById("status-message");

// Button listeners
submitButton.addEventListener("click", handleSubmit);
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") handleSubmit();
});

retryButton.addEventListener("click", resetApp);

function handleSubmit() {
  const password = input.value;

  if (!password) {
    alert("Please enter a password.");
    return;
  }

  // Hide popup and show status
  popup.style.display = "none";
  status.style.display = "block";
  retryButton.style.display = "none";

  // Update message immediately
  updateStatusMessage("🔍🥷 Attempting to crack your password... 📱🪛");

  // Start cracking
  startCracking(password).then(() => {
    retryButton.style.display = "inline-block";
  });
}

// Make globally available to cracker.js
window.updateStatusMessage = function (text) {
  status.textContent = text;
  status.style.display = "block";
};

// Resets the UI to the initial state
function resetApp() {
  input.value = "";
  popup.style.display = "flex";
  status.style.display = "none";
  retryButton.style.display = "none";
}
