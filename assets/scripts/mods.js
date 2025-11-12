document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".mod-card");
    const modal = document.getElementById("mod-modal");
    const galleryImg = document.getElementById("gallery-image");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    const generateBtn = document.getElementById("generate-code");
    const copyBtn = document.getElementById("copy-code");
    const orderOutput = document.getElementById("order-output");
    const orderCodeInput = document.getElementById("order-code");

    // Przykładowe dane galerii dla modyfikacji
    const galleries = {
        "bmw-m3": [
            "assets/images/bmw_m3.jpg",
            "assets/images/bmw_m3_2.jpg",
            "assets/images/bmw_m3_3.jpg"
        ]
    };

    let currentGallery = [];
    let currentIndex = 0;
    let slideInterval;

    // Otwieranie okna modyfikacji
    cards.forEach(card => {
        card.addEventListener("click", () => {
            const id = card.dataset.id;
            currentGallery = galleries[id] || [];
            currentIndex = 0;
            updateGallery();
            modal.style.display = "flex";
            startSlideShow();
            document.getElementById("mod-title").textContent = "BMW M3 [F10]";
        });
    });

    // Kliknięcie poza okno — zamyka
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
            clearInterval(slideInterval);
        }
    });

    // Obsługa galerii
    function updateGallery() {
        if (currentGallery.length > 0) {
            galleryImg.src = currentGallery[currentIndex];
        }
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % currentGallery.length;
        updateGallery();
    }

    function prevImageFunc() {
        currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
        updateGallery();
    }

    nextBtn.addEventListener("click", nextImage);
    prevBtn.addEventListener("click", prevImageFunc);

    function startSlideShow() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextImage, 5000);
    }

    // Generowanie kodu zamówienia
    generateBtn.addEventListener("click", () => {
        const playerId = document.getElementById("player-id").value.trim();
        const opLetter = document.getElementById("op-letter").value;
        const opNumber = String(document.getElementById("op-number").value).padStart(3, '0');
        const oklejenie = document.getElementById("oklejenie").value;
        const belka = document.getElementById("belka").value;
        const stroboskopy = document.getElementById("stroboskopy").value;

        if (!playerId) {
            alert("Wprowadź swoje ID gracza!");
            return;
        }

        const code = `${playerId},MOD,BMWM3,${opLetter}${opNumber},${oklejenie},${belka},${stroboskopy}`;
        orderCodeInput.value = code;
        orderOutput.style.display = "block";
    });

    // Kopiowanie kodu
    copyBtn.addEventListener("click", () => {
        orderCodeInput.select();
        document.execCommand("copy");

        // Wyświetlenie okna wyboru platformy
        const platformDiv = document.createElement("div");
        platformDiv.classList.add("send-code-modal");
        platformDiv.innerHTML = `
            <div class="send-content">
                <h3>Wyślij kod poprzez:</h3>
                <div class="icons">
                    <img src="assets/icons/email.png" alt="Email">
                    <img src="assets/icons/discord.png" alt="Discord">
                    <img src="assets/icons/messenger.png" alt="Messenger">
                </div>
            </div>
        `;
        document.body.appendChild(platformDiv);
        platformDiv.addEventListener("click", e => {
            if (e.target === platformDiv) platformDiv.remove();
        });
    });
});
