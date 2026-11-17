// ===================================================
// Authentication Logic (index.html)
// Handles Google Sign-In and Basic User Profile
// ===================================================

const googleLoginBtn = document.getElementById("google-login-btn");
const loginSection = document.getElementById("login-section");
const profileSection = document.getElementById("profile-section");
const saveProfileBtn = document.getElementById("save-profile-btn");

let currentUser = null;

// Check if user is already signed in
auth.onAuthStateChanged((user) => {
  if (user) {
    currentUser = user;
    const savedPhone = localStorage.getItem("userPhone_" + user.uid);
    if (savedPhone) {
      window.location.href = "feed.html"; // Redirect directly to feed
    } else {
      // Check if profile is already saved in Firestore
      db.collection("users").doc(user.uid).get().then((doc) => {
        if (doc.exists && doc.data().phone) {
          localStorage.setItem("userPhone_" + user.uid, doc.data().phone);
          localStorage.setItem("userRole_" + user.uid, doc.data().role || "Donor");
          window.location.href = "feed.html";
        } else {
          // First-time user: Show profile setup form
          loginSection.style.display = "none";
          profileSection.style.display = "block";
        }
      }).catch(() => {
        loginSection.style.display = "none";
        profileSection.style.display = "block";
      });
    }
  }
});

// Trigger Google Sign-In Popup
googleLoginBtn.addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch((error) => {
    alert("Sign-In Error: " + error.message);
  });
});

// Save Profile Info and proceed to Feed
saveProfileBtn.addEventListener("click", () => {
  const phone = document.getElementById("user-phone").value.trim();
  const role = document.getElementById("user-role").value;

  // Basic 10-digit number validation
  if (phone.length !== 10 || isNaN(phone)) {
    alert("Please enter a valid 10-digit phone number (numbers only).");
    return;
  }

  // Save in local storage and Firestore for easy access
  localStorage.setItem("userPhone_" + currentUser.uid, phone);
  localStorage.setItem("userRole_" + currentUser.uid, role);

  db.collection("users").doc(currentUser.uid).set({
    name: currentUser.displayName || "User",
    email: currentUser.email || "",
    photo: currentUser.photoURL || "",
    phone: phone,
    role: role
  }).then(() => {
    window.location.href = "feed.html";
  });
});
