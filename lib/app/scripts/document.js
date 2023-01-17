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
    
    let keyActions = {
        "Tab": EditorAPI.document.insertTab,
        "Enter": EditorAPI.document.insertNewLine,
        "Backspace": EditorAPI.document.backspace,
        "ArrowLeft": EditorAPI.navigation.selectCharLeft,
        "ArrowRight": EditorAPI.navigation.selectCharRight,
        "ArrowUp": EditorAPI.navigation.selectCharUp,
        "ArrowDown": EditorAPI.navigation.selectCharDown,
        "Delete": EditorAPI.document.deleteChar
    };

    // List of keyboard shortcuts and their actions
    // Format:
    // {
    //    "<ctrl>+<alt>+<shift>+<char>": [<function>, <[list, of, arguments]>]
    // }
    let shortcutActions = {
        "ctrl+shift+a": [EditorAPI.dialog.toggleAccents],
        "ctrl+alt+shift+w": [EditorAPI.dialog.toggleWordCount],
        "ctrl+shift+l": [EditorAPI.document.alignLeft],
        "ctrl+shift+e": [EditorAPI.document.alignCenter],
        "ctrl+shift+r": [EditorAPI.document.alignRight],
        "ctrl+shift+j": [EditorAPI.document.alignJustify],
    };

    window.addEventListener("keydown", function(e) {
        // Make the cursor not blink:
        let cursor = document.querySelector(".cursor");
        cursor.classList.add("paused");
        const stopBlink = setTimeout(function() {
            cursor.classList.remove("paused");
        }, 3000);

        let p = document.querySelector(".document-paragraph.active");
        let keyAction = keyActions[e.key];
        
        // User wants to type something:
        if (!document.querySelector(".documents").getAttribute("typing-disabled")) {
            if (!e.ctrlKey && !e.altKey && !e.metaKey && !(e.key.length > 1 && e.key.startsWith("F"))) {
                if (e.key === " ") {
                    EditorAPI.document.insertChar("&nbsp;");
                    e.preventDefault();
                } else if (keyAction) {
                    keyAction(page);
                    e.preventDefault();
                } else {
                    EditorAPI.document.insertChar(e.key);
                    e.preventDefault();
                }

                updateCursor();
            }
    
            // User wants to use a hotkey:
            else {
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

                // 
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

                    // 
                    e.preventDefault();
                } else {
                    // Shortcut does not exist...
                }
            }
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

    document.querySelector(".documents").addEventListener("resize", updateCursor);
    window.addEventListener("scroll", updateCursor);
})