import { Person } from "./person.js";
import { Course } from "./course.js";
import { Student } from "./student.js";

const fileContentDisplay = document.getElementsByClassName("file-content");
const messageDisplay = document.getElementById("message");

document.getElementById("darkModeToggle").addEventListener("click", function () {
    console.log("Dark mode toggled");
    document.body.classList.toggle("dark-mode");
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

    // let courses = document.createElement("table");
    // courses.id = "courses-table";
    // let header = courses.createTHead();
    // let tr = document.createElement("tr");
    // let row = header.appendChild(tr);
    // let th1 = document.createElement("th");
    // let th2 = document.createElement("th");
    // let th3 = document.createElement("th");
    // let cell1 = row.appendChild(th1);
    // let cell2 = row.appendChild(th2);
    // let cell3 = row.appendChild(th3);
    // cell1.textContent = "Course Title";
    // cell2.textContent = "Teacher";
    // cell3.textContent = "Description";
    // let body = courses.createTBody();
    // for (let i = 0; i < member.courses.length; i++) {
    //     let row = body.insertRow(i);
    //     let cell1 = row.insertCell(0);
    //     let cell2 = row.insertCell(1);
    //     let cell3 = row.insertCell(2);
    //     cell1.textContent = member.courses[i].title;
    //     cell2.textContent = member.courses[i].teacher.firstName + " " + member.courses[i].teacher.lastName;
    //     cell3.textContent = member.courses[i].description;
    //     cell1.addEventListener("mouseover", add_tooltip)
    //     cell1.addEventListener("mouseleave", remove_tooltip)
    // }
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
