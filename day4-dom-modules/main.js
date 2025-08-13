// Imports (named + default)
import greet, { add, multiply } from "./mathUtils.js";
import { createProfileCard } from "./cardModule.js";

// === Selecting elements (getElementById / querySelector) ===
const createCardBtn   = document.getElementById("createCardBtn");
const addProfileBtn   = document.getElementById("addProfileBtn");
const cardContainer   = document.querySelector("#cardContainer");
const profileContainer= document.querySelector("#profileContainer");
const countEl         = document.getElementById("count");
const mathOut         = document.getElementById("mathOut");

// === Change textContent via modules ===
mathOut.textContent = `${greet("Dharanyalakshmi")}  2+3=${add(2,3)}  4×5=${multiply(4,5)}`;

// Helper: update card count using querySelectorAll (NodeList loop)
function updateCount(){
  const total = document.querySelectorAll(".card, .profile-card").length;
  countEl.textContent = total;
}

// === Create Card button (createElement + innerHTML + appendChild) ===
createCardBtn.addEventListener("click", () => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <p>This is a new card created at ${new Date().toLocaleTimeString()}.</p>
    <button class="delete">Delete</button>
  `;

  // Style tweak via element.style
  card.style.borderColor = "#c5c5c5";

  // Delete handler
  card.querySelector(".delete").addEventListener("click", () => {
    card.remove();
    updateCount();
  });

  // Toggle highlight on click (classList API)
  card.addEventListener("click", (e) => {
    if(e.target.classList.contains("delete")) return;
    card.classList.toggle("highlight");
  });

  cardContainer.appendChild(card);
  updateCount();
});

// === Add Profile button (prompt -> dynamic profile card from module) ===
addProfileBtn.addEventListener("click", () => {
  const name = prompt("Enter Name:");
  const role = prompt("Enter Role:");

  // Simple validation
  if(!name || !role){
    alert("Both name and role are required.");
    return;
  }

  const profileCard = createProfileCard(name, role);
  profileContainer.appendChild(profileCard);
  updateCount();
});

// Initial count
updateCount();
