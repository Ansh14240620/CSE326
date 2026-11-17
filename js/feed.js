// ===================================================
// Feed & Donation Logic (feed.html)
// Handles Live Posts, Creating Donations & Claiming
// ===================================================

const navUserPhoto = document.getElementById("nav-user-photo");
const navUserName = document.getElementById("nav-user-name");
const navUserPhone = document.getElementById("nav-user-phone");
const editPhoneBtn = document.getElementById("edit-phone-btn");
const logoutBtn = document.getElementById("logout-btn");
const createPostForm = document.getElementById("create-post-form");
const postsFeed = document.getElementById("posts-feed");

let currentUser = null;
let currentPhone = "";

// 1. Verify User Authentication
auth.onAuthStateChanged((user) => {
  if (!user) {
    // Not logged in -> go back to index.html
    window.location.href = "index.html";
  } else {
    currentUser = user;
    navUserName.textContent = user.displayName || "User";
    if (user.photoURL) navUserPhoto.src = user.photoURL;
    currentPhone = localStorage.getItem("userPhone_" + user.uid) || "";
    navUserPhone.textContent = currentPhone || "Add phone";

    // If phone not in localStorage, fetch from Firestore
    if (!currentPhone) {
      db.collection("users").doc(user.uid).get().then((doc) => {
        if (doc.exists && doc.data().phone) {
          currentPhone = doc.data().phone;
          localStorage.setItem("userPhone_" + user.uid, currentPhone);
          navUserPhone.textContent = currentPhone;
        }
      });
    }

    // Load live donations from Firestore
    loadFeed();
  }
});

// Allow user to change their phone number
editPhoneBtn.addEventListener("click", () => {
  const newPhone = prompt("Enter your new 10-digit phone number:", currentPhone);
  if (!newPhone) return;

  // Basic 10-digit validation
  if (newPhone.length !== 10 || isNaN(newPhone)) {
    alert("Please enter a valid 10-digit phone number (numbers only).");
    return;
  }

  currentPhone = newPhone;
  localStorage.setItem("userPhone_" + currentUser.uid, newPhone);
  navUserPhone.textContent = newPhone;

  db.collection("users").doc(currentUser.uid).update({
    phone: newPhone
  }).then(() => {
    alert("Phone number updated successfully!");
  }).catch((err) => {
    alert("Error updating phone: " + err.message);
  });
});

// 2. Sign Out Handler
logoutBtn.addEventListener("click", () => {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
});

// Helper to prevent HTML injection and keep text safe
function escapeText(str) {
  if (!str) return "";
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// 3. Create a New Donation Post
createPostForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("food-title").value.trim();
  const quantity = document.getElementById("food-quantity").value.trim();
  const expiry = document.getElementById("food-expiry").value.trim();
  const location = document.getElementById("food-location").value.trim();

  // Save new post directly to Firestore
  db.collection("posts").add({
    foodTitle: title,
    quantity: quantity,
    expiry: expiry,
    location: location,
    donorId: currentUser.uid,
    donorName: currentUser.displayName || "Community Member",
    donorPhoto: currentUser.photoURL || "https://via.placeholder.com/40",
    donorPhone: currentPhone || "",
    status: "Available",
    claimedBy: null,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    createPostForm.reset();
  }).catch((err) => {
    alert("Error publishing donation: " + err.message);
  });
});

// 4. Real-time Feed Listener (Syncs automatically when data changes)
function loadFeed() {
  db.collection("posts")
    .orderBy("createdAt", "desc")
    .onSnapshot((snapshot) => {
      postsFeed.innerHTML = "";

      let visibleCount = 0;

      snapshot.forEach((doc) => {
        const post = doc.data();
        const postId = doc.id;

        // If post has already been claimed/given away, remove it from the active feed
        if (post.status === "Claimed") {
          return;
        }

        visibleCount++;
        const isMyPost = currentUser && (post.donorId === currentUser.uid);

        const safeTitle = escapeText(post.foodTitle);
        const safeQuantity = escapeText(post.quantity);
        const safeExpiry = escapeText(post.expiry);
        const safeLocation = escapeText(post.location);
        const safeDonorName = escapeText(post.donorName);
        const safeDonorPhone = escapeText(post.donorPhone);
        const safePhoto = post.donorPhoto || "https://via.placeholder.com/40";

        const postCard = document.createElement("div");
        postCard.className = "card";
        postCard.innerHTML = `
          <div class="post-header">
            <img src="${safePhoto}" alt="Donor">
            <div class="post-meta">
              <h4>${safeDonorName} ${isMyPost ? '<span style="font-size: 11px; color: #16a34a;">(Your Post)</span>' : ''}</h4>
              <span>Posted on FoodBridge</span>
            </div>
            <div style="margin-left: auto;">
              <span class="badge badge-available">
                🟢 Available
              </span>
            </div>
          </div>

          <h3 style="margin-bottom: 5px;">${safeTitle}</h3>

          <div class="post-details">
            <p><strong>📦 Quantity:</strong> ${safeQuantity}</p>
            <p><strong>⏰ Expiry / Fresh Until:</strong> ${safeExpiry}</p>
            <p><strong>📍 Pickup Location:</strong> ${safeLocation}</p>
          </div>

          <div class="post-actions">
            ${safeDonorPhone ? `
              <a href="tel:${safeDonorPhone}" class="btn btn-outline btn-sm">
                📞 Call (${safeDonorPhone})
              </a>
              <a href="https://wa.me/91${safeDonorPhone}" target="_blank" class="btn btn-outline btn-sm">
                💬 WhatsApp
              </a>
            ` : ''}

            ${isMyPost ? `
              <button onclick="markAsClaimed('${postId}')" class="btn btn-primary btn-sm" style="margin-left: auto;">
                ✅ Mark as Given (Remove Post)
              </button>
            ` : ''}
          </div>
        `;

        postsFeed.appendChild(postCard);
      });

      if (visibleCount === 0) {
        postsFeed.innerHTML = `<p style="text-align: center; color: #64748b; padding: 20px;">No active food donations right now. Be the first to share!</p>`;
      }
    }, (error) => {
      postsFeed.innerHTML = `<p style="color: red; text-align: center;">Error loading feed: ${error.message}</p>`;
    });
}

// 5. Donor Marks Food as Given / Claimed
window.markAsClaimed = function(postId) {
  if (!confirm("Has this food been given away? It will be removed from the active food board.")) return;

  db.collection("posts").doc(postId).update({
    status: "Claimed"
  }).then(() => {
    alert("Post marked as completed and removed from feed!");
  }).catch((err) => {
    alert("Error updating post: " + err.message);
  });
};
