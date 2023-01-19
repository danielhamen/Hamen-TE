function toggleContextMenu(show = null) {
    let contextMenu = document.querySelector(".context-menu");
    if (getComputedStyle(contextMenu).getPropertyValue("display") === "none") {
        contextMenu.style.display = "block";
    } else {
        contextMenu.style.display = "none";
    }

    if (show === true) {
        contextMenu.style.display = "block";
    } else if (show === false) {
        contextMenu.style.display = "none";
    }
}

window.addEventListener("load", () => {
    elements.header();
    elements.footer();
    elements.fileBar();

    addToolPanelHints();

    // Add context menu on right-click:
    document.addEventListener("contextmenu", e => {
        toggleContextMenu(show = true);
        let contextMenu = document.querySelector(".context-menu");
        let left = e.clientX;
        let top = e.clientY;
        let rect = contextMenu.getBoundingClientRect();
        if ((left + rect.width) >= window.innerWidth || (top + rect.height) >= window.innerHeight) {
            left -= rect.width;
            top -= rect.height;
        }

        contextMenu.style.left = left + "px";
        contextMenu.style.top = top + "px";

        e.preventDefault();
    })

    // Hide context menu when the user clicks the keyboard, or clicks out of it:
    window.addEventListener("keydown", () => {
        toggleContextMenu(show = false);
    }); window.addEventListener("click", () => {
        toggleContextMenu(show = false);
    })
})

window.onload = function () {
    // Cursor blinking:
    var cursorBlinking = true;

    // Execute once per 3 ms:
    setInterval(function() {
        // Update cursor position:
        updateCursor();

        // Set the footer word count:
        setFooterWordCount();

        // Update the toolbar icons:
        updateCharacterStyles();
    }, 2);

    // Execute once per 25 ms:
    setInterval(function() {
    }, 25)
}