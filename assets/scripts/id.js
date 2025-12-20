const playerIdInput = document.getElementById("playerIdInput");

playerIdInput.addEventListener("input", () => {
    const value = playerIdInput.value;
    
    // Usuwamy klasy przed sprawdzeniem
    playerIdInput.classList.remove("valid", "invalid");

    // Jeśli ma dokładnie 8 znaków → zielone obramowanie
    if (value.length === 8) {
        playerIdInput.classList.add("valid");
        playerIdInput.classList.remove("invalid");
    } 
    // Jeśli ma inną liczbę znaków → czerwone obramowanie
    else {
        playerIdInput.classList.add("invalid");
        playerIdInput.classList.remove("valid");
    }
});
