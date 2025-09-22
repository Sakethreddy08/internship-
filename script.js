const apiKey = "482c3ed755f04417a3f0dbc25a87cd9c"; // Replace with your key
const resultsContainer = document.getElementById("results");
const favoritesContainer = document.getElementById("favorites");
const searchHistoryContainer = document.getElementById("searchHistory");
const darkModeToggle = document.getElementById("darkModeToggle");

// Load favorites & history from localStorage
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let searchHistory = JSON.parse(localStorage.getItem("history")) || [];

// Initialize UI
displayFavorites();
displayHistory();
checkDarkMode();

async function fetchRecipes() {
  const ingredientInput = document.getElementById("ingredientInput").value;
  if (!ingredientInput.trim()) {
    alert("Please enter at least one ingredient!");
    return;
  }

  saveSearchHistory(ingredientInput);
  resultsContainer.innerHTML = "<p>Loading recipes...</p>";

  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientInput}&number=6&apiKey=${apiKey}`
    );

    if (!response.ok) throw new Error("Error fetching recipes");
    const data = await response.json();

    if (data.length === 0) {
      resultsContainer.innerHTML = "<p>No recipes found. Try different ingredients.</p>";
      return;
    }

    displayRecipes(data);
  } catch (error) {
    resultsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

function displayRecipes(recipes) {
  resultsContainer.innerHTML = "";
  recipes.forEach(recipe => {
    const card = document.createElement("div");
    card.classList.add("recipe-card");

    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}">
      <h3>${recipe.title}</h3>
      <a href="https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, "-")}-${recipe.id}" target="_blank">
        View Recipe
      </a>
      <span class="save-btn" onclick="saveFavorite(${recipe.id}, '${recipe.title}', '${recipe.image}')">⭐ Save</span>
    `;

    resultsContainer.appendChild(card);
  });
}

function saveFavorite(id, title, image) {
  if (!favorites.find(item => item.id === id)) {
    favorites.push({ id, title, image });
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites();
  } else {
    alert("Already in favorites!");
  }
}

function displayFavorites() {
  favoritesContainer.innerHTML = "";
  if (favorites.length === 0) {
    favoritesContainer.innerHTML = "<p>No favorites yet.</p>";
    return;
  }
  favorites.forEach(recipe => {
    const card = document.createElement("div");
    card.classList.add("recipe-card");
    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}">
      <h3>${recipe.title}</h3>
      <a href="https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, "-")}-${recipe.id}" target="_blank">
        View Recipe
      </a>
    `;
    favoritesContainer.appendChild(card);
  });
}

function saveSearchHistory(searchTerm) {
  if (!searchHistory.includes(searchTerm)) {
    searchHistory.push(searchTerm);
    if (searchHistory.length > 5) searchHistory.shift(); // Keep last 5
    localStorage.setItem("history", JSON.stringify(searchHistory));
    displayHistory();
  }
}

function displayHistory() {
  searchHistoryContainer.innerHTML = "";
  searchHistory.forEach(term => {
    const btn = document.createElement("button");
    btn.textContent = term;
    btn.onclick = () => {
      document.getElementById("ingredientInput").value = term;
      fetchRecipes();
    };
    searchHistoryContainer.appendChild(btn);
  });
}

// Dark Mode Toggle
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
});

function checkDarkMode() {
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }
}
