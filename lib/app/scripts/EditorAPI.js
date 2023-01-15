const EditorAPI = {
    document: {
        insertNewLine() {
            // Insert New Line...

            // Make active character not active:
            document.querySelector(".single-char.active").classList.remove("active");

            let activePage_ = document.querySelector(".single-page.active");
            activePage_ = activePage_.querySelector(".document-content");

            // 
            document.querySelector(".document-paragraph.active").classList.remove("active");
            activePage_.innerHTML += `<p class="document-paragraph active"><span class="single-char active" style="height: ${defaultFormatting.fontSize};">&ZeroWidthSpace;</span></p>`;
        }, insertChar(char) {
            // Inserts a new character at the cursor...

            // Characters ( len > 1 ) that will be accepted:
            let ignoreExceptions = [
                "&nbsp;",
                "&emsp;"
            ]

            // Ignore things like "Shift", "Capslock", "F11", etc:
            if (char.length === 1 || ignoreExceptions.indexOf(char) !== -1) {
                let activeP = document.querySelector(".document-paragraph.active");

                // Create new span for the character (innerHTML = `char` and the cursor will be after it):
                let span = document.createElement("span");
                span.classList.add("single-char");
                span.classList.add("active");
                span.innerHTML = char;

                // Insert after active character:
                let activeChar = document.querySelector(".single-char.active");
                activeP.insertBefore(span, activeChar.nextSibling);

                // Make the old active character not active:
                activeChar.classList.remove("active");
            }

            updateCursor();
        }, backspace() {
            // Backspace...

            // Get the active character:
            let activeChar = document.querySelector(".single-char.active");

            // Make the character previous to `activeChar` active:
            let prevChar = activeChar.previousElementSibling;
            if (prevChar) {
                // 
                prevChar.classList.add("active")

                // Remove the old active character
                activeChar.remove();
            }

            // Previous character does not exist (most likely because `activeChar` was the first character of a sentence)
            // In this case, we have to find the previous line, then make that line active (and the last character on that line):
            else {
                let activeP = document.querySelector(".document-paragraph.active");
                let prevActiveP = activeP.previousElementSibling;
                if (prevActiveP) {
                    prevActiveP.classList.add("active");
                    prevActiveP.lastElementChild.classList.add("active");

                    activeP.remove();
                }
            }
        }, alignCenter() {
            // Align the active paragraph to center
            let activeP = document.querySelector(".document-paragraph.active");
            activeP.classList.remove("left", "right", "center", "justify");
            activeP.classList.add("center");
        }, alignLeft() {
            // Align the active paragraph left
            let activeP = document.querySelector(".document-paragraph.active");
            activeP.classList.remove("left", "right", "center", "justify");
            activeP.classList.add("left");
        }, alignRight() {
            // Align the active paragraph
            let activeP = document.querySelector(".document-paragraph.active");
            activeP.classList.remove("left", "right", "center", "justify");
            activeP.classList.add("right");
        }, alignJustify() {
            // Align the active paragraph
            let activeP = document.querySelector(".document-paragraph.active");
            activeP.classList.remove("left", "right", "center", "justify");
            activeP.classList.add("justify");
        }
    }, navigation: {
        selectCharLeft() {
            // Select the character to the left...

            let singleChars = document.querySelectorAll(".single-char");
            let previous;
            let exit = false;
            for (let i = 0; i < singleChars.length; i++) {
                const char = singleChars[i];

                // Highlight the previous character:
                if (previous && char.classList.contains("active")) {
                    // Make the previous character active and the current active character not active:
                    previous.classList.add("active");
                    char.classList.remove("active");

                    // Make the previous character's paragraph active:
                    document.querySelector(".document-paragraph.active").classList.remove("active");
                    previous.parentElement.classList.add("active");

                    updateCursor();
                    break;
                }

                previous = char;
            }
        }, selectCharRight() {
            // Select the character to the right...
            let singleChars = document.querySelectorAll(".single-char");
            for (let i = 0; i < singleChars.length - 1; i++) {
                const char = singleChars[i];
                if (char.classList.contains("active") && singleChars[i + 1]) {
                    char.classList.remove("active");
                    singleChars[i + 1].classList.add("active");
                    
                    // Make the next character's paragraph active:
                    document.querySelector(".document-paragraph.active").classList.remove("active");
                    singleChars[i + 1].parentElement.classList.add("active");

                    break;
                }
            }
        }, selectCharUp() {
            // Select the above character...
        }, selectCharDown() {
            // Select the below character...
        }
    }, dialog: {}
}

EditorAPI.document.insertTab = function() {
    // for (let i = 0; i < 1; i++) {
    EditorAPI.document.insertChar("&emsp;");
    // }
}

EditorAPI.dialog.toggleAccents = function() {
    document.querySelector(".accents-dialog").style.display = "flex";
}

EditorAPI.dialog.toggleWordCount = function() {
    document.querySelector(".word-count-dialog").style.display = "flex";
}