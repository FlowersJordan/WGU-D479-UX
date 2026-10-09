// Taniti Island - script.js
// Two jobs: (1) open/close the mobile menu, (2) validate the booking form.

// ---------- 1. MOBILE MENU ----------
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

navToggle.addEventListener("click", function () {
  const isOpen = mainNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
});

// Close the menu after tapping a link
mainNav.addEventListener("click", function (event) {
  if (event.target.tagName === "A") {
    mainNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

// ---------- 2. BOOKING FORM ----------
// This script is loaded on every page, but the form only exists on book.html.
const form = document.getElementById("bookingForm");
const result = document.getElementById("formResult");

// Don't allow dates in the past
if (form) {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("checkin").min = today;
  document.getElementById("checkout").min = today;
}

// Show or clear an error under a field
function setError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const errorBox = document.getElementById(fieldId + "Error");
  errorBox.textContent = message;
  input.classList.toggle("invalid", message !== "");
}

if (form) form.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const checkin = document.getElementById("checkin").value;
  const checkout = document.getElementById("checkout").value;
  const guests = Number(document.getElementById("guests").value);
  const stayType = document.getElementById("stayType");

  let valid = true;
  result.textContent = "";
  result.classList.remove("show");

  // Name
  if (name === "") {
    setError("name", "Enter your full name.");
    valid = false;
  } else {
    setError("name", "");
  }

  // Email (simple pattern check)
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    setError("email", "Enter a valid email, like name@example.com.");
    valid = false;
  } else {
    setError("email", "");
  }

  // Dates
  if (checkin === "") {
    setError("checkin", "Choose an arrival date.");
    valid = false;
  } else {
    setError("checkin", "");
  }

  if (checkout === "") {
    setError("checkout", "Choose a departure date.");
    valid = false;
  } else if (checkin !== "" && checkout <= checkin) {
    setError("checkout", "Departure must be after arrival.");
    valid = false;
  } else {
    setError("checkout", "");
  }

  // Guests
  if (guests < 1 || guests > 4 || Number.isNaN(guests)) {
    setError("guests", "Choose between 1 and 4 guests.");
    valid = false;
  } else {
    setError("guests", "");
  }

  if (!valid) return;

  // Work out the number of nights and the estimated total
  const msPerDay = 1000 * 60 * 60 * 24;
  const nights = Math.round((new Date(checkout) - new Date(checkin)) / msPerDay);
  const nightlyRate = Number(stayType.value);
  const total = nights * nightlyRate;
  const stayName = stayType.options[stayType.selectedIndex].text.split(" (")[0];

  result.textContent =
    "Thanks, " + name.split(" ")[0] + ". We received your request for " +
    nights + (nights === 1 ? " night" : " nights") + " in the " +
    stayName.toLowerCase() + ". Estimated total: $" + total +
    ". We will email " + email + " within two days.";
  result.classList.add("show");

  form.reset();
  document.getElementById("guests").value = 2;
});
