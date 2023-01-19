/*
    THIS FILE CONTAINS "PRE-MADE ELEMENTS" SUCH AS THE HEADER, FOOTER, ETC
*/

const elements = {
    // Creates the header in the DOM:
    header() {
        let header = document.getElementsByTagName("header")[0];
        let HTML = `

        `;

        header.innerHTML = HTML;
    },

    // Creates the footer in the DOM:
    footer() {
        let footer = document.getElementsByTagName("footer")[0];
        let HTML = `
<div class="document-footer">
    <!-- <div class="footer-logo"></div> -->
    <div class="document-title">
        <input type="text" id="document-title" placeholder="Document Title">
    </div>
    <div class="word-count" style="margin-left: auto;">
        <span id="word-count-pages"></span>
        <span class="word-count-separator">&bull;</span>
        <span id="word-count-words"></span>
        <span class="word-count-separator">&bull;</span>
        <span id="word-count-characters"></span>
        <span class="word-count-separator">&bull;</span>
        <span id="word-count-characters-no-spaces"></span>
    </div>
</div>
        `;

        footer.innerHTML = HTML;

        let input = document.getElementById("document-title");
        input.addEventListener("focusin", disableTyping);
        input.addEventListener("focusin", disableTyping);
        input.addEventListener("keydown", e => {
            if (e.key === "Enter") {
                input.blur();
            }
        });
    },

    // Creates the file-bar in the DOM:
    fileBar() {
        let filebar = document.querySelector("file-bar");
        let HTML = `
<div class="file-bar">
    <div class="file-bar-items">
        <div class="file-bar-item">
            <span>File</span>
            <div class="file-bar-item-content">
                <div class="file-bar-item-content-item chevron">
                    <span>New</span>
                    <span class="material-symbols-outlined file-bar-item-chevron"> chevron_right </span>
                </div>
                <div class="file-bar-item-content-item">
                    <span>New Project</span>
                </div>
                <div class="file-bar-item-content-separator"></div>
                <div class="file-bar-item-content-item chevron">
                    <span>Open Recent</span>
                    <span class="material-symbols-outlined file-bar-item-chevron"> chevron_right </span>
                </div>
                <div class="file-bar-item-content-item">
                    <span>Open File</span>
                </div>
                <div class="file-bar-item-content-item">
                    <span>Open Folder</span>
                </div>
            </div>
        </div>
        <div class="file-bar-item">
            <span>Edit</span>
            <div class="file-bar-item-content"></div>
        </div>
        <div class="file-bar-item">
            <span>Select</span>
            <div class="file-bar-item-content"></div>
        </div>
        <div class="file-bar-item">
            <span>View</span>
            <div class="file-bar-item-content"></div>
        </div>
        <div class="file-bar-item">
            <span>Window</span>
            <div class="file-bar-item-content"></div>
        </div>
        <div class="file-bar-item">
            <span>Help</span>
            <div class="file-bar-item-content"></div>
        </div>
    </div>
    <div class="window-options">
        <div class="window-option">
            <span class="material-symbols-outlined"> remove </span>
        </div>
        <div class="window-option">
            <span class="material-symbols-outlined"> fullscreen </span>
        </div>
        <div class="window-option">
            <span class="material-symbols-outlined"> close </span>
        </div>
    </div>
</div>`;
        filebar.innerHTML = HTML;
    }
}
