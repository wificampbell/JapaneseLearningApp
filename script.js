// -------------------- VARIABLES -------------------- // 


// ーーーーーーーーーーーーーー NAV BUTTONS
const topNavigation = document.getElementById("topNavigation");
const writeKanjiPageNavigationButton = document.getElementById("writeKanjiPageNavigationButton");
const addNewKanjiPageNavigationButton = document.getElementById("addNewKanjiPageNavigationButton");
const flashcardPageNavigationButton = document.getElementById("flashcardPageNavigationButton");
const viewAllKanjiNavigationButton = document.getElementById("viewAllKanjiNavigationButton");
const storyPageNavigationButton = document.getElementById("storyPageNavigationButton");

// ーーーーーーーーーーーーーー KANJI WRITING PAGE

const kanjiWritingPage = document.getElementById("kanjiWritingPage");
let randomKanjiDisplay = document.getElementById("randomKanjiDisplay");
const kanjiCanvasContainer = document.getElementById("kanjiCanvasContainer")
const clearCanvas = document.getElementById("clearCanvas");
const canvasButtons = document.getElementById("canvasButtons");
const showStrokesHelpImageButton = document.getElementById("showStrokesHelpImageButton");
const submitKanji = document.getElementById("submitKanji");
const hintText = document.getElementById("hintText");
const hintButton = document.getElementById("hint");
const displayDirections = document.getElementById("displayDirections");

let hintPressed = 0;
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
let showStrokesHelpImageButtonPressed = false;
let toggleStrokeHelpImageState = false;

let override = "";

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
const storyPageButton = document.getElementById("storyPageButton");


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
const searchForKanji = document.getElementById("searchForKanji");

// ーーーーーーーーーーーーーー STORY PAGE
const storyPage = document.getElementById("storyPage");
const generateStoryWithFileButton = document.getElementById("generateStoryWithFileButton");
const generateStoryWithPromptButton = document.getElementById("generateStoryWithPromptButton");
const highlightTextButtonYellow = document.getElementById("highlightTextButtonYellow");
const highlightTextButtonBlue = document.getElementById("highlightTextButtonBlue");
const highlightTextButtonPurple = document.getElementById("highlightTextButtonPurple");
const deleteHighlight = document.getElementById("deleteHighlight");
const writtenStory = document.getElementById("writtenStory");
let generatingWithPrompt = false;
let generatingWithFile = false;
let savedRange = null;



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
    //load the kanji database upon entering 
    kanjiDatabase = loadKanjiDatabase();

    //go to the last page that was accessed
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

storyPageNavigationButton.addEventListener("click", () => {
    showPage(storyPage);
})


// -------------------- KANJI WRITING PAGE -------------------- //

// Creates the Kanjis Canvases per kanji amount
function createKanjiCanvases(wordData) {

    kanjiCanvasContainer.innerHTML = "";
    displayDirections.innerHTML = ""
    displayDirections.classList.add("hidden");

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


        if (toggleStrokeHelpImageState) {
            box.classList.add("withStroke");
            box.style.backgroundImage = `url("KanjiStrokes/${part.kanji}.png")`;
            const overlay = document.createElement("div");
            overlay.id = "opacity";
            box.appendChild(overlay);
        }
        else {
            box.classList.remove("withStroke");
        }

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

    if (toggleStrokeHelpImageState) {
        ctx.lineWidth = 10;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "black";
    }
    else {
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "black";
    }
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

    hintPressed = false;
    currentDisplayedKanji.userStrokes = [];
    displayDirections.classList.remove("answer");
    override = "";

    currentDisplayedKanji.parts.forEach((part, index) => {
        currentDisplayedKanji.userStrokes[index] = [];
    });

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
    displayDirections.innerHTML = "";
    displayDirections.classList.add("hidden");
    resetStrokeData();
});


// Submit and check answer
submitKanji.addEventListener("click", () => {
    checkKanji();
});

hintButton.addEventListener("click", () => {
    hintPressed = true;
    kanjiAndHint = document.getElementById("kanjiAndHint");
    hintText.classList.remove("hidden");
    hintText.textContent = currentDisplayedKanji.hiragana;
});

showStrokesHelpImageButton.addEventListener("click", () => {
    showStrokesHelpImageButtonPressed = true;
    toggleStrokeHelpImageState = !toggleStrokeHelpImageState;
    createKanjiCanvases(currentDisplayedKanji);
});


// Handles checking whether the kanji the user written is correct
function checkKanji() {

    //the correct kanji
    const target = currentDisplayedKanji;
    console.log("First correctness = " + target.correctness);

    if (!target) {
        return;
    }

    let correct = 0;
    let total = 0;
    let hintPenalty = hintPressed ? 5 : 0;
    let updatedCorrectness = target.correctness ?? 0;


    //checking if the stroke image button was pressed
    if (showStrokesHelpImageButtonPressed) {

        updatedCorrectness = Math.max(0, updatedCorrectness - 50);
        saveKanjiEdits(target.kanji, { correctness: updatedCorrectness });
        showStrokesHelpImageButtonPressed = false;
        toggleStrokeHelpImageState = false;

        resetStrokeData();
        displayRandomKanji();
        return;
    }


    for (let i = 0; i < target.parts.length; i++) {

        const expected = target.parts[i].strokeDirections;
        const userStrokes = target.userStrokes[i];

        //if no user strokes, skip this loop iteration and go to the next one
        if (!userStrokes) {
            continue;
        }

        if (userStrokes.length !== expected.length) {

            showPopup("Answer: " + target.kanji + "\nStrokes Given: " + userStrokes.length + "\nExpected Amount: " + expected.length, "オケ", "displayRandomKanji");

            updatedCorrectness = Math.max(0, updatedCorrectness - 15 - hintPenalty);

            saveKanjiEdits(target.kanji, { correctness: updatedCorrectness });

            showStrokesHelpImageButtonPressed = false;
            toggleStrokeHelpImageState = false;

            displayDirections.innerHTML = "";
            displayCorrectKanjiStrokes(target);

            resetStrokeData();
            return;
        }

        for (let j = 0; j < expected.length; j++) {
            if (userStrokes[j] === expected[j]) {
                correct++;
            }
            total++;
        }
    }


    let score = total === 0 ? 0 : Math.round((correct / total) * 100);

    if (score <= 70) {
        showPopup("Answer: " + target.kanji + "\nスコア: " + score + "%", "次", "displayRandomKanji");
        updatedCorrectness = Math.round((updatedCorrectness + score) / 2);
    }
    else {
        showPopup("スコア: " + score + "%", "次", "displayRandomKanji");
        updatedCorrectness = Math.round((updatedCorrectness + score) / 2);
    }

    //save changes
    saveKanjiEdits(target.kanji, { correctness: updatedCorrectness });

    //resets 
    showStrokesHelpImageButtonPressed = false;
    toggleStrokeHelpImageState = false;

    displayCorrectKanjiStrokes(target);
    resetStrokeData();
}




function displayCorrectKanjiStrokes(target) {

    displayDirections.innerHTML = "";
    displayDirections.classList.add("answer");
    randomKanjiDisplay.textContent = currentDisplayedKanji.kanji;

    for (const part of target.parts) {

        const title = document.createElement("div");
        title.textContent = part.kanji + ":";
        title.style.fontSize = "20px";
        displayDirections.appendChild(title);

        const directionRow = document.createElement("div");
        directionRow.style.display = "flex";
        directionRow.style.flexDirection = "row";
        directionRow.style.gap = "10px";
        directionRow.style.flexWrap = "wrap";

        for (const dir of part.strokeDirections) {

            const d = document.createElement("div");
            d.textContent = dir;
            d.style.whiteSpace = "nowrap"
            directionRow.appendChild(d);
        }

        displayDirections.appendChild(directionRow);
    }
}

// WEIGH THE KANJIS TO MAKE SURE THAT LOWER CORECTNESS KANJIS GET SHOWN MORE
function getWeightedRandomKanji(database) {

    let totalWeight = 0;

    // loops through ever kanji in the database and creates a new array of the kanji and its weight
    const weighted = database.map(kanji => {
        // makes sure correctness is never negative and stays between 0 and 100 (if number is undefined, then the correctness becomes 0)
        const correctness = Math.max(0, Math.min(100, Number(kanji.correctness) || 0));
        // the higher the correctness, the lower the weight (squared to allow for a big difference in weights)
        const weight = Math.pow(101 - correctness, 2);
        totalWeight += weight;
        return {
            kanji,
            weight
        };
    });

    // the random number that acts as the position inside the weighted probability space
    let random = Math.random() * totalWeight;
    for (const item of weighted) {
        // moves through the probability space 
        // big weights subtract more, and so they are more likely to hit 0 first and be returned first
        random -= item.weight;
        if (random <= 0) {
            return item.kanji;
        }
    }
}

// DISPLAY RANDOM KANJI FOR THE WRITING PAGE
function displayRandomKanji() {

    //if database has no kanji
    if (kanjiDatabase.length === 0) {
        randomKanjiDisplay.textContent = "No Kanji Yet";
        return;
    }

    let randomKanji;

    //keep doing it if the random generated kanji is the same as the current kanji
    do {
        randomKanji = getWeightedRandomKanji(kanjiDatabase);
    }
    while (kanjiDatabase.length > 1 && currentKanji && randomKanji.kanji === currentKanji.kanji);

    //keeping track of previous and current kanjis
    previousKanji = currentKanji;
    currentKanji = randomKanji;
    currentDisplayedKanji = randomKanji;

    //clearing
    hintText.innerHTML = "";
    currentDisplayedKanji.userStrokes = currentDisplayedKanji.parts.map(() => []);

    randomKanjiDisplay.textContent = randomKanji.meaning;
    createKanjiCanvases(currentDisplayedKanji);
}

// -------------------- ADD NEW KANJI PAGE -------------------- // 

// Handles adding a new kanji and strokes
addKanjiPartButton.addEventListener("click", () => {

    const text = document.createElement("div");
    text.textContent = "漢字の要素:";
    text.classList.add("formKanjiInputText");

    const box = document.createElement("div");
    box.classList.add("kanjiPartBox");

    // kanji input
    const kanjiInput = document.createElement("input");
    kanjiInput.classList.add("kanjiInput");

    // stroke container
    const strokeContainer = document.createElement("div");

    const addStrokeButton = document.createElement("button");
    addStrokeButton.classList.add("newFormButtons");
    addStrokeButton.type = "button";
    addStrokeButton.textContent = "Add Stroke";

    const deleteStrokeButton = document.createElement("button");
    deleteStrokeButton.classList.add("newFormButtons");
    deleteStrokeButton.type = "button";
    deleteStrokeButton.textContent = "Delete Stroke";

    const deleteRowButton = document.createElement("button");
    deleteRowButton.classList.add("newFormButtons");
    deleteRowButton.type = "button";
    deleteRowButton.textContent = "Delete Row";

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

        if (!kanjiInput.value) {
            return;
        }

        //determine if this kanji already exists in the database 
        const existing = getStrokeDirectionsForKanji(kanjiInput.value);
        if (existing) {
            const strokesExistText = document.createElement("div");
            strokesExistText.textContent = "The strokes for this kanji are already in the system!";
            strokeContainer.appendChild(strokesExistText);
            return;
        }

        const select = document.createElement("select");

        //generating the direction select options 
        directions.forEach(dir => {
            const option = document.createElement("option");
            option.value = dir;
            option.textContent = dir;
            select.appendChild(option);
        });

        strokeContainer.appendChild(select);
        strokeSelects.push(select);
    });

    deleteStrokeButton.addEventListener("click", () => {
        const lastSelect = strokeSelects.pop();
        if (lastSelect) {
            strokeContainer.removeChild(lastSelect);
        }
    });

    deleteRowButton.addEventListener("click", () => {
        box.remove();
    });

    box.appendChild(text);
    box.appendChild(kanjiInput);
    box.appendChild(addStrokeButton);
    box.appendChild(deleteStrokeButton);
    box.appendChild(deleteRowButton);
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

    const newKanji = document.getElementById("newKanji").value.trim();
    const newKanjiHiragana = document.getElementById("newKanjiHiragana").value.trim();
    const newKanjiMeaning = document.getElementById("newKanjiMeaning").value.trim();

    // -------------------- VALIDATION -------------------- //

    // empty field check
    if (
        newKanji === "" ||
        newKanjiHiragana === "" ||
        newKanjiMeaning === ""
    ) {
        showPopup("Please Enter All Information.", "続く", null);
        return;
    }

    //duplicate kanji check
    if (findExistingKanjiOnly(newKanji)) {
        showPopup("This kanji already exists in the database.", "オケ", null);
        return;
    }

    //must have at least one part
    if (kanjiPartInputs.length === 0) {
        showPopup("Please add at least one kanji part.", "オケ", null);
        return;
    }

    //validate each part before building data
    for (const part of kanjiPartInputs) {

        const kanjiChar = part.kanjiInput.value.trim();

        if (kanjiChar === "") {
            showPopup("Kanji part cannot be empty.", "オケ", null);
            return;
        }

        const isExistingKanji = findExistingKanji(kanjiChar);

        const hasStrokes =
            part.strokeSelects.length > 0 &&
            part.strokeSelects.every(sel => sel.value !== "");

        //if it's a new kanji AND has no strokes, error
        if (!isExistingKanji && !hasStrokes) {
            showPopup("Please add stroke directions for: " + kanjiChar, "オケ", null);
            return;
        }
    }

    //build the word's kanji parts

    const kanjiParts = kanjiPartInputs.map(part => {

        const kanjiChar = part.kanjiInput.value.trim();

        const existing = findExistingKanji(kanjiChar);

        // reuse strokes if kanji already exists
        if (existing) {
            return {
                kanji: kanjiChar,
                strokeDirections: existing.parts[0]?.strokeDirections || []
            };
        }

        // otherwise use user input
        return {
            kanji: kanjiChar,
            strokeDirections: part.strokeSelects.map(sel => sel.value)
        };
    });

    //create entry
    const entry = {
        kanji: newKanji,
        hiragana: newKanjiHiragana,
        meaning: newKanjiMeaning,
        parts: kanjiParts
    };

    kanjiDatabase.push(entry);

    localStorage.setItem(
        "kanjiDatabase",
        JSON.stringify(kanjiDatabase)
    );

    console.log("Saved word:", entry);

    showPopup("New Kanji Saved: " + entry.kanji, "次", null);

    //reset ui
    kanjiPartsContainer.innerHTML = "";
    kanjiPartInputs = [];
    document.getElementById("newKanji").value = "";
    document.getElementById("newKanjiHiragana").value = "";
    document.getElementById("newKanjiMeaning").value = "";
}








// -------------------- HOME PAGE -------------------- // 
kanjiWritingButton.addEventListener("click", () => {
    showPage(kanjiWritingPage)
});

uploadNewKanjiButton.addEventListener("click", () => {
    showPage(uploadNewKanjiPage)
});

flashcardButton.addEventListener("click", () => {
    showPage(flashcardPage)
});

allKanjiButton.addEventListener("click", () => {
    showPage(displayAllKanjiPage)
});

storyPageButton.addEventListener("click", () => {
    showPage(storyPage)
});









// -------------------- FLASHCARDS -------------------- // 


// GET A RANDOM FLASHCARD KANJI AND MODE
function getRandomFlashcard() {
    if (kanjiDatabase.length < 4) {
        return null;
    }

    //get a random kanji
    const kanji = kanjiDatabase[Math.floor(Math.random() * kanjiDatabase.length)]
    //get a random mode
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

    //making sure the current and new flashcards aren't the same
    do {
        flashcard = getRandomFlashcard();
    }
    while (
        kanjiDatabase.length > 4 && currentFlashcard && flashcard.kanji === currentFlashcard.kanji
    );


    if (!flashcard) {
        return
    }

    //updating/keeping track of current and previous flashcard 
    previousFlashCard = currentFlashcard;
    //??ONE OF THESE GOTTA GO
    currentFlashcard = flashcard;

    currentFlashcard = flashcard.kanji
    flashCardMode = flashcard.mode


    //calculating the correct answer and question based on mode
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

    //building the correct and incorrect choices
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
                showPopup("Incorrect.\nThe current answer is: " + correctAnswer, "次", "makeFlashcards");
            }
            flashcardTotalQuestions++;
            updateCounter(flashcardCounter, flashcardTotalQuestions, flashcardCorrectAnswers);

        })
        flashcardChoices.appendChild(choiceButton)
    })

}









// -------------------- ALL KANJI -------------------- // 

// OVERALL RENDER FOR KANJI CARDS
function renderAllKanjiCards() {
    const container = document.getElementById("allKanjiContainer");
    container.innerHTML = "";

    [...kanjiDatabase].reverse().forEach(renderKanjiCard);

    totalKanji.textContent = "Total Kanji: " + kanjiDatabase.length;
}

// INDIVIDUAL RENDERING - USED FOR FILTERING
function renderKanjiCard(eachKanji) {
    const allKanjiContainer = document.getElementById("allKanjiContainer");

    const kanjiCard = document.createElement("div");
    kanjiCard.classList.add("kanjiCard");

    const kanjiTitle = document.createElement("h2");
    kanjiTitle.textContent = eachKanji.kanji;
    kanjiTitle.classList.add("kanjiTitle");

    const kanjiHiragana = document.createElement("h3");
    kanjiHiragana.textContent = eachKanji.hiragana;
    kanjiHiragana.classList.add("kanjiHiragana");

    const kanjiMeaning = document.createElement("h3");
    kanjiMeaning.textContent = eachKanji.meaning;
    kanjiMeaning.classList.add("kanjiMeaning");

    const kanjiStrokeAmount = document.createElement("h3");
    kanjiStrokeAmount.textContent = "Strokes: " + getTotalStrokeCount(eachKanji);
    kanjiStrokeAmount.classList.add("kanjiStrokeAmount");

    const correctnessPercentage = document.createElement("h3");
    correctnessPercentage.style.textAlign = "center";

    kanjiCard.append(
        kanjiTitle,
        kanjiHiragana,
        kanjiMeaning,
        kanjiStrokeAmount
    );

    allKanjiContainer.appendChild(kanjiCard);
    kanjiCard.addEventListener("click", () => {
        showPopup("Delete or Edit?", "Delete", "editKanji", kanjiTitle.textContent);
    })

    totalKanji.textContent = "Total Kanji: " + kanjiDatabase.length;

    //changing kanji card background color based on overall correctness percentage
    const score = eachKanji.correctness ?? null;
    let kanjiCardColor = "#a4a4a4";

    //hasn't been studied yet
    if (score === null) {
        kanjiCardColor = "#a4a4a4";
        correctnessPercentage.textContent = "";
    }
    else {
        correctnessPercentage.textContent = score + "%";

        if (score >= 70) {
            kanjiCardColor = "#80e5a5";
        }
        else if (score >= 45) {
            kanjiCardColor = "#ffe66b";
        }
        else if (score >= 30) {
            kanjiCardColor = "#ffc868";
        }
        else {
            kanjiCardColor = "#ff6a56";
        }
    }


    kanjiCard.style.backgroundColor = kanjiCardColor;

    kanjiCard.append(
        kanjiTitle,
        kanjiHiragana,
        kanjiMeaning,
        kanjiStrokeAmount,
        correctnessPercentage
    );

    allKanjiContainer.appendChild(kanjiCard);
}



// EXPORT DATABASE
exportDatabaseButton.addEventListener("click", () => {
    exportKanjiDatabase();
});

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
    importKanjiFile.value = "";
    importKanjiFile.click();
});


//runs importKanjiDatabase function when the user selects a file from file explorer
importKanjiFile.addEventListener("change", importKanjiDatabase);

function importKanjiDatabase(event) {
    //get the file (first selected file)
    const file = event.target.files?.[0];

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
                JSON.stringify(importedData)
            )
            //confirmation
            showPopup("Kanji Database Imported Successfully!", "次", null);
            //resets 
            currentKanji = null;
            previousKanji = null;
            currentDisplayedKanji = null;
            renderAllKanjiCards();
        }

        catch {
            showPopup("Error. Please Retry.", "オケ", null);
        };
        importKanjiFile.value = "";
    }
    //begins file processing
    reader.readAsText(file);
}


// EDIT A KANJI CARD 
function openEditForm(kanjiName) {

    const closeButton = document.createElement("button");
    closeButton.textContent = "X";
    closeButton.classList.add("closePopupButton");

    closeButton.addEventListener("click", () => {
        closePopup();
    });

    popup.innerHTML = "";

    const entry = findKanjiByName(kanjiName);

    const container = document.createElement("div");
    container.classList.add("editContainer");

    const editContainerInputs = document.createElement("div");
    editContainerInputs.classList.add("editContainerInputs");


    const kanjiInput = document.createElement("input");
    kanjiInput.value = entry.kanji;

    const hiraganaInput = document.createElement("input");
    hiraganaInput.value = entry.hiragana;

    const meaningInput = document.createElement("input");
    meaningInput.value = entry.meaning;

    editContainerInputs.appendChild(kanjiInput);
    editContainerInputs.appendChild(hiraganaInput);
    editContainerInputs.appendChild(meaningInput);

    container.appendChild(closeButton);
    container.appendChild(editContainerInputs);


    //editing kanji strokes 
    const strokeEditor = document.createElement("div");
    strokeEditor.classList.add("strokeEditor");

    const strokeBlocks = [];

    entry.parts.forEach((part, partIndex) => {

        const partBox = document.createElement("div");
        partBox.classList.add("strokePartBox");

        const titleAndDeleteButton = document.createElement("div");
        titleAndDeleteButton.classList.add("titleAndDeleteButton");

        const title = document.createElement("h3");
        title.textContent = part.kanji;

        const deleteKanjiPartButton = document.createElement("button");
        deleteKanjiPartButton.textContent = "X"
        deleteKanjiPartButton.classList.add("deleteKanjiPartButton");

        deleteKanjiPartButton.addEventListener("click", () => {
            //remove from entry data
            entry.parts.splice(partIndex, 1);
            //save updates
            saveKanjiEdits(entry.kanji, { parts: entry.parts });
            //remove UI
            partBox.remove();
        });

        titleAndDeleteButton.appendChild(title);
        titleAndDeleteButton.appendChild(deleteKanjiPartButton);
        partBox.appendChild(titleAndDeleteButton);

        const strokeList = document.createElement("div");
        strokeList.classList.add("strokeList");

        part.strokeDirections.forEach((dir, strokeIndex) => {

            const selectAndDelete = document.createElement("div");

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
                selectAndDelete.remove();
            });

            selectAndDelete.appendChild(select);
            selectAndDelete.appendChild(deleteButton);

            strokeList.appendChild(selectAndDelete);
        });

        // add stroke button
        const addStrokeButton = document.createElement("button");
        addStrokeButton.textContent = "+ Stroke";
        addStrokeButton.classList.add("addStrokeButton");

        addStrokeButton.addEventListener("click", () => {

            const row = document.createElement("div");

            const select = document.createElement("select");

            const strokeEditDeleteButton = document.createElement("button");
            strokeEditDeleteButton.textContent = "X";
            strokeEditDeleteButton.classList.add("strokeEditDeleteButton");

            strokeEditDeleteButton.addEventListener("click", () => {
                row.remove();
            });

            ["top-bottom", "bottom-top", "left-right", "right-left", "diagonal-down", "diagonal-up"].forEach(d => {
                const option = document.createElement("option");
                option.value = d;
                option.textContent = d;
                select.appendChild(option);
            });

            row.appendChild(select);
            row.appendChild(strokeEditDeleteButton);
            strokeList.appendChild(row);
        });

        partBox.appendChild(strokeList);
        partBox.appendChild(addStrokeButton);

        strokeEditor.appendChild(partBox);
    });

    container.appendChild(strokeEditor);

    //save changes 
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.classList.add("saveEditButton");

    saveButton.addEventListener("click", () => {

        entry.kanji = kanjiInput.value;
        entry.hiragana = hiraganaInput.value;
        entry.meaning = meaningInput.value;

        // rebuild stroke structure from DOM
        const newParts = [];

        strokeEditor.querySelectorAll(".strokePartBox").forEach((box, i) => {

            const kanji = box.querySelector("h3").textContent;

            const strokes = Array.from(box.querySelectorAll("select")).map(sel => sel.value);

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

        closePopup();
        renderAllKanjiCards();
    });

    container.appendChild(saveButton);
    popup.appendChild(container);
}


// SAVE KANJI EDITS AND UPDATE IT IN THE DATABASE
function saveKanjiEdits(oldKanji, updatedData) {

    //find kanji index 
    const index = kanjiDatabase.findIndex(k => k.kanji === oldKanji);

    if (index === -1) {
        return;
    }

    //update that kanji with the updated data
    kanjiDatabase[index] = {
        ...kanjiDatabase[index],
        ...updatedData
    };
    //save that to local storahe
    localStorage.setItem("kanjiDatabase", JSON.stringify(kanjiDatabase));
}

// SEARCH FOR KANJI INPUT - UPDATE AS TYPING
searchForKanji.addEventListener("input", () => {
    const requestedKanji = searchForKanji.value.trim()
    filterKanji(requestedKanji);
})


// HANDLES FILTERING/SEARCHING LOGIC
function filterKanji(query) {
    const container = document.getElementById("allKanjiContainer");
    container.innerHTML = "";

    //show restults that match kanji, hiragana, or meaning
    const filtered = [...kanjiDatabase].reverse().filter(entry => {
        return (
            entry.kanji.includes(query) ||
            entry.hiragana.includes(query) ||
            entry.meaning.toLowerCase().includes(query)
        );
    });

    filtered.forEach(renderKanjiCard);

    totalKanji.textContent = "Total Kanji: " + filtered.length;
}


// -------------------- STORY PAGE -------------------- // 
generateStoryWithFileButton.addEventListener("click", () => {
    generatingWithFile = true;
    generatingWithPrompt = false;
    importedStoryFile.value = "";
    importedStoryFile.click();
});

importedStoryFile.addEventListener("change", generateStory);


generateStoryWithPromptButton.addEventListener("click", () => {
    generatingWithPrompt = true;
    generatingWithFile = false;
    generateStory();
});


function generateStory(event) {

    if (generatingWithPrompt) {
        const jsonString = prompt("Paste story JSON here:");
        const data = JSON.parse(jsonString);
        renderStory(data);

        highlightTextButtonYellow.classList.remove("hidden");
        highlightTextButtonBlue.classList.remove("hidden");
        highlightTextButtonPurple.classList.remove("hidden");
        deleteHighlight.classList.remove("hidden");
        return;
    }
    else {

        //get the file (first selected file)
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }
        //browser tool for reading files
        const reader = new FileReader();
        //once file has been fully read
        reader.onload = function (e) {
            try {
                const importedStoryData = JSON.parse(e.target.result);
                //makes sure file is correct format
                if (!importedStoryData.story || !Array.isArray(importedStoryData.questions)) {
                    throw new Error("Invalid format");
                }
                renderStory(importedStoryData);
            }
            catch {
                throw new Error("Error, please try again.");
            }
        }

        reader.readAsText(file);
        importedStoryFile.value = "";
    }

    generatingWithPrompt = false;
    generatingWithFile = false;

    highlightTextButtonYellow.classList.remove("hidden");
    highlightTextButtonBlue.classList.remove("hidden");
    highlightTextButtonPurple.classList.remove("hidden");
    deleteHighlight.classList.remove("hidden");
}


function renderStory(data) {

    const writtenStoryContainer = document.getElementById("writtenStory");
    const multipleChoiceContainer = document.getElementById("multipleChoiceContainer");

    writtenStoryContainer.innerHTML = "";
    multipleChoiceContainer.innerHTML = "";

    // STORY
    const storyText = document.createElement("p");
    storyText.textContent = data.story;
    writtenStoryContainer.appendChild(storyText);

    let mcQuestionNumber = 0;

    // QUESTIONS
    data.questions.forEach((currentQuestion, index) => {
        mcQuestionNumber++;

        const block = document.createElement("div");
        block.classList.add("questionBlock");

        const questionText = document.createElement("h3");
        questionText.textContent = mcQuestionNumber + ". " + currentQuestion.question;

        block.appendChild(questionText);

        currentQuestion.choices.forEach((choice, choiceIndex) => {

            const btn = document.createElement("button");
            btn.textContent = choice;

            btn.addEventListener("click", () => {

                if (choiceIndex === currentQuestion.answer) {
                    showPopup("正解", "次", null);
                    btn.style.backgroundColor = "#D6E5BD";
                } else {
                    showPopup("違います", "次", null);
                    btn.style.backgroundColor = "salmon";
                }
            });

            block.appendChild(btn);
        });

        multipleChoiceContainer.appendChild(block);
    });
}

// handles detecting when the user has highlighted a piece of text 
document.addEventListener("selectionchange", () => {
    //get what the user highlighted 
    const selection = window.getSelection();
    //make sure selection exists and it actually has a start to end, and make sure its not empty with spaces removed
    if (selection && selection.rangeCount && selection.toString().trim().length > 0) {
        //saves the highlight position so that it can be used later even if the selection disappears 
        // (mainly to work with mobile where selection will go away to hit the highlight button)
        savedRange = selection.getRangeAt(0).cloneRange();
        highlightTextButtonYellow.disabled = false;
        highlightTextButtonBlue.disabled = false;
        highlightTextButtonPurple.disabled = false;
        deleteHighlight.disabled = false;
    }
    else {
        highlightTextButtonYellow.disabled = true;
        highlightTextButtonBlue.disabled = true;
        highlightTextButtonPurple.disabled = true;
        deleteHighlight.disabled = true;
    }
});

// Gets the background color for the highlight based on the button
highlightTextButtonYellow.addEventListener("click", () => {
    highlightSelection("rgba(255, 191, 0, 0.6)");
});

highlightTextButtonBlue.addEventListener("click", () => {
    highlightSelection("rgba(87, 221, 255, 0.6)");
});

highlightTextButtonPurple.addEventListener("click", () => {
    highlightSelection("rgba(223, 172, 255, 0.6)");
});

deleteHighlight.addEventListener("click", () => {
    deleteHighlightSelection();
})


// HIGHLIGHTS A SELECTION
function highlightSelection(backgroundColor) {

    //if no saved range 
    if (!savedRange) {
        showPopup("Please highlight at least one line.", "オケ", null);
        return;
    }

    const span = document.createElement("span");
    span.classList.add("highlight");
    span.style.backgroundColor = backgroundColor;

    try {
        //removes the selected range from the DOM and stores it into extracted 
        const extracted = savedRange.extractContents();
        //puts it into the span which has a highlight class
        span.appendChild(extracted);
        //put it back into the DOM/the line so that it's the word/words in the line that have the highlight class
        savedRange.insertNode(span);
    }
    catch {
        showPopup("Could not highlight selection", "オケ", null);
        return;
    }

    //reset 
    window.getSelection().removeAllRanges();
    savedRange = null;
}


// DELETES A HIGHLIGHT SELECTION
function deleteHighlightSelection() {

    if (!savedRange) {
        showPopup("Please select highlighted text first.", "オケ", null);
        return;
    }

    //finds the lowest common parent node of the selection 
    const container = savedRange.commonAncestorContainer;
    //if the container is a text node, then move up to the parent element
    // otherwise use the container directly
    const element = container.nodeType === 3 ? container.parentElement : container;
    //check if this contains a highlight
    if (!element || !element.classList.contains("highlight")) {
        showPopup("Selected text is not highlighted.", "オケ", null);
        return;
    }
    //get the parent of the highlight span
    const parent = element.parentNode;
    //take everyrthing inside of span and move it out before the span (aka removing it out of the highlight)
    while (element.firstChild) {
        parent.insertBefore(
            element.firstChild,
            element
        );
    }

    //remove the highlight spam element
    parent.removeChild(element);

    //resets
    savedRange = null;
    //removes the blue selection highlight from the screen 
    window.getSelection().removeAllRanges();
}












// -------------------- HELPER FUNCTIONS -------------------- // 

// SHOWS A PAGE AND HIDES ALL OTHERS
function showPage(pageToShow) {

    if (!pageToShow) {
        pageToShow = homePage;
    }

    if (popup.classList.contains("open")) {
        popup.classList.remove("open");
        popup.classList.add("immediateclose");
    }

    const pages = [homePage, kanjiWritingPage, uploadNewKanjiPage, flashcardPage, displayAllKanjiPage, storyPage];

    pages.forEach(page => {
        page.style.display = "none";
    });

    pageToShow.style.display = "flex";
    localStorage.setItem("currentPage", pageToShow.id);

    // ------ KANJI WRITING PAGE
    if (pageToShow == kanjiWritingPage) {
        hintText.classList.add("hidden");
        hintPressed = false;
        showStrokesHelpImageButtonPressed = false;
        toggleStrokeHelpImageState = false;
        displayDirections.innerHTML = "";
        displayDirections.classList.remove("hidden");
        displayDirections.classList.remove("answer");
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
        searchForKanji.value = "";
    }

    // ------ STORY PAGE
    if (pageToShow == storyPage) {
        highlightTextButtonYellow.classList.add("hidden");
        highlightTextButtonBlue.classList.add("hidden");
        highlightTextButtonPurple.classList.add("hidden");
        deleteHighlight.classList.add("hidden");
        document.documentElement.style.setProperty('--pageColor', '#FFADAD');
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
    popup.classList.remove("immediateclose");
    popup.classList.add("open");

    const title = document.createElement("h2");
    title.textContent = text;
    popup.appendChild(title);

    //create a new button every time to prevent old buttons from firing 
    const popupButton = document.createElement("button");
    popupButton.classList.add("deleteButton");
    popupButton.textContent = buttonText;


    // remove old edit button logic handled naturally now
    if (buttonFunction === "editKanji") {

        const closeButton = document.createElement("button");
        closeButton.textContent = "X";
        closeButton.classList.add("closePopupButton");

        closeButton.addEventListener("click", () => {
            closePopup();
        });

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("editButton");

        editButton.addEventListener("click", () => {
            openEditForm(payload);
        });

        popup.appendChild(editButton);
        popup.appendChild(closeButton);

    }

    if (buttonFunction === "displayRandomKanji") {

        const radioBoxContainer = document.createElement("div");

        const correctRow = document.createElement("div");
        correctRow.classList.add("radioCheckBox");

        const correctRadio = document.createElement("input");
        correctRadio.type = "radio";
        correctRadio.name = "result";
        correctRadio.value = "correct";

        const correctLabel = document.createElement("label");
        correctLabel.textContent = "Override - Correct";

        correctRow.appendChild(correctRadio);
        correctRow.appendChild(correctLabel);
        radioBoxContainer.appendChild(correctRow);

        const incorrectRow = document.createElement("div");
        incorrectRow.classList.add("radioCheckBox");

        const incorrectRadio = document.createElement("input");
        incorrectRadio.type = "radio";
        incorrectRadio.name = "result";
        incorrectRadio.value = "incorrect";

        const incorrectLabel = document.createElement("label");
        incorrectLabel.textContent = "Override - Incorrect";

        incorrectRow.appendChild(incorrectRadio);
        incorrectRow.appendChild(incorrectLabel);
        radioBoxContainer.appendChild(incorrectRow);

        popup.appendChild(radioBoxContainer);

        const selected = document.querySelector('input[name="result"]:checked');

        if (selected?.value === "correct") {
            override = "correct";
        }
        else if (selected?.value === "incorrect") {
            override = "incorrect";
        }
        else {
            override = null;
        }
    }

    popup.appendChild(popupButton);

    popupButton.addEventListener("click", () => {

        closePopup();

        if (buttonFunction === "displayRandomKanji") {

            let updatedCorrectness = currentDisplayedKanji.correctness ?? 0;
            const selected = document.querySelector('input[name="result"]:checked');

            if (selected?.value === "correct") {
                updatedCorrectness = Math.round((updatedCorrectness + 100) / 2);
            }

            else if (selected?.value === "incorrect") {
                updatedCorrectness = Math.round(updatedCorrectness / 2);
            }

            updatedCorrectness = Math.max(0, updatedCorrectness);
            saveKanjiEdits(currentDisplayedKanji.kanji, { correctness: updatedCorrectness });

            console.log("Updated Correctness: " + updatedCorrectness);
            displayRandomKanji();
        }

        if (buttonFunction === "makeFlashcards") {
            makeFlashcards();
        }

        if (buttonFunction === "editKanji") {
            deleteKanjiByName(payload);
            renderAllKanjiCards();
            return;
        }
    });
}


function closePopup() {
    popup.classList.remove("open");
    popup.classList.remove("immediateclose");
    popup.classList.add("close");
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

function findExistingKanjiOnly(char) {
    return kanjiDatabase.some(entry => entry.kanji == char);
}

function getTotalStrokeCount(wordData) {

    if (!wordData || !wordData.parts) return 0;

    return wordData.parts.reduce((total, part) => {
        return total + (part.strokeDirections?.length || 0);
    }, 0);
}
