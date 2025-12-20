// =============================
// DOSTĘPNE MARKI I MODELE
// =============================
const brandModels = {
    "Fiat": ["Doblo"],
    "BMW": ["M3 F10"],
    "KIA": ["Stinger GT"],
    "Skoda": ["Octavia IV"]
};

// =============================
// ELEMENTY
// =============================
const brandSelect = document.getElementById("filter-brand");
const modelSelect = document.getElementById("filter-model");
const typeSelect = document.getElementById("filter-type");
const filterToggle = document.getElementById("filter-toggle");
const filterOptions = document.getElementById("filter-options");
const filterApply = document.getElementById("filter-apply");
const filterReset = document.getElementById("filter-reset");
const cards = document.querySelectorAll(".card-custom");
const noResults = document.getElementById("no-results");

// =============================
// ŁADOWANIE MAREK
// =============================
Object.keys(brandModels).forEach(brand => {
    const o = document.createElement("option");
    o.value = brand;
    o.textContent = brand;
    brandSelect.appendChild(o);
});

// =============================
// ŁADOWANIE MODELI PO WYBORZE MARKI
// =============================
brandSelect.addEventListener("change", () => {
    modelSelect.innerHTML = '<option value="">Model</option>';

    if (brandSelect.value === "") return;

    brandModels[brandSelect.value].forEach(model => {
        const o = document.createElement("option");
        o.value = model;
        o.textContent = model;
        modelSelect.appendChild(o);
    });
});

// =============================
// POKAZYWANIE / UKRYWANIE FILTRÓW
// =============================
filterToggle.addEventListener("click", () => {
    filterOptions.classList.toggle("visible");
});

// =============================
// FUNKCJA FILTROWANIA
// =============================
function applyFilters() {
    const b = brandSelect.value;
    const m = modelSelect.value;
    const t = typeSelect.value;

    let visibleCount = 0;

    cards.forEach(card => {
        const matchBrand = !b || card.dataset.brand === b;
        const matchModel = !m || card.dataset.model === m;
        const matchType  = !t || card.dataset.type.toLowerCase() === t.toLowerCase();

        if (matchBrand && matchModel && matchType) {
            card.style.display = "flex";
            visibleCount++;
        } else {
            card.style.display = "none";
        }
    });

    noResults.style.display = visibleCount === 0 ? "block" : "none";
}

// =============================
// EVENT – Filtruj
// =============================
filterApply.addEventListener("click", applyFilters);

// =============================
// RESET – przywrócenie wszystkiego
// =============================
filterReset.addEventListener("click", () => {
    brandSelect.value = "";
    modelSelect.innerHTML = '<option value="">Model</option>';
    typeSelect.value = "";

    cards.forEach(card => {
        card.style.display = "flex";
    });

    noResults.style.display = "none";
});