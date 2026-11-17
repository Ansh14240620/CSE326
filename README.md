# FoodBridge - Food Donation Coordination Platform

**Course:** CSE326 - Web Development (HTML, CSS, JavaScript)  
**Project Type:** CA / Practical Evaluation  

---

## 📌 About the Project

Restaurants, hostels, campus messes, and households frequently have surplus edible food that goes to waste, while local shelters and people in need face food shortages. 

**FoodBridge** is a web-based community platform that connects food donors with volunteers and shelter coordinators. Donors can quickly share surplus food details, and volunteers or community members can contact them directly to coordinate immediate pickup and distribution.

---

## 🚀 Key Features

* **Instant Google Authentication:** 1-click secure login powered by Google Firebase Auth.
* **User Profile & Contact Setup:** Donors and volunteers can set and update their 10-digit phone number anytime directly from the navigation bar.
* **Share Surplus Food (Donation Post):** Donors can post available food with item description, quantity, pickup location, and expiry/freshness deadline.
* **Live Community Feed:** All active food donations appear in real-time across all connected users using Cloud Firestore.
* **Direct Coordination:** Community members can directly connect with donors via **📞 Call** or **💬 WhatsApp** with a single click.
* **Donor Post Control:** Only the user who dropped the post can mark it as given/completed, which automatically removes it from the active board.

---

## 🛠️ Tech Stack

* **Front-end:** HTML5, CSS3, JavaScript
* **Authentication:** Google Firebase Auth (Google Sign-In)
* **Cloud Database:** Google Cloud Firestore (Real-time synchronization)

---

## 📂 Project Structure

```
CSE326/
├── index.html                 # Landing page & Google Sign-In
├── feed.html                  # Community food board & create post form
├── server.js                  # Lightweight local server
├── firebase-config.example.js # Template for Firebase setup
├── firebase-config.js         # Your Firebase project keys (gitignored)
├── firestore.rules            # Firestore security rules
├── css/
│   └── style.css              # Clean, responsive styles & badges
└── js/
    ├── auth.js                # Google Sign-In & profile setup logic
    └── feed.js                # Live feed rendering & post submission
```

---

