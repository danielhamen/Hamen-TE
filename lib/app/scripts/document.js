const defaultFormatting = {
    fontSize: "12pt"
}

function updateCursor() {
    let cursor = document.querySelector(".cursor");
    if (!cursor) {
        cursor = document.createElement("cursor");
        cursor.classList.add("cursor");
        document.body.appendChild(cursor);
    }

    // Move cursor to selected text:
    let activeChar = document.querySelector(".single-char.active");
    if (activeChar) {
        activeChar = activeChar.getBoundingClientRect();
        cursor.style.left = (activeChar.left + activeChar.width).toString() + "px";
        cursor.style.top = activeChar.top.toString() + "px";
    }
}

// Sets the correct icons based on the active character (eg. if the character is bold, the bold icon would be selected, or if the paragraph is centered, the "align" button on the toolbar would be set to "format_align_center"):
function updateCharacterStyles() {
    // Get active paragraph & character:
    let activeP = document.querySelector(".document-paragraph.active");
    let activeChar = document.querySelector(".single-char.active");

    // Set alignment:
    let alignIcon = document.getElementById("tool-panel-alignment").children[0];
    let contains = false;
    ["left", "center", "right", "justify"].forEach(alignment => {
        if (activeP.classList.contains(alignment) && !contains) {
            contains = true;
            alignIcon.innerHTML = "format_align_" + alignment;
        }
    })
    if (!contains) { alignIcon.innerHTML = "format_align_left"; }
}

// 
function setFooterWordCount() {
    // Total Pages:
    let totalPages = document.querySelectorAll(".single-page").length;
    document.querySelector("#word-count-pages").innerHTML = totalPages + " Page(s)";
    document.querySelector("#word-count-dialog-pages").innerHTML = totalPages;

    // Total Words:
    let totalWords = document.querySelector(".documents").outerText.split(" ").length;
    document.querySelector("#word-count-words").innerHTML = totalWords + " Word(s)";
    document.querySelector("#word-count-dialog-words").innerHTML = totalWords;

    // Total Characters:
    let totalCharacters = document.querySelector(".documents").outerText.length;
    document.querySelector("#word-count-characters").innerHTML = totalCharacters + " Character(s)";
    document.querySelector("#word-count-dialog-chars").innerHTML = totalCharacters;

    // Total Characters (Without Spaces):
    let totalCharactersNoSpaces = document.querySelector(".documents").outerText.replace(" ", "").length;
    document.querySelector("#word-count-characters-no-spaces").innerHTML = totalCharactersNoSpaces + " Characters (Without Spaces)";
    document.querySelector("#word-count-dialog-chars-ns").innerHTML = totalCharactersNoSpaces;
}

function disableTyping() {
    document.querySelector(".documents").setAttribute("typing-disabled", "true");
    document.querySelector(".cursor").style.visibility = "hidden";
}

function enableTyping() {
    document.querySelector(".documents").removeAttribute("typing-disabled");
    document.querySelector(".cursor").style.visibility = "visible";
}

window.addEventListener("load", function() {
    let page = document.querySelector(".single-page.active");
    page = page.querySelector(".document-content");
    
    let keyActions = [
        "Tab",
        "Enter",
        "Backspace",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Delete"
    ];

    window.addEventListener("keydown", function(e) {
        // TODO: Make the cursor not blink:
        // let cursor = document.querySelector(".cursor");
        // cursor.classList.add("paused");
        // const stopBlink = setTimeout(function() {
        //    cursor.classList.remove("paused");
        // }, 3000);

        let p = document.querySelector(".document-paragraph.active");
        
        // User wants to type something:
        if (!document.querySelector(".documents").getAttribute("typing-disabled")) {
            // Form keycode (Eg. ["Ctrl", "Alt", "z"]):
            let keyCode = [];
            if (e.ctrlKey) { keyCode.push("Ctrl") }
            if (e.altKey) { keyCode.push("Alt") }
            if (e.metaKey) { keyCode.push("Meta") }
            if (e.shiftKey) { keyCode.push("Shift") }
            if (["Control", "Shift"].indexOf(e.key) === -1) { keyCode.push(e.key); }

            // Remove duplicates
            keyCode = [...new Set(keyCode)];
            for (let i = 0; i < keyCode.length; i++) {
                keyCode[i] = keyCode[i].toLowerCase();
            }

            // Make the keycode a string (Eg. ["Ctrl", "z"] -> "ctrl+z")
            keyCode = keyCode.join("+");

            // Shortcut exists
            let shortcutAction = shortcutActions[keyCode];
            if (shortcutAction) {
                // Shortcut exists...

                // Execute the shortcut action and add the parameters:
                if (shortcutAction[1]) {
                    shortcutAction[0](shortcutActions[1]);
                } else {
                    // Execute the shortcut without parameters (none were given)...

                    shortcutAction[0]();
                }

                e.preventDefault();
            } else if (!e.ctrlKey && !e.altKey && !e.metaKey) {
                EditorAPI.document.insertChar(e.key);
            }

            // Don't execute `e.preventDefault()` here as if you try to use "Ctrl + R" or something that doesn't have a shortcut, it will prevent that key from being executed
        }

        updateCursor();
    })

    // Focus documents on click:
    Array.from(document.querySelectorAll(".single-page")).forEach(doc => {
        doc.addEventListener("click", function() {
            // document.querySelector(".documents").removeAttribute("disabled");
            enableTyping();
        })
    })
})
