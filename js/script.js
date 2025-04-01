import { Person } from "./person.js";
import { Course } from "./course.js";
import { Student } from "./student.js";

const fileContentDisplay = document.getElementsByClassName("file-content");
const messageDisplay = document.getElementById("message");
var darkModeSwitch = -1;

document.getElementById("darkModeToggle").addEventListener("click", function () {
    darkModeSwitch *= -1;

    if (darkModeSwitch == 1)
    {
        document.querySelector("main").style.background = "#5e5e5e";
        document.querySelector("body").style.background = "#333";

        document.querySelector("body").style.color = "white";

        let personal = document.getElementsByClassName("personal");
        if(personal){
            personal.style = "pink";
        }


        let  fileInput = document.getElementById("file-input");
        if(fileInput){
            fileInput.style.background = "black";
        }

        document.querySelectorAll("h3").style = "rgb(228, 9, 9)";
    }

    else
    {
        document.querySelector("main").style.background = "#f4f4f4";
        document.querySelector("body").style.background = "#f1ead7c5";

        document.querySelector("body").style.color = "black";

        let personal = document.getElementsByClassName("personal");
        if(personal){
            personal.style = "darkgreen";
        }


        let  fileInput = document.getElementById("file-input");
        if(fileInput){
            fileInput.style.background = "#f8f8f8";
        }

        document.querySelectorAll("h3").style = "rgb(151, 51, 38)";
    }
});

function addRecipe() {
    document.getElementById("recipe-form").addEventListener("submit", function (event) {
        event.preventDefault();

        const title = document.getElementById("recipe-title").value;
        const image = document.getElementById("recipe-image").value || "default.jpg";
        const ingredients = document.getElementById("recipe-ingredients").value.split(";").map(ing => ing.trim());
        const instructions = document.getElementById("recipe-instructions").value;

        const newRecipe = { title, image, ingredients, instructions };

        // Create a new recipe container
        const recipeContainer = document.getElementById("empty-container");
        const recipeAside = document.createElement("aside");
        recipeAside.className = "recipe-container";

        // Create image element
        const recipeImg = document.createElement("img");
        recipeImg.className = "recipe-img";
        recipeImg.src = newRecipe.image;
        recipeImg.alt = newRecipe.title;

        // Create ingredients list
        const ingredientsList = document.createElement("ul");
        ingredientsList.className = "ingredients";
        ingredientsList.innerHTML = `
            <h3>Ingredients</h3>
            ${newRecipe.ingredients.map(ing => `<li>${ing}</li>`).join("")}
        `;

        // Append elements to aside
        recipeAside.appendChild(recipeImg);
        recipeAside.appendChild(ingredientsList);


        const instrList = document.createElement('ul');
        instrList.innerHTML = `
        <h3>Instructions</h3>
        <p>${newRecipe.instructions}</p>`;
        instrList.className = "instructions";
        // Append new recipe to container
        recipeContainer.appendChild(recipeAside);
        recipeContainer.appendChild(instrList);

        // Reset form
        document.getElementById("recipe-form").reset();
    });
}

function fileInput(){
    document.getElementById("file-input").addEventListener("change", function (e) {
        const file = e.target.files[0];
        fileContentDisplay.textContent = "";
        messageDisplay.textContent = "";
        // Validate file existence and type
        if (!file) {
            showMessage("No file selected. Please choose a file.", "error");
            return;
        }
        
        if (!file.name.toLowerCase().endsWith(".json")) {
            showMessage("Unsupported file type. Please select a .json file.", "error");
            return;
        }
        
        // Read the file
        const reader = new FileReader();
        reader.onload = () => {
            const data = JSON.parse(reader.result);
            console.log(data);
            let studentArr = data[0];
            let courses = []
            for (let i =0; i < studentArr.courses.length; i++) {
                courses.push(new Course(studentArr.courses[i].title, new Person(studentArr.courses[i].teacher.firstName, studentArr.courses[i].teacher.lastName), studentArr.courses[i].description));
            }
            let student = new Student(studentArr.firstName, studentArr.lastName, studentArr.age, studentArr.hobbies, studentArr.email, studentArr.photo, studentArr.major, courses);
            displayMember(student);
        };
        reader.onerror = () => {
            showMessage("Error reading the file. Please try again.", "error");
        };
        reader.readAsText(file);
        console.log("File read");
        });
}

// Displays a message to the user
function showMessage(message, type) {
    messageDisplay.textContent = message;
    messageDisplay.style.color = type === "error" ? "red" : "green";
}

function displayMember(member) {
    const content = document.getElementById("content");

    // Create the member container
    let memberSection = document.createElement("section");
    memberSection.className = "personal";

    // Create and append the name
    let name = document.createElement("h2");
    name.textContent = `The story of ${member.firstName} ${member.lastName}`;
    memberSection.appendChild(name);

    // Create and append the image
    let img = document.createElement("img");
    img.src = member.photo;
    img.alt = `${member.firstName} ${member.lastName}`;
    img.id = "member-photo";
    memberSection.appendChild(img);

    let details = [
        `Age: ${member.age}`,
        `Hobbies: ${member.hobbies.join(", ")}`,
        `Email: ${member.email}`,
        `Major: ${member.major}`
    ];

    details.forEach(text => {
        let p = document.createElement("p");
        p.textContent = text;
        memberSection.appendChild(p);
    });
    
    let courses = document.createElement("div");
    courses.id = "courses-div";
    for (let i = 0; i < member.courses.length; i++) {
        let currentCourse = courses.appendChild(document.createElement("div"));
        currentCourse.classList.add("course-title");
        currentCourse.textContent = `${member.courses[i].title}`;
        let spanner = currentCourse.appendChild(document.createElement("span"));
        spanner.classList.add("course-tooltip");
        spanner.textContent = `${"Professor: "+ member.courses[i].teacher.firstName + " " + member.courses[i].teacher.lastName + "\n Description: " + member.courses[i].description}`;
    }

    memberSection.appendChild(courses);

    // Append everything to the main content area
    content.appendChild(memberSection);
}

document.addEventListener("DOMContentLoaded", function () {
    const path = window.location.pathname;

    if (path.includes("recipes.html")) {
        addRecipe();
    }
    else if (path.includes("about-us.html")) {
        fileInput();
    }
});

const remove_tooltip = (event) => {
    if (event.target.childElementCount > 0) event.target.childNodes[0].remove();
}

const add_tooltip = (event) => {
    let target = event.target;
    alert("Bla");
    let tip = tooltip_gen(target.nextElementSibling.nextElementSibling.textContent);
    target.appendChild(tip);
}

const tooltip_gen = (text) => {
    let div = document.createElement("div");
    let span = document.createElement("span");
    div.appendChild(span);
    span.textContent = text;
}

const modal = document.getElementById("modal");
const modalSections = document.querySelectorAll(".modal-section");
const openLinks = document.querySelectorAll("[data-modal]");
const closeBtn = document.getElementById("close-modal");

// Open specific modal section
openLinks.forEach(link => {
link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = link.getAttribute("data-modal");

        modalSections.forEach(section => {
        section.classList.remove("active");
        });

        const activeSection = document.getElementById("modal-" + target);
        if (activeSection) {
        activeSection.classList.add("active");
        modal.style.display = "flex";
        }
    });
});

// Close modal
closeBtn.addEventListener("click", () => {
modal.style.display = "none";
});

// Close modal when clicking outside
window.addEventListener("click", (e) => {
if (e.target === modal) {
    modal.style.display = "none";
}
});
