var selectElem = document.getElementById("selectElem");

/* I select the articles, the sections and the body separately.
Indeed, document.querySelectorAll("body", "article", "section") will only select the body.
That's because body is the first element encountered. */
const articles = document.querySelectorAll("article");
const sections = document.querySelectorAll("section");
const body = document.querySelectorAll("body");
let elements = [...body, ...articles, ...sections];

let previousElems = []; 

// Add options in the element selector menu
function addElementSelector(){

    // Some elements have the same class, we don't want them to appear twice in the menu
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

    // add an option to the menu ONLY if the option doesn't already exist (e.g: 2 section with the same class)
    function createOption(text, value){
        if (alreadyOption(text) === false){
            var text = document.createTextNode(text);
            var option = document.createElement('option');
            option.setAttribute('value', value);
            option.appendChild(text);
            selectElem.appendChild(option);
        }
    }

    /* we go through all the elements that we are interessted in our document
        (article, section and body) and we add them in the menu */
    for (let i in elements){   
        let elem = elements[i];

        /* the value of the the option is the name of the tag
            but the content that will appear has to be either the id, the class or
            the name of the element by default. That's what these conditions are for (more user friendly) */
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

/* function to reset the style of the webpage.
    Otherwise, the styles will continue to be added to eachother */
function resetPreviousStyles() {
    for (let e of previousElems) {
        e.style.fontSize = ""; 
        e.style.color = ""; 
    }
    previousElems = []; 
}


/* Change the style of one or multiple elements.
    If the user chooses an option that corresponds to several elements (like article-container) */
function changeStyle(event){
    /*
        selectedElem: value of the option selected, i.e: name of the element that the user want to change the appearance
        selectedOption: id or class of the selected element. If it doesn't have any of these attribute, selectedOption is just the name of the element (like body)
    */
    let selectedElem = selectElem.value;
    let selectedOption = event.target.selectedOptions[0].textContent;

    if(selectedElem === "") return;

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
            previousElems.push(e);
        }
    }
}