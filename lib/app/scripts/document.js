const defaultFormatting = {
    fontSize: "12px",
    tabSize: 4
}

const EditorAPI = {
    navigation: {
        selectRight(doc) {
        }
    },
    document: {
        insertNewLine(doc) {
            // document.getElementsByClassName("cursor-character")[0].classList.remove("cursor-character");

            // doc.innerHTML += `<span class="single-character cursor-character line-break"></span>`;
            doc.innerHTML += `<br>`;
            // doc.innerHTML += `<span class="single-character cursor-character line-break">&ZeroWidthSpace;</span>`;
            updateCursor();
            // doc.innerHTML += `<span class="single-character cursor-character" style="display: block;">&#8203</span>`;
        },

        insertCharacter(doc, char) {
            let characterElement = document.createElement("span");
            characterElement.classList.add("single-character");
            characterElement.innerHTML = char;

            // Remove pre-existing cursors:
            Array.from(document.querySelectorAll(".cursor-character")).forEach(element => {
                element.classList.remove("cursor-character");
            })

            characterElement.classList.add("cursor-character");

            doc.appendChild(characterElement);

            updateCursor();
        },

        // Removes the last character at cursor:
        backspace(doc) {
            let cursorCharacter = doc.querySelector(".cursor-character");
            let characters = doc.querySelectorAll(".single-character");
            let previousCharacter = characters[Array.from(characters).indexOf(cursorCharacter) - 1];
            if (previousCharacter) {
                cursorCharacter.remove();
                previousCharacter.classList.add("cursor-character");
                updateCursor();
            }
        },

        // Inserts a tab, or indent:
        insertTab(doc) {
            let tab = "&nbsp;".repeat(defaultFormatting.tabSize);
            EditorAPI.document.insertCharacter(doc, tab);
        }
    }
}

function updateCursor() {
    // Find cursor (if it doesn't exist, make one):
    let cursor = document.querySelector(".cursor");
    if (!cursor) {
        cursor = document.createElement("div");
        cursor.classList.add("cursor");
        document.body.appendChild(cursor);
    }

    // Add cursor after character:
    let cursorCharacter = document.querySelector(".cursor-character");
    if (cursorCharacter) {
        let rect = cursorCharacter.getBoundingClientRect();
        cursor.style.left = parseInt(rect.left) + parseInt(rect.width) + "px";
        cursor.style.top = rect.top.toString() + "px";

        // Make the cursor the same height as the character:
        cursor.style.height = rect.height.toString() + "px";
    }
}

var activeDocument = 0;
function documentEventListeners() {
    let documents = Array.from(document.querySelectorAll(".document\\:document"));
    window.addEventListener("keydown", (e) => {
        let doc = documents[activeDocument];
        if (!e.ctrlKey && !e.altKey && !e.metaKey) {
            var keyActions = {
                "Enter": [EditorAPI.document.insertNewLine],
                "Backspace": [EditorAPI.document.backspace],
                "Tab": [EditorAPI.document.insertTab],
                " ": [EditorAPI.document.insertCharacter, ["&nbsp;"]],
                "Shift": [(doc) => {}],
                "RightArrow": [EditorAPI.navigation.selectRight]
            }

            e.preventDefault();
            let keyAction = keyActions[e.key];
            if (keyAction) {
                keyAction[0](doc, keyAction[1])
            } else {
                EditorAPI.document.insertCharacter(doc, e.key);
            }

            updateCursor();
        }
    })

    // Pause cursor animation:
    window.addEventListener("keydown", () => {
        document.querySelector(".cursor").classList.add("paused");
    }); window.addEventListener("keyup", () => {
        document.querySelector(".cursor").classList.remove("paused");
    })

    documents.forEach(doc => {
        // Make document active:
        doc.addEventListener("click", () => {
            documents.forEach(doc_ => {
                doc_.classList.remove("selected");
            })

            activeDocument = documents.indexOf(doc);
            doc.classList.add("selected");
        })
    })
}

window.addEventListener("load", () => {
    documentEventListeners();
    updateCursor();

    // Update cursor on resize, or zoom:
    window.addEventListener("resize", updateCursor);
});
