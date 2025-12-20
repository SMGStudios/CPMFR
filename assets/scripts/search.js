document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector(".menu-search");

    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query.length > 0) {
                searchAndScroll(query);
            }
        }
    });

    function searchAndScroll(text) {
        // Usuwanie poprzednich zaznaczeń
        removeHighlights();

        const bodyText = document.body.innerHTML;
        const regex = new RegExp(text, "i");

        // Sprawdza czy tekst istnieje
        if (!regex.test(bodyText)) {
            alert("Brak wyników dla: " + text);
            return;
        }

        // Tworzy znacznik do wyróżnienia
        highlightFirst(text);

        // Przewinięcie do pierwszego wyniku
        const highlight = document.querySelector(".search-highlight");
        if (highlight) {
            highlight.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }

    function highlightFirst(text) {
        let done = false;

        const treeWalker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) =>
                    node.nodeValue.toLowerCase().includes(text.toLowerCase())
                        ? NodeFilter.FILTER_ACCEPT
                        : NodeFilter.FILTER_REJECT
            }
        );

        while (!done) {
            const node = treeWalker.nextNode();
            if (!node) break;

            const idx = node.nodeValue.toLowerCase().indexOf(text.toLowerCase());
            if (idx >= 0) {
                const span = document.createElement("span");
                span.className = "search-highlight";

                const original = node.nodeValue;
                const before = original.slice(0, idx);
                const match = original.slice(idx, idx + text.length);
                const after = original.slice(idx + text.length);

                span.textContent = match;

                const parent = node.parentNode;

                parent.insertBefore(document.createTextNode(before), node);
                parent.insertBefore(span, node);
                parent.insertBefore(document.createTextNode(after), node);

                parent.removeChild(node);

                done = true;
            }
        }
    }

    function removeHighlights() {
        document.querySelectorAll(".search-highlight").forEach(el => {
            el.outerHTML = el.innerText;
        });
    }
});