function newZWC() {
    let zwc = document.createElement("span");
    zwc.classList.add("single-char", "zwc");
    zwc.innerHTML += "&ZeroWidthSpace;";
    return zwc;
}

const EditorAPI = {
    document: {
        insertNewLine() {
            // Insert New Line...

            // Make active character not active:
            document.querySelector(".single-char.active").classList.remove("active");

            // 
            let p = document.createElement("p");
            p.classList.add("document-paragraph");
            p.classList.add("active");
            p.innerHTML = `<span class="single-char active zwc" style="height: ${defaultFormatting.fontSize};">&ZeroWidthSpace;</span>`;

            let activeP = document.querySelector(".document-paragraph.active")
            activeP.classList.remove("active");
            activeP.parentElement.insertBefore(p, activeP.nextElementSibling);
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

                // Add char click event listener:
                span.addEventListener("click", function(e) {
                    // Deactivate the current active character & paragraph:
                    document.querySelector(".single-char.active").classList.remove("active");
                    document.querySelector(".document-paragraph.active").classList.remove("active");

                    // If the user clicks the left-part of the character, select the previous character:
                    let isNext = true;
                    let rect = span.getBoundingClientRect();
                    if (e.clientX - rect.x <= 3) {
                        // Make the character to the left of the span active...

                        let prev = span.previousElementSibling;
                        if (prev) {
                            isNext = false;
                            prev.classList.add("active");
                            prev.parentElement.classList.add("active");
                        }
                    }
                    
                    if (isNext) {
                        // Make the span active...

                        span.classList.add("active");
                        span.parentElement.classList.add("active");
                    }
                })
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
        }, deleteChar() {
            // Removes the character after the active character (DEL button)...

            let activeChar = document.querySelector(".single-char.active");
            let chars = Array.from(document.querySelectorAll(".single-char"));
            let sibling = chars[chars.indexOf(activeChar) + 1];
            if (sibling) {
                if (sibling.classList.contains("zwc")) {
                    // Remove the newline / move all characters on next line to this line...

                    let newLineCharacters = Array.from(sibling.parentElement.children);
                    newLineCharacters.forEach(char => {
                        if (!char.classList.contains("zwc")) {
                            activeChar.parentElement.appendChild(char);
                        }
                    });

                    // Remove spacing between the first of the new characters:
                    // let children = activeChar.parentElement.children;

                    sibling.parentElement.remove();
                } else if (sibling.parentElement !== activeChar.parentElement) {
                    if (sibling.parentElement.children.length <= 2) {
                        sibling.parentElement.remove();
                    } else {
                        sibling.remove();
                    }
                } else {
                    sibling.remove();
                }

                // Remove spacing after each span in the paragraph:
                let activeP = document.querySelector(".document-paragraph.active");
                let newInnerHTML = "";
                for (let i = 0; i < activeP.children.length; i++) {
                    const child = activeP.children[i];
                    newInnerHTML += child.outerHTML;
                }; activeP.innerHTML = newInnerHTML;
            }
        }, getSelection() {
            // Returns a list of all the selected characters...

            let sel = getSelection();
            let first = sel.baseNode.parentNode;
            let last = sel.focusNode.parentNode;

            if (!first.classList.contains("single-char") || !last.classList.contains("single-char")) {
                // If there's a glitch in Ctrl + A, the body is sometimes selected so in this case, add all the characters

                let allChars = [];
                Array.from(document.querySelectorAll(".single-char")).forEach(char => {
                    if (!char.classList.contains("zwc")) {
                        allChars.push(char);
                    }
                })

                return allChars;
            } else {
                let chars = Array.from(document.querySelectorAll(".single-char"));

                first = chars.indexOf(first);
                last = chars.indexOf(last);

                if (first < last) {
                    return chars.slice(first, last + 1)
                } else {
                    return chars.slice(last, first + 1)
                }
            }
        }, format: {
            
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

            updateCharacterStyles();
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

            updateCharacterStyles();
        }, selectCharUp() {
            // Select the above character...

            updateCharacterStyles();
        }, selectCharDown() {
            // Select the below character...

            updateCharacterStyles();
        }, selectLineEnd() {
            // Selects the end of the line...

            let activeChar = document.querySelector(".single-char.active");
            activeChar.classList.remove("active");
            activeChar.parentElement.lastElementChild.classList.add("active");
        }
    }, dialog: {}
}

EditorAPI.document.insertTab = function() {
    EditorAPI.document.insertChar("&emsp;");
}

// Align text - Center:
EditorAPI.document.format.alignCenter = function(changeIcon = true) {
    if (changeIcon) { document.getElementById("tool-panel-alignment").children[0].innerHTML = "format_align_center" }
    let activeP = document.querySelector(".document-paragraph.active");
    activeP.classList.remove("left", "right", "center", "justify");
    activeP.classList.add("center");
}

// Align text - Left:
EditorAPI.document.format.alignLeft = function(changeIcon = true) {
    if (changeIcon) { document.getElementById("tool-panel-alignment").children[0].innerHTML = "format_align_left" }
    let activeP = document.querySelector(".document-paragraph.active");
    activeP.classList.remove("left", "right", "center", "justify");
    activeP.classList.add("left");
}

// Align text - Right:
EditorAPI.document.format.alignRight = function(changeIcon = true) {
    if (changeIcon) { document.getElementById("tool-panel-alignment").children[0].innerHTML = "format_align_right" }
    let activeP = document.querySelector(".document-paragraph.active");
    activeP.classList.remove("left", "right", "center", "justify");
    activeP.classList.add("right");
}

// Align text - Justify:
EditorAPI.document.format.alignJustify = function(changeIcon = true) {
    if (changeIcon) { document.getElementById("tool-panel-alignment").children[0].innerHTML = "format_align_justify" }
    let activeP = document.querySelector(".document-paragraph.active");
    activeP.classList.remove("left", "right", "center", "justify");
    activeP.classList.add("justify");
},

EditorAPI.document.format.setFontWeight = function(fontWeight = 600) {
    EditorAPI.document.getSelection().forEach(char => {
        char.classList.toggle("bold-" + fontWeight);
        char.classList.remove("bold");
    });
}

EditorAPI.document.format.boldText = function() {
    let sel = EditorAPI.document.getSelection();
    if (sel[0].classList.contains("bold")) {
        sel.forEach(char => {
            char.classList.add("regular");
            char.classList.remove("bold");
        });
    } else {
        sel.forEach(char => {
            char.classList.remove("regular");
            char.classList.add("bold");
        });
    }
}

EditorAPI.document.format.underlineText = function() {
    let sel = EditorAPI.document.getSelection();
    if (sel[0].classList.contains("underline")) {
        sel.forEach(char => {
            char.classList.add("no-underline");
            char.classList.remove("underline");
        });
    } else {
        sel.forEach(char => {
            char.classList.remove("no-underline");
            char.classList.add("underline");
        });
    }
}

EditorAPI.document.format.italicizeText = function() {
    let sel = EditorAPI.document.getSelection();
    if (sel[0].classList.contains("italic")) {
        sel.forEach(char => {
            char.classList.add("no-italic");
            char.classList.remove("italic");
        });
    } else {
        sel.forEach(char => {
            char.classList.remove("no-italic");
            char.classList.add("italic");
        });
    }
}

EditorAPI.dialog.toggleAccents = function() {
    document.querySelector(".accents-dialog").style.display = "flex";
}

EditorAPI.dialog.toggleWordCount = function() {
    document.querySelector(".word-count-dialog").style.display = "flex";
}