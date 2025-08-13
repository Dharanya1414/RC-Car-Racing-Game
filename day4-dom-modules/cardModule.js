export function createProfileCard(name, role){
  const card = document.createElement("div");
  card.className = "profile-card";
  card.innerHTML = `
    <h3>${name}</h3>
    <p>${role}</p>
    <button class="delete" title="Remove">X</button>
  `;

  // Delete button
  card.querySelector(".delete").addEventListener("click", () => card.remove());

  // Click to toggle highlight (style modification)
  card.addEventListener("click", (e) => {
    if(e.target.classList.contains("delete")) return;
    card.classList.toggle("highlight");
  });

  return card;
}
