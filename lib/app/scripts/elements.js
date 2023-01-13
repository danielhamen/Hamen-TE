/*
    THIS FILE CONTAINS "PRE-MADE ELEMENTS" SUCH AS THE HEADER, FOOTER, ETC
*/

const elements = {
    // Creates the header in the DOM:
    header() {
        let header = document.getElementsByTagName("header")[0];
        let HTML = ``;

        header.innerHTML = HTML;
    },

    // Creates the footer in the DOM:
    footer() {
        let footer = document.getElementsByTagName("footer")[0];
        let HTML = ``;

        footer.innerHTML = HTML;
    }
}