import { Person } from "./person.js";
import { Course } from "./course.js";
import { Student } from "./student.js";

console.log("Hello World!");

const fileContentDisplay = document.getElementsByClassName("file-content");
const messageDisplay = document.getElementById("message");
var students = [];

function registerEvents() {
    document.getElementById("darkModeToggle").addEventListener("click", function () {
        console.log("Dark mode toggled");
        document.body.classList.toggle("dark-mode");
    });

    document.getElementById("recipe-form").addEventListener("submit", function (event) {
        event.preventDefault();
        const title = document.getElementById("recipe-title").value;
        const image = document.getElementById("recipe-image").value || "default.jpg";
        const ingredients = document.getElementById("recipe-ingredients").value.split(";");
        const instructions = document.getElementById("recipe-instructions").value;

        const newRecipe = { title, image, ingredients, instructions };

        const recipeContainer = document.getElementById("empty-container");
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");
        recipeCard.innerHTML = `
            <h2>${newRecipe.title}</h2>
            <img src="${newRecipe.image}" class="recipe-img" alt="${newRecipe.title}">
            <h3>Ingredients:</h3>
            <ul>${newRecipe.ingredients.map(ing => `<li>${ing.trim()}</li>`).join("")}</ul>
            <h3>Instructions:</h3>
            <p>${newRecipe.instructions}</p>`;
        recipeContainer.appendChild(recipeCard);

        // Reset form
        document.getElementById("recipe-form").reset();
    });
}

document.getElementById("file-input").addEventListener("change", function (e) {
    const file = e.target.files[0];
    fileContentDisplay.textContent = "";
    messageDisplay.textContent = "";
    console.log("File selected");
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
        students.push(student);
        console.log(students.length);
        displayMembers(students);
    };
    reader.onerror = () => {
        showMessage("Error reading the file. Please try again.", "error");
    };
    reader.readAsText(file);
    console.log("File read");
    });

// Displays a message to the user
function showMessage(message, type) {
    messageDisplay.textContent = message;
    messageDisplay.style.color = type === "error" ? "red" : "green";
}

function displayMembers(members) {
    const content = document.getElementById("content");

    members.forEach(member => {
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

        let par1 = document.createElement("p");
        par1.textContent = `Age: ${member.age}`;
        let par2 = document.createElement("p");
        par2.textContent = ` Hobbies: ${member.hobbies.join(", ")}`;
        let par3 = document.createElement("p");
        par3.textContent += ` Email: ${member.email}`;
        let par4 = document.createElement("p");
        par4.textContent += ` Major: ${member.major}`;
        memberSection.appendChild(par1);
        memberSection.appendChild(par2);
        memberSection.appendChild(par3);
        memberSection.appendChild(par4);

        let courses = document.createElement("table");
        courses.id = "courses-table";
        let header = courses.createTHead();
        let row = header.insertRow(0);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        cell1.textContent = "Course Title";
        cell2.textContent = "Teacher";
        cell3.textContent = "Description";
        let body = courses.createTBody();
        for (let i = 0; i < member.courses.length; i++) {
            let row = body.insertRow(i);
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            let cell3 = row.insertCell(2);
            cell1.textContent = member.courses[i].title;
            cell2.textContent = member.courses[i].teacher.firstName + " " + member.courses[i].teacher.lastName;
            cell3.textContent = member.courses[i].description;
        }
        memberSection.appendChild(courses);

        // Append everything to the main content area
        content.appendChild(memberSection);
    });
}


window.addEventListener("load", registerEvents, false);

