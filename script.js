// Select the necessary DOM elements
let letters = document.querySelector(".letters");
const hangmanImageElement = document.querySelector(".hangman-img img");
const resultGifElement = document.querySelector(".result-gif");
const resultGifImage = resultGifElement.querySelector("img");
const hintTextElement = document.querySelector(".hint-text"); // Element to display the hint
const restartButton = document.getElementById("restart-button"); // Restart button

//Purpose: This section selects various HTML elements that will be manipulated during the game.
//document.querySelector() is used to select elements based on their class or ID, and the selected elements are stored in variables for later use.


// Array of words and their corresponding hints
const wordsWithHints = [
    { word: "ALGORITHM", hint: "A step-by-step procedure for solving a problem or completing a task." },
    { word: "VARIABLE", hint: "A storage location identified by a name that can hold different values during program execution." },
    { word: "ARRAY", hint: "A collection of elements, each identified by at least one array index or key." },
    { word: "RECURSION", hint: "A programming technique where a function calls itself to solve smaller instances of the same problem." },
    { word: "OBJECT", hint: "An instance of a class in object-oriented programming, containing data and methods." },
    { word: "COMPILER", hint: "A program that translates source code written in a high-level programming language into machine code." },
    { word: "DATABASE", hint: "An organized collection of data that can be easily accessed, managed, and updated." },
    { word: "SERVER", hint: "A computer or system that provides resources, data, or services to other computers over a network." }
];

// Function to randomly select a word and its hint
function selectRandomWord() {
    const randomIndex = Math.floor(Math.random() * wordsWithHints.length);
    return wordsWithHints[randomIndex];
}//Math.random() generates a random number between 0 and 1, which is then multiplied by the length of the array and rounded down to get a valid index.

// Initialize game variables
let guessedLetters = []; // Array to keep track of guessed letters
let incorrectGuessCount = 0;
let wordToGuess; // The word that will be guessed

// Array of hangman image paths
const hangmanImages = [
    "./images/hangman-1.svg",
    "./images/hangman-2.svg",
    "./images/hangman-3.svg",
    "./images/hangman-4.svg",
    "./images/hangman-5.svg",
    "./images/hangman-6.svg",
    "./images/hangman-7.svg",
    "./images/hangman-1.svg"
];

// Define paths for victory and loss GIFs
const victoryGifPath = "./images/victory.gif"; // Path for victory GIF
const lostGifPath = "./images/lost.gif"; // Path for loss GIF

// Function to start or restart the game
function restartGame() {
    // Select a random word and hint
    const selectedWord = selectRandomWord();
    wordToGuess = selectedWord.word;
    const hintText = selectedWord.hint;

    // Reset guessed letters and incorrect guess count
    guessedLetters = [];
    incorrectGuessCount = 0;

    // Clear previous letters and set new blanks
    clearPreviousLetters();
    setBlanksForWord();

    // Display the hint for the current word
    hintTextElement.textContent = `Hint: ${hintText}`;

    // Reset display for incorrect guesses
    document.querySelector(".guess-text").textContent = `Incorrect guesses: ${incorrectGuessCount} / 6`;

    // Enable all keyboard buttons for guessing
    const keyboardButtons = document.querySelectorAll(".keyboard button");
    keyboardButtons.forEach(button => {
        button.disabled = false; // Re-enable all buttons
    });

    // Reset hangman image to initial stage
    updateImage();

    // Hide the result GIF and restart button
    resultGifElement.style.display = "none";
    restartButton.style.display = "none";
}

// Function to clear previous letters from the display
function clearPreviousLetters() {
    const letterDisplay = document.querySelector(".word-display");
    letterDisplay.innerHTML = ""; // Clear the display
}

// Function to set blanks based on the word's length
function setBlanksForWord() {
    const letterDisplay = document.querySelector(".word-display");
    for (let i = 0; i < wordToGuess.length; i++) {
        const letterElement = document.createElement("span");
        letterElement.classList.add("letter");
        letterElement.textContent = "__"; // Display underscores
        letterDisplay.appendChild(letterElement); // Append to the display(after)
    }
}

// Function to handle each guessed letter
function handleGuess(button) {
    const guessedLetter = button.textContent; // Get the letter from the button text

    // Disable the button after it’s clicked
    button.disabled = true;

    // Check if the letter has already been guessed
    if (guessedLetters.includes(guessedLetter)) {
        alert("You've already guessed that letter!"); // Alert for already guessed letter
        return; // Prevent further processing
    }

    // Add guessed letter to the list of guessed letters
    guessedLetters.push(guessedLetter);

    // Check if the guessed letter is in the word
    if (wordToGuess.includes(guessedLetter)) {
        // Reveal each matching letter in wordToGuess
        document.querySelectorAll(".word-display .letter").forEach((letterElement, index) => {
            if (wordToGuess[index] === guessedLetter) {
                letterElement.textContent = guessedLetter; // Show the letter in the correct position
            }
        });

        // Check if the player has won
        if (Array.from(document.querySelectorAll(".word-display .letter")).every(letter => letter.textContent !== "__")) {
            showResult(victoryGifPath);
        }
    } else {
        // Increase the count and update the image for an incorrect guess
        incorrectGuessCount++;
        document.querySelector(".guess-text").textContent = `Incorrect guesses: ${incorrectGuessCount} / 6`;
        updateImage(); // Update the image based on incorrect guess count

        // Check if the player has lost
        if (incorrectGuessCount === 6) {
            showResult(lostGifPath);
        }
    }
}

// Function to update the hangman image based on incorrect guesses
function updateImage() {
    hangmanImageElement.src = hangmanImages[incorrectGuessCount];
}

// Function to show the result GIF
function showResult(gifPath) {
    resultGifImage.src = gifPath; // Set the GIF source
    resultGifElement.style.display = "flex"; // Show the result GIF
    restartButton.style.display = "block"; // Show the restart button
}

// Add event listeners to each keyboard button
document.querySelectorAll(".keyboard button").forEach(button => {
    button.addEventListener("click", () => handleGuess(button));
});

// Add event listener to the restart button
restartButton.addEventListener("click", restartGame);

// Initialize the game when the page loads
restartGame();
