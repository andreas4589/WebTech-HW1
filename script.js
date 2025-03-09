/*import { Person } from "./person.js";
import { Course } from "./course.js";
import { Student } from "./student.js";
*/
console.log("Hello World!");

function registerEvents() {
    document.getElementById("darkModeToggle").addEventListener("click", function () {
        console.log("Dark mode toggled");
        document.body.classList.toggle("dark-mode");
    });

    document.getElementById("recipe-form").addEventListener("submit", function (event) {
        event.preventDefault();
        const title = document.getElementById("recipe-title").value;
        const image = document.getElementById("recipe-image").value || "default.jpg";
        const ingredients = document.getElementById("recipe-ingredients").value.split(",");
        const instructions = document.getElementById("recipe-instructions").value;

        const newRecipe = { title, image, ingredients, instructions };

        const recipeContainer = document.getElementById("empty-container");
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");
        recipeCard.innerHTML = `
            <h2>${newRecipe.title}</h2>
            <img src="${newRecipe.image}" alt="${newRecipe.title}">
            <h3>Ingredients:</h3>
            <ul>${newRecipe.ingredients.map(ing => `<li>${ing.trim()}</li>`).join("")}</ul>
            <h3>Instructions:</h3>
            <p>${newRecipe.instructions}</p>
        `;
        recipeContainer.appendChild(recipeCard);

    // Reset form
    document.getElementById("recipe-form").reset();
    });
}

window.addEventListener("load", registerEvents, false);