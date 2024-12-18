import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyADxzn0XV1NGR7OmU4ndNVHk_FU7vWDmrg",
  authDomain: "webtechproject-b941c.firebaseapp.com",
  projectId: "webtechproject-b941c",
  storageBucket: "webtechproject-b941c.firebasestorage.app",
  messagingSenderId: "932832722581",
  appId: "1:932832722581:web:18bf76f909f948d9e9a59c",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app); 
const db = getFirestore(app); 

document.addEventListener("DOMContentLoaded", function () {
  const signUpForm = document.getElementById("signupForm");
  if (signUpForm) {
    signUpForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const firstName = document.getElementById("fname").value;
      const lastName = document.getElementById("lname").value;
      const email = document.getElementById("email").value;
      const newpassword = document.getElementById("newpassword").value;
      const password = document.getElementById("password").value;

      if (newpassword !== password) {
        showMessage("Passwords do not match", "signUpMessage");
        return;
      }

      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          const userData = {
            email,
            firstName,
            lastName,
          };

          setDoc(doc(db, "users", user.uid), userData)
            .then(() => {
              console.log("User data saved in Firestore!");
              window.location.href = "Tasks.html"; 
            })
            .catch((error) => {
              console.error("Error writing document:", error);
              showMessage("Failed to save user data", "signUpMessage");
            });

          showMessage("Account Created Successfully", "signUpMessage");
        })
        .catch((error) => {
          let errorMessage = "Unable to create user";
          if (error.code === "auth/email-already-in-use") {
            errorMessage = "This email address is already in use.";
          } else if (error.code === "auth/weak-password") {
            errorMessage = "Password should be at least 6 characters.";
          } else if (error.code === "auth/invalid-email") {
            errorMessage = "Invalid email address.";
          }
          showMessage(errorMessage, "signUpMessage");
        });
    });
  }

  const signInForm = document.getElementById("signinForm");
  if (signInForm) {
    signInForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log("User signed in:", userCredential.user);
          window.location.href = "Tasks.html";
        })
        .catch((error) => {
          let errorMessage = "Unable to sign in";
          if (error.code === "auth/wrong-password") {
            errorMessage = "Incorrect password.";
          } else if (error.code === "auth/user-not-found") {
            errorMessage = "No user found with this email.";
          } else if (error.code === "auth/invalid-email") {
            errorMessage = "Invalid email address.";
          }
          showMessage(errorMessage, "signInMessage");
        });
    });
  }
});

function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(() => {
    messageDiv.style.opacity = 0;
  }, 5000);
}
