// =============================
// DOSTĘPNE MARKI I MODELE
// =============================
const brandModels = {
    "Mercedes-Benz": ["Sprinter"],
    "Ford": ["Transit"]
};

// =============================
// ELEMENTY
// =============================
const brandSelect   = document.getElementById("filter-brand");
const modelSelect   = document.getElementById("filter-model");
const companySelect = document.getElementById("filter-company");

const filterToggle  = document.getElementById("filter-toggle");
const filterOptions = document.getElementById("filter-options");
const filterApply   = document.getElementById("filter-apply");
const filterReset   = document.getElementById("filter-reset");

const cards     = document.querySelectorAll(".card-custom");
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

    if (!brandSelect.value) return;

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
    const brand   = brandSelect.value;
    const model   = modelSelect.value;
    const company = companySelect.value;

    let visibleCount = 0;

    cards.forEach(card => {
        const matchBrand   = !brand   || card.dataset.brand === brand;
        const matchModel   = !model   || card.dataset.model === model;
        const matchCompany =
            !company ||
            card.dataset.company
                .trim()
                .toLowerCase() === company.trim().toLowerCase();

        if (matchBrand && matchModel && matchCompany) {
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
    companySelect.value = "";

    cards.forEach(card => {
        card.style.display = "flex";
    });

    noResults.style.display = "none";
});
