// -------------------- VARIABLES -------------------- // 


// ーーーーーーーーーーーーーー NAV BUTTONS
const topNavigation = document.getElementById("topNavigation");
const homePageNavigationButton = document.getElementById("homePageNavigationButton");
const writeKanjiPageNavigationButton = document.getElementById("writeKanjiPageNavigationButton");
const addNewKanjiPageNavigationButton = document.getElementById("addNewKanjiPageNavigationButton");
const flashcardPageNavigationButton = document.getElementById("flashcardPageNavigationButton");
const viewAllKanjiNavigationButton = document.getElementById("viewAllKanjiNavigationButton");

// ーーーーーーーーーーーーーー KANJI WRITING PAGE

const kanjiWritingPage = document.getElementById("kanjiWritingPage");
const randomKanjiDisplay = document.getElementById("randomKanjiDisplay");
const kanjiCanvasContainer = document.getElementById("kanjiCanvasContainer")
const clearCanvas = document.getElementById("clearCanvas");
const canvasButtons = document.getElementById("canvasButtons")
const submitKanji = document.getElementById("submitKanji");
const hintText = document.getElementById("hintText");
const hintButton = document.getElementById("hint");
const displayDirections = document.getElementById("displayDirections");


let isDrawing = false;
// Stores all completed strokes
let strokes = [];
// Stores the stroke currently being drawn
let currentStroke = [];
// Stores the direction of each completed stroke 
let userStrokeDirections = [];
// The current kanji being tested
let currentDisplayedKanji;
let previousKanji = null;
let currentKanji = null;

let writingCorrectAnswers = 0;
let writingTotalAnswers = 0;

// ーーーーーーーーーーーーーー ADD NEW KANJI PAGE
const uploadNewKanjiPage = document.getElementById("uploadNewKanjiPage");
const addStrokeButton = document.getElementById("addStrokeButton");
const addKanjiPartButton = document.getElementById("addKanjiPart");
const kanjiPartsContainer = document.getElementById("kanjiPartsContainer");
const newKanjiForm = document.getElementById("newKanjiForm");
// Form Elements
let newKanji;
let newKanjiHiragana;
let newKanjiMeaning;
let kanjiPartInputs = [];
//const strokeContainer = document.getElementById("strokeContainer");
let strokeInputs = [];
let strokeSelects = [];


// ーーーーーーーーーーーーーー HOME PAGE
const homePage = document.getElementById("homePage");
const kanjiWritingButton = document.getElementById("kanjiWritingButton");
const uploadNewKanjiButton = document.getElementById("uploadNewKanjiButton");
const flashcardButton = document.getElementById("flashcardButton");
const allKanjiButton = document.getElementById("allKanjiButton");


// ーーーーーーーーーーーーーー FLASHCARD PAGE
const flashcardPage = document.getElementById("flashcardPage");
const flashcardCounter = document.getElementById("flashcardCounter");
let currentFlashcard = null;
let previousFlashCard = null;
let flashCardMode = null;

let flashcardCorrectAnswers = 0;
let flashcardTotalQuestions = 0;


// ーーーーーーーーーーーーーー ALL KANJI PAGE

const displayAllKanjiPage = document.getElementById("displayAllKanjiPage");
const exportDatabaseButton = document.getElementById("exportDatabaseButton");
const importDatabaseButton = document.getElementById("importDatabaseButton");
const totalKanji = document.getElementById("totalKanji");


// ーーーーーーーーーーーーーー POPUP

const popup = document.querySelector(".popup");
const popupTitle = document.getElementById("popupTitle");
let popupButton = document.getElementById("popupButton");



// ーーーーーーーーーーーーーー EXTRA
let kanjiDatabase = [];


// -------------------------------- FUNCTIONS -------------------------------- // 



// -------------------- INITIALIZATIONS -------------------- // 
window.addEventListener("DOMContentLoaded", init);

function init() {
    kanjiDatabase = loadKanjiDatabase();

    const pageMap = {
        homePage,
        kanjiWritingPage,
        uploadNewKanjiPage,
        flashcardPage,
        displayAllKanjiPage
    };

    let startPageId = localStorage.getItem("currentPage");

    let startPage = pageMap[startPageId] || homePage;

    showPage(startPage);
}

// LOAD KANJI DATABASE INTO LOCAL STORAGE
function loadKanjiDatabase() {
    return JSON.parse(localStorage.getItem("kanjiDatabase")) || [];
}


// -------------------- NAVIGATIONS -------------------- //
homePageNavigationButton.addEventListener("click", () => {
    showPage(homePage)
})

writeKanjiPageNavigationButton.addEventListener("click", () => {
    showPage(kanjiWritingPage)
})


addNewKanjiPageNavigationButton.addEventListener("click", () => {
    showPage(uploadNewKanjiPage)
})

flashcardPageNavigationButton.addEventListener("click", () => {
    showPage(flashcardPage)
})

viewAllKanjiNavigationButton.addEventListener("click", () => {
    showPage(displayAllKanjiPage)
})


// -------------------- KANJI WRITING PAGE -------------------- //

// Creates the Kanjis Canvases per kanji amount
function createKanjiCanvases(wordData) {

    kanjiCanvasContainer.innerHTML = "";

    // save currently displayed word
    currentDisplayedKanji = wordData;

    // user strokes = the strokes the user makes while drawing, so we clear it upon new canvas
    currentDisplayedKanji.userStrokes = wordData.parts.map(() => []);

    //looping through each kanji 
    currentDisplayedKanji.parts.forEach((part, index) => {

        // create stroke array for this kanji
        //currentDisplayedKanji.userStrokes[index] = [];

        //the box that holds the canvas
        const box = document.createElement("div");
        box.classList.add("kanjiBox");

        //each canvas/actual drawing interface 
        const canvas = document.createElement("canvas");
        canvas.classList.add("kanjiCanvas");

        box.appendChild(canvas);
        kanjiCanvasContainer.appendChild(box);

        setupCanvas(canvas, index);
    });
}


// Initializes canvas rendering settings
function initializeCanvas(canvas, ctx) {

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    //reset internal pixel buffer
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    //reset ALL transforms first
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    //apply correct scaling 
    ctx.scale(dpr, dpr);

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "black";
}


// Handles drawing logic
function setupCanvas(canvas, kanjiIndex) {

    //Gets the toolset to draw on a canvas in 2D
    const ctx = canvas.getContext("2d");

    //wait for layout to finish before sizing the canvas to prevent wrong width/height 
    requestAnimationFrame(() => {
        initializeCanvas(canvas, ctx);
    });

    let isDrawing = false;
    let currentStroke = [];


    // Handles detecting when drawing starts
    canvas.addEventListener("pointerdown", (e) => {
        //stops scrolling, text selection while using stylus 
        e.preventDefault();

        isDrawing = true;
        //Send all future pointer events for this pointer to this specific canvas 
        canvas.setPointerCapture(e.pointerId);

        currentStroke = [];

        //convert screen coordinates to canvas coordinates and adds it to current strokes
        const rect = canvas.getBoundingClientRect();
        const point = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        currentStroke.push(point);

        //starts a new stroke path
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
    });

    // Handles when drawing is in action 
    canvas.addEventListener("pointermove", (e) => {

        if (!isDrawing) {
            return;
        }

        const rect = canvas.getBoundingClientRect();
        const point = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        currentStroke.push(point);

        //draws in real-time
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
    });

    function stopDrawing() {

        isDrawing = false;
        ctx.closePath();

        //ignoring short strokes (ex. taps)
        if (currentStroke.length > 1) {

            //gets the direction of the current stroke
            const direction = getStrokeDirection(currentStroke);

            console.log("Direction:", direction);

            //Displays the strokes on the screen as the user draws
            directionDisplayText = document.createElement("div");
            directionDisplayText.textContent = direction;
            directionDisplayText.classList.add("directionDisplayText");
            displayDirections.classList.remove("hidden");
            displayDirections.appendChild(directionDisplayText)

            //store strokes
            currentDisplayedKanji.userStrokes[kanjiIndex].push(direction);
        }

        //reset current stroke
        currentStroke = [];
    }

    //all ways a drawing could be stopped
    canvas.addEventListener("pointerup", stopDrawing);
    canvas.addEventListener("pointercancel", stopDrawing);
    canvas.addEventListener("pointerleave", stopDrawing);
}


// Resets all stroke data and UI display
function resetStrokeData() {

    if (!currentDisplayedKanji) {
        return;
    }

    currentDisplayedKanji.userStrokes = [];

    currentDisplayedKanji.parts.forEach((part, index) => {
        currentDisplayedKanji.userStrokes[index] = [];
    });

    displayDirections.innerHTML = ""
    displayDirections.classList.add("hidden");
}


// Determines stroke direction
function getStrokeDirection(stroke) {

    if (!stroke || stroke.length < 2) {
        return "invalid";
    }

    //first and last stroke
    const start = stroke[0];
    const end = stroke[stroke.length - 1];

    //gets the overall x and y movement of the stroke
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    //if the overall movement is mostly vertical
    if (absY > absX) {

        if (dy > 0) {
            return "top-bottom";
        } else {
            return "bottom-top";
        }
    }

    //if the overall movement is mostly horizontal
    else {

        if (dx > 0) {
            return "left-right";
        } else {
            return "right-left";
        }
    }
}


// Clear all canvases
clearCanvas.addEventListener("click", () => {

    document.querySelectorAll(".kanjiCanvas").forEach(canvas => {

        const ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    resetStrokeData();
});


// Submit and check answer
submitKanji.addEventListener("click", () => {
    checkKanji();
});

hintButton.addEventListener("click", () => {
    kanjiAndHint = document.getElementById("kanjiAndHint");
    hintText.classList.remove("hidden");
    hintText.textContent = currentDisplayedKanji.hiragana;

})


// Handles checking whether the kanji the user written is correct
function checkKanji() {

    const target = currentDisplayedKanji;

    if (!target) {
        return;
    }

    let correct = 0;
    let total = 0;

    for (let i = 0; i < target.parts.length; i++) {
        const expected = target.parts[i].strokeDirections;
        const user = target.userStrokes[i];

        //
        if (!user) {
            continue;
        }

        if (user.length !== expected.length) {
            showPopup("Incorrect amount of strokes.", "オケ", "displayRandomKanji");
            resetStrokeData();
            return;
        }

        //counting correct # of stroke directions
        for (let j = 0; j < expected.length; j++) {
            if (user[j] === expected[j]) {
                correct++;
            }
            total++;
        }
    }

    const score =
        total === 0
            ? 0
            : Math.round((correct / total) * 100);

    showPopup("スコア: " + score + "%", "次", "displayRandomKanji");
    resetStrokeData();
}


// DISPLAY RANDOM KANJI FOR THE WRITING PAGE
function displayRandomKanji() {

    if (kanjiDatabase.length === 0) {
        randomKanjiDisplay.textContent = "No Kanji Yet";
        return;
    }

    let randomKanji;

    do {
        randomKanji = getRandomKanji();
    } while (
        kanjiDatabase.length > 1 &&
        currentKanji &&
        randomKanji.kanji === currentKanji.kanji
    );

    previousKanji = currentKanji;
    currentKanji = randomKanji;
    currentDisplayedKanji = randomKanji;

    hintText.innerHTML = "";

    currentDisplayedKanji.userStrokes =
        currentDisplayedKanji.parts.map(() => []);

    randomKanjiDisplay.textContent = randomKanji.meaning;

    createKanjiCanvases(currentDisplayedKanji);
}

// -------------------- ADD NEW KANJI PAGE -------------------- // 

// Handles adding a new kanji and strokes
addKanjiPartButton.addEventListener("click", () => {

    const box = document.createElement("div");
    box.classList.add("kanjiPartBox");

    // kanji input
    const kanjiInput = document.createElement("input");
    kanjiInput.placeholder = "Kanji (e.g. 勉)";

    // stroke container
    const strokeContainer = document.createElement("div");

    const addStrokeButton = document.createElement("button");
    addStrokeButton.classList.add("addStrokeButton");
    addStrokeButton.type = "button";
    addStrokeButton.textContent = "Add Stroke";

    const deleteStrokeButton = document.createElement("button");
    deleteStrokeButton.classList.add("deleteStrokeButton");
    deleteStrokeButton.type = "button";
    deleteStrokeButton.textContent = "Delete Stroke";

    const directions = [
        "top-bottom",
        "bottom-top",
        "left-right",
        "right-left"
        // "diagonal-down",
        //"diagonal-up"
    ];

    const strokeSelects = [];

    // ADD STROKE FOR NEW KANJI
    addStrokeButton.addEventListener("click", () => {

        if (kanjiInput.value) {
            //If the kanji already exists, no need to have user input it again
            const existing = getStrokeDirectionsForKanji(kanjiInput.value);

            if (existing && existing != []) {
                strokeContainer.innerHTML = "";

                const div = document.createElement("div");
                div.textContent = "The Strokes for This Kanji Are Already in The System!";
                strokeContainer.appendChild(div);
                return;
            }

            const select = document.createElement("select");

            directions.forEach(dir => {
                const option = document.createElement("option");
                option.value = dir;
                option.textContent = dir;
                select.appendChild(option);
            });

            strokeContainer.appendChild(select);
            strokeSelects.push(select);
        }
    });

    deleteStrokeButton.addEventListener("click", () => {
        const lastSelect = strokeSelects.pop();
        if (lastSelect) {
            strokeContainer.removeChild(lastSelect);
        }
    });

    box.appendChild(kanjiInput);
    box.appendChild(addStrokeButton);
    box.appendChild(deleteStrokeButton);
    box.appendChild(strokeContainer);

    kanjiPartsContainer.appendChild(box);

    kanjiPartInputs.push({
        kanjiInput,
        strokeSelects
    });
});


newKanjiForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addNewKanji();
})


// ADDING A NEW KANJI AND ITS DETAILS
function addNewKanji() {
    newKanji = document.getElementById("newKanji").value.trim();
    newKanjiHiragana = document.getElementById("newKanjiHiragana").value.trim();
    newKanjiMeaning = document.getElementById("newKanjiMeaning").value.trim();

    if (newKanji === "" || newKanjiHiragana === "" || newKanjiMeaning === "") {
        showPopup("Please Enter All Information", "続く", null)
        return;
    }

    const kanjiParts = kanjiPartInputs.map(part => {
        const existing = findExistingKanji(part.kanjiInput.value);

        if (existing) {
            // reuse existing stroke data
            const existingPart = existing.parts.find(p =>
                p.kanji === part.kanjiInput.value

            );
            return {
                kanji: part.kanjiInput.value,
                strokeDirections: existingPart.strokeDirections
            };
        }

        const strokeDirections = part.strokeSelects.map(sel => sel.value);

        return {
            kanji: part.kanjiInput.value,
            strokeDirections
        };
    });

    const entry = {
        kanji: newKanji,
        hiragana: newKanjiHiragana,
        meaning: newKanjiMeaning,
        parts: kanjiParts,
    };

    kanjiDatabase.push(entry);

    localStorage.setItem(
        "kanjiDatabase",
        JSON.stringify(kanjiDatabase)
    );

    console.log("Saved word:", entry);
    showPopup("New Kanji Saved: " + entry.kanji, "次", null)

    // reset UI
    kanjiPartsContainer.innerHTML = "";
    kanjiPartInputs = [];
    newKanji.textContent = "";
    newKanjiHiragana.textContent = "";
    newKanjiMeaning.textContent = "";
};








// -------------------- HOME PAGE -------------------- // 
kanjiWritingButton.addEventListener("click", () => {
    showPage(kanjiWritingPage)
})

uploadNewKanjiButton.addEventListener("click", () => {
    showPage(uploadNewKanjiPage)
})

flashcardButton.addEventListener("click", () => {
    showPage(flashcardPage)
})

allKanjiButton.addEventListener("click", () => {
    showPage(displayAllKanjiPage)
})







// -------------------- FLASHCARDS -------------------- // 


// GET A RANDOM FLASHCARD KANJI AND MODE
function getRandomFlashcard() {
    if (kanjiDatabase.length < 4) {
        return null;
    }

    const kanji = kanjiDatabase[Math.floor(Math.random() * kanjiDatabase.length)]
    const modes = [
        "meaning-kanji",
        "meaning-hiragana",
        "kanji-meaning",
        "kanji-hiragana",
        "hiragana-meaning",
        "hiragana-kanji"
    ]

    const mode = modes[Math.floor(Math.random() * modes.length)]

    return { kanji, mode }
}

// MAKE THE FLASHCARD QUESTIONS AND ANSWERS
function makeFlashcards() {
    let flashcard = getRandomFlashcard();

    do {
        flashcard = getRandomFlashcard();
    } while (
        kanjiDatabase.length > 4 &&
        currentFlashcard &&
        flashcard.kanji === currentFlashcard.kanji
    );

    previousFlashCard = currentFlashcard;
    currentFlashcard = flashcard;

    if (!flashcard) {
        return
    }

    currentFlashcard = flashcard.kanji
    flashCardMode = flashcard.mode

    let question = "";
    let correctAnswer = "";

    if (flashCardMode === "meaning-kanji") {
        question = flashcard.kanji.meaning;
        correctAnswer = flashcard.kanji.kanji;
    }

    else if (flashCardMode === "meaning-hiragana") {
        question = flashcard.kanji.meaning;
        correctAnswer = flashcard.kanji.hiragana;
    }

    else if (flashCardMode === "kanji-meaning") {
        question = flashcard.kanji.kanji;
        correctAnswer = flashcard.kanji.meaning;
    }

    else if (flashCardMode === "kanji-hiragana") {
        question = flashcard.kanji.kanji;
        correctAnswer = flashcard.kanji.hiragana;
    }

    else if (flashCardMode === "hiragana-meaning") {
        question = flashcard.kanji.hiragana;
        correctAnswer = flashcard.kanji.meaning;
    }

    else if (flashCardMode === "hiragana-kanji") {
        question = flashcard.kanji.hiragana;
        correctAnswer = flashcard.kanji.kanji;
    }

    const choices = buildChoices(correctAnswer, flashCardMode);
    renderFlashcard(question, correctAnswer, choices);
}

// BUILD THE 1 CORRECT 3 INCORRECT CHOICES
function buildChoices(correctAnswer, mode) {

    //pool of possible wrong answers based on mode
    const pool = kanjiDatabase.map(entry => {
        if (mode === "meaning-kanji") return entry.kanji;
        if (mode === "meaning-hiragana") return entry.hiragana;
        if (mode === "kanji-meaning") return entry.meaning;
        if (mode === "kanji-hiragana") return entry.hiragana;
        if (mode === "hiragana-meaning") return entry.meaning;
        if (mode === "hiragana-kanji") return entry.kanji;

    }).filter(v => v !== correctAnswer); // removes the correct answer

    //shuffle the pool
    const shuffled = pool.sort(() => Math.random() - 0.5);

    //correct answer + 3 random wrong answers
    const choices = [correctAnswer, ...shuffled.slice(0, 3)];

    return choices.sort(() => Math.random() - 0.5);
}

// UI FOR FLASHCARDS AND HANDLING CHECKIGN CORRECTNESS
function renderFlashcard(question, correctAnswer, choices) {
    const flashcardQuestion = document.getElementById("flashcardQuestion");
    const flashcardChoices = document.getElementById("flashcardChoices");

    flashcardQuestion.textContent = question;
    flashcardChoices.innerHTML = "";

    choices.forEach(choice => {
        const choiceButton = document.createElement("button");
        choiceButton.classList.add("choiceButton")
        choiceButton.textContent = choice;

        choiceButton.addEventListener("click", () => {
            if (choice == correctAnswer) {
                makeFlashcards();
                flashcardCorrectAnswers++;
            }
            else {
                showPopup("Incorrect. The current answer is: " + correctAnswer, "次", "makeFlashcards");
            }
            flashcardTotalQuestions++;
            updateCounter(flashcardCounter, flashcardTotalQuestions, flashcardCorrectAnswers);

        })
        flashcardChoices.appendChild(choiceButton)
    })

}









// -------------------- ALL KANJI -------------------- // 

function renderAllKanjiCards() {
    const allKanjiContainer = document.getElementById("allKanjiContainer");
    allKanjiContainer.innerHTML = "";

    if (kanjiDatabase.length < 1) {
        return
    }

    kanjiDatabase.forEach(eachKanji => {

        const kanjiCard = document.createElement("div");
        kanjiCard.classList.add("kanjiCard");

        const kanjiTitle = document.createElement("h2");
        kanjiTitle.innerHTML = eachKanji.kanji;
        kanjiTitle.classList.add("kanjiTitle");

        const kanjiHiragana = document.createElement("h3");
        kanjiHiragana.innerHTML = eachKanji.hiragana;
        kanjiHiragana.classList.add("kanjiHiragana");

        const kanjiMeaning = document.createElement("h3");
        kanjiMeaning.innerHTML = eachKanji.meaning;
        kanjiMeaning.classList.add("kanjiMeaning");

        const kanjiStrokeAmount = document.createElement("h3");
        kanjiStrokeAmount.innerHTML = "Strokes: " + getTotalStrokeCount(eachKanji);
        kanjiStrokeAmount.classList.add("kanjiStrokeAmount");

        kanjiCard.appendChild(kanjiTitle);
        kanjiCard.appendChild(kanjiHiragana);
        kanjiCard.append(kanjiMeaning);
        kanjiCard.append(kanjiStrokeAmount);
        allKanjiContainer.appendChild(kanjiCard);

        kanjiCard.addEventListener("click", () => {
            showPopup("Delete or Edit?", "Delete", "editKanji", kanjiTitle.textContent);
        })
    })

    totalKanji.textContent = "Total Kanji: " + kanjiDatabase.length;
    console.log(totalKanji.textContent);

}


// EXPORT DATABASE

exportDatabaseButton.addEventListener("click", () => {
    exportKanjiDatabase();
})

function exportKanjiDatabase() {
    //turn JS array into text
    const data = JSON.stringify(kanjiDatabase);
    //create a fake .json file in memory 
    const blob = new Blob([data], {
        type: "application/json"
    });
    //turn blob into temporary download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "kanjiDatabase.json";
    //auto download the link
    link.click();
    //deletes temporary file now that it is saved in system
    URL.revokeObjectURL(url);
}

// IMPORT DATABASE

importDatabaseButton.addEventListener("click", () => {
    importKanjiFile.click();
});

//runs importKanjiDatabase function when the user selects a file from file explorer
importKanjiFile.addEventListener("change", importKanjiDatabase);

function importKanjiDatabase(event) {
    //get the file (first selected file)
    const file = event.target.files[0];

    if (!file) {
        return;
    }
    //browser tool for reading files
    const reader = new FileReader();
    //once file has been fully read
    reader.onload = function (e) {
        try {
            const importedData = JSON.parse(e.target.result);
            //makes sure file is correct format
            if (!Array.isArray(importedData)) {
                throw new Error("Invalid format");
            }
            //replace database with file database 
            kanjiDatabase = importedData;
            localStorage.setItem(
                "kanjiDatabase",
                JSON.stringify(kanjiDatabase)
            )

            showPopup("Kanji Database Imported", "次", null);
            renderAllKanjiCards();
        }

        catch {
            showPopup("Error. Please Retry", "オケ", null);
        };
    }
    //begins file processing
    reader.readAsText(file);

}

// EDIT A KANJI CARD 
function openEditForm(kanjiName) {

    popup.innerHTML = "";

    const entry = findKanjiByName(kanjiName);

    const container = document.createElement("div");
    container.classList.add("editContainer");

    const editContainerInputs = document.createElement("div");
    editContainerInputs.classList.add("editContainerInputs");


    // ---------- BASIC INFO ----------
    const kanjiInput = document.createElement("input");
    kanjiInput.value = entry.kanji;

    const hiraInput = document.createElement("input");
    hiraInput.value = entry.hiragana;

    const meaningInput = document.createElement("input");
    meaningInput.value = entry.meaning;

    editContainerInputs.appendChild(kanjiInput);
    editContainerInputs.appendChild(hiraInput);
    editContainerInputs.appendChild(meaningInput);

    container.appendChild(editContainerInputs);

    // ---------- STROKE EDITOR ----------
    const strokeEditor = document.createElement("div");
    strokeEditor.classList.add("strokeEditor");

    const strokeBlocks = [];

    entry.parts.forEach((part, partIndex) => {

        const partBox = document.createElement("div");
        partBox.classList.add("strokePartBox");

        const title = document.createElement("h3");
        title.textContent = part.kanji;

        partBox.appendChild(title);

        const strokeList = document.createElement("div");
        strokeList.classList.add("strokeList");

        part.strokeDirections.forEach((dir, strokeIndex) => {

            const row = document.createElement("div");

            const select = document.createElement("select");

            const directions = [
                "top-bottom",
                "bottom-top",
                "left-right",
                "right-left",
                "diagonal-down",
                "diagonal-up"
            ];

            directions.forEach(d => {
                const option = document.createElement("option");
                option.value = d;
                option.textContent = d;
                if (d === dir) option.selected = true;
                select.appendChild(option);
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "X";
            deleteButton.classList.add("strokeEditDeleteButton");

            deleteButton.addEventListener("click", () => {
                row.remove();
            });

            row.appendChild(select);
            row.appendChild(deleteButton);

            strokeList.appendChild(row);
        });

        // add stroke button
        const addStrokeButton = document.createElement("button");
        addStrokeButton.textContent = "+ Stroke";
        addStrokeButton.classList.add("addStrokeButton");

        addStrokeButton.addEventListener("click", () => {

            const row = document.createElement("div");

            const select = document.createElement("select");

            ["top-bottom", "bottom-top", "left-right", "right-left", "diagonal-down", "diagonal-up"]
                .forEach(d => {
                    const option = document.createElement("option");
                    option.value = d;
                    option.textContent = d;
                    select.appendChild(option);
                });

            row.appendChild(select);
            strokeList.appendChild(row);
        });

        partBox.appendChild(strokeList);
        partBox.appendChild(addStrokeButton);

        strokeEditor.appendChild(partBox);
    });

    container.appendChild(strokeEditor);

    // ---------- SAVE ----------
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.classList.add("saveEditButton");

    saveButton.addEventListener("click", () => {

        entry.kanji = kanjiInput.value;
        entry.hiragana = hiraInput.value;
        entry.meaning = meaningInput.value;

        // rebuild stroke structure from DOM
        const newParts = [];

        strokeEditor.querySelectorAll(".strokePartBox").forEach((box, i) => {

            const kanji = box.querySelector("h3").textContent;

            const strokes = Array.from(box.querySelectorAll("select"))
                .map(sel => sel.value);

            newParts.push({
                kanji,
                strokeDirections: strokes
            });
        });

        entry.parts = newParts;

        kanjiDatabase = kanjiDatabase.map(k =>
            k.kanji === entry.kanji ? entry : k
        );

        localStorage.setItem("kanjiDatabase", JSON.stringify(kanjiDatabase));

        popup.classList.remove("open");
        popup.classList.add("close");
    });

    container.appendChild(saveButton);
    popup.appendChild(container);
}

// SAVE KANJI EDITS AND UPDATE IT IN THE DATABASE
function saveKanjiEdits(oldKanji, updatedData) {

    const index = kanjiDatabase.findIndex(k => k.kanji === oldKanji);

    if (index === -1) return;

    kanjiDatabase[index] = {
        ...kanjiDatabase[index],
        ...updatedData
    };

    localStorage.setItem("kanjiDatabase", JSON.stringify(kanjiDatabase));

    console.log("Updated kanji:", kanjiDatabase[index]);
}








// -------------------- HELPER FUNCTIONS -------------------- // 

// SHOWS A PAGE AND HIDES ALL OTHERS
function showPage(pageToShow) {

    if (!pageToShow) {
        pageToShow = homePage;
    }

    const pages = [homePage, kanjiWritingPage, uploadNewKanjiPage, flashcardPage, displayAllKanjiPage];

    pages.forEach(page => {
        page.style.display = "none";
    });

    pageToShow.style.display = "flex";
    localStorage.setItem("currentPage", pageToShow.id);

    // ------ KANJI WRITING PAGE
    if (pageToShow == kanjiWritingPage) {
        hintText.classList.add("hidden");
        displayRandomKanji();
        resetStrokeData();
        document.documentElement.style.setProperty('--pageColor', '#D6E5BD');
    }

    // ------ HOME PAGE
    if (pageToShow == homePage) {
        topNavigation.classList.add("hidden");
    }
    else {
        topNavigation.classList.remove("hidden");
    }

    // ------ UPLOAD NEW KANJI PAGE
    if (pageToShow == uploadNewKanjiPage) {
        kanjiPartsContainer.innerHTML = "";
        document.documentElement.style.setProperty('--pageColor', '#F9E1AB');

    }

    // ------ FLASHCARD PAGE
    if (pageToShow == flashcardPage) {
        makeFlashcards();
        document.documentElement.style.setProperty('--pageColor', '#DCCCEC');
    }

    // ------ ALL KANJI PAGE
    if (pageToShow == displayAllKanjiPage) {
        renderAllKanjiCards();
        document.documentElement.style.setProperty('--pageColor', '#BCD8EC');
    }
}

// RANDOM KANJI PICKER
function getRandomKanji() {
    if (kanjiDatabase.length == 0) {
        return null
    }

    const index = Math.floor(Math.random() * kanjiDatabase.length)
    return kanjiDatabase[index]
}


// SHOWS POPUPS THROUGHOUT THE WEBSITE
function showPopup(text, buttonText, buttonFunction, payload = null) {

    popup.innerHTML = "";

    popup.classList.remove("close");
    popup.classList.add("open");

    const title = document.createElement("h2");
    title.textContent = text;

    popupButton.textContent = buttonText;

    popup.appendChild(title);

    // remove old edit button logic handled naturally now

    if (buttonFunction === "editKanji") {

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("editButton");

        popup.appendChild(editButton);

        editButton.addEventListener("click", () => {
            openEditForm(payload);
        });
    }

    popup.appendChild(popupButton);

    popupButton.addEventListener("click", () => {

        popup.classList.remove("open");
        popup.classList.add("close");

        if (buttonFunction === "displayRandomKanji") {
            displayRandomKanji();
        }

        if (buttonFunction === "makeFlashcards") {
            makeFlashcards();
        }

        if (buttonFunction === "editKanji") {
            deleteKanjiByName(payload);
            renderAllKanjiCards();
        }
    });
}

// UPDATES FLASHCARD AND WRITING COUNTERS
function updateCounter(counterElement, totalQuestions, totalCorrect) {
    counterElement.textContent = totalCorrect + "/" + totalQuestions;
}








// -------------------- KANJI DATABASE HELPER FUNCTIONS -------------------- // 

function findKanjiEntry(kanjiChar) {
    return kanjiDatabase.find(entry =>
        entry.parts.some(part => part.kanji === kanjiChar)
    );
}

function getStrokeDirectionsForKanji(kanjiChar) {
    const entry = findKanjiEntry(kanjiChar);

    if (!entry) {
        return null;
    }
    const part = entry.parts.find(p => p.kanji === kanjiChar);
    return part ? part.strokeDirections : null;
}

function deleteKanjiByIndex(index) {
    kanjiDatabase.splice(index, 1);

    localStorage.setItem(
        "kanjiDatabase",
        JSON.stringify(kanjiDatabase)
    );
}

function deleteKanjiByName(kanjiName) {

    // find index of kanji in database
    const index = kanjiDatabase.findIndex(entry =>
        entry.kanji === kanjiName
    );

    // if not found, exit
    if (index === -1) {
        console.log("Kanji not found:", kanjiName);
        return false;
    }

    // remove it
    kanjiDatabase.splice(index, 1);

    // update storage
    localStorage.setItem(
        "kanjiDatabase",
        JSON.stringify(kanjiDatabase)
    );

    console.log("Deleted kanji:", kanjiName);
    return true;
}

function findKanjiByName(kanjiName) {

    // find index of kanji in database
    const index = kanjiDatabase.findIndex(entry =>
        entry.kanji === kanjiName
    );

    // if not found, exit
    if (index === -1) {
        console.log("Kanji not found:", kanjiName);
        return false;
    }

    return kanjiDatabase[index];
}

function findExistingKanji(char) {
    return kanjiDatabase.find(entry =>
        entry.parts.some(part => part.kanji === char)
    );
}

function getTotalStrokeCount(wordData) {

    if (!wordData || !wordData.parts) return 0;

    return wordData.parts.reduce((total, part) => {
        return total + (part.strokeDirections?.length || 0);
    }, 0);
}
