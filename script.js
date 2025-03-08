import { Person } from "./person.js";
import { Course } from "./course.js";
import { Student } from "./student.js";

function registerEvents() {
    var myFile = document.getElementById("myFile");
    myFile.addEventListener("change", function (event)
    {
        console.log("1");
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const data = JSON.parse(e.target.result);
                console.log(data); // Test if JSON loads correctly
            };
            reader.readAsText(file);
        }
    });
}

window.addEventListener("load", registerEvents, false);