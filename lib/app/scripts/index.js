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
        contextMenu.style.left = e.clientX + "px";
        contextMenu.style.top = e.clientY + "px";

        e.preventDefault();
    })

    // Hide context menu when the user clicks the keyboard, or clicks out of it:
    window.addEventListener("keydown", () => {
        toggleContextMenu(show = false);
    }); window.addEventListener("click", () => {
        toggleContextMenu(show = false);
    })
})

// Executes once every frame:
window.onload = function () {
    setInterval(function() {
        updateCursor();
        setFooterWordCount();
    }, 10);
}