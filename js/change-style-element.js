var selectElem = document.getElementById("selectElem");

const articles = document.querySelectorAll("article");
const sections = document.querySelectorAll("section");
const body = document.querySelectorAll("body");

let elements = [...body, ...articles, ...sections];

let previousElems = []; // Houdt het vorige geselecteerde element bij

function addElementSelector(){

    function alreadyOption(value){
        let repeated = selectElem.querySelectorAll("option");
        for (let i in repeated){
            let content = repeated[i].textContent;
            if(content === value){
                return true;
            }
        }
        return false;
    }

    function createOption(text, value){
        if (alreadyOption(text) === false){
            var text = document.createTextNode(text);
            var option = document.createElement('option');
            option.setAttribute('value', value);
            option.appendChild(text);
            selectElem.appendChild(option);
        }
    }

    for (let i in elements){   
        let elem = elements[i];

        if(elem.id){
            createOption(elem.id, elem.tagName);
        }
        else if(elem.className){
                createOption(elem.className, elem.tagName);
            }
            else{
                createOption(elem.tagName.toLowerCase(), elem.tagName.toLowerCase());
            }
    }
}

addElementSelector();


let selectStyle = document.getElementById("selectStyle");
selectElem.addEventListener("change", changeStyle, false);

function resetPreviousStyles() {
    for (let e of previousElems) {
        e.style.fontSize = ""; // Reset font-size
        e.style.color = ""; // Reset color
    }
    previousElems = []; // Leeg de array
}

function changeStyle(event){
    let selectedElem = selectElem.value;
    let selectedOption = event.target.selectedOptions[0].textContent;

    if(selectedElem === "") return;

    // Reset de stijl van de vorige selectie
    resetPreviousStyles();

    let elem = document.querySelectorAll(selectedElem);
    
    for(let i in elem){
        e = elem[i];
        if(e.id===selectedOption || e.className===selectedOption || e.tagName===selectedOption.toUpperCase()){
            console.log("it worked");
            switch (selectStyle.value){
                case "size-1":
                    e.style.fontSize = "1.5rem";
                    break;
                case "size-2":
                    e.style.fontSize = "1.8rem";
                    break;
                case "color-blue":
                    e.style.color = "blue";
                    break;
                case "color-green":
                    e.style.color = "green";
                    break;
            }
            // Voeg het element toe aan de lijst van aangepaste elementen
            previousElems.push(e);
        }
    }

}