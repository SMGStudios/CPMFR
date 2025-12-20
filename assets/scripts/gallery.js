const mainImage = document.getElementById("mainImage");
const thumbsContainer = document.getElementById("thumbsContainer");

// Pobieranie zdjęć z HTML
const sourceImages = Array.from(
    document.querySelectorAll("#sourceImages img")
).map(img => img.src);

// Ustaw pierwsze zdjęcie jako główne
if (sourceImages.length > 0) {
    mainImage.src = sourceImages[0];
}

// Tworzenie miniaturek na podstawie zdjęć z HTML
sourceImages.forEach((src, index) => {
    const thumb = document.createElement("img");
    thumb.src = src;
    thumb.classList.add("thumb");

    // Kliknięcie = zmiana głównego zdjęcia
    thumb.onclick = () => {
        mainImage.src = src;
        document.querySelectorAll(".thumb")
            .forEach(t => t.classList.remove("active-thumb"));
        thumb.classList.add("active-thumb");
    };

    // Pierwsza miniatura aktywna
    if (index === 0) {
        thumb.classList.add("active-thumb");
    }

    thumbsContainer.appendChild(thumb);
});