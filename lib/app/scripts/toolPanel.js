function addToolPanelHints() {
    /* Adds all the hover-hints to the tool panel items */
    Array.from(document.querySelectorAll(".tool-panel-item")).forEach(element => {
        let HTML = `<div class="tool-panel-hint-wrapper"><span class="tool-panel-hint-text">${element.getAttribute("hmn-hint")}</span></div>`;
        element.innerHTML += HTML;
    });
}

window.addEventListener("load", () => {
    // Prevent the document text from being de-selected when the user presses the items:
    let toolItems = document.querySelectorAll(".tool-panel-item");
    toolItems = Array.from(toolItems);
    toolItems.forEach(element => {
        element.addEventListener("mousedown", (e) => {
            e.stopPropagation();
            e.preventDefault();
        })
    })
})