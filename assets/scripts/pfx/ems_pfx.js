// --- KONFIGURACJA DANYCH ---
const typeLabels = { "0":"Brak","1":"(P) - Podstawowe","2":"(S) - Specjalistyczne","3":"(T) - transportowe","4":"(N) - Neonatologiczne","5":"(R) - Reanimacyjne [Wycofane]","6":"(K) - Kardiologiczne","7":"(B) - Bariatryczne","8":"(W) - Wypadkowe [Wycofane]","9":"(S/P) - Specjalistyczno-podstawowe"};
const lightbarLabels = { "0":"Slicktop","1":"Gamet Prism","2":"Patelite","3":"FS Vision","4":"FSV Aurum","5":"FSV Kairos","6":"Elektra LZP","7":"Elektra LZ","8":"Elektra LBL","9":"Hella RTK b","A":"Hella RTK e" };
const strobLabels = { "0":"Brak","1":"Grill","2":"Zderzak","3":"Grill + zderzak" };
const strobInternalLabels = { "0":"Brak","1":"FSV – Przednia szyba","2":"FSV – Tylna szyba","3":"FSV – Przednia + tylna szyba" };
const sirenLabels = { "0":"Whelen Yelp 1","2":"Elektra Mix","3":"Hazard Le-On 1","4":"Hazard Le-On 2","5":"Whelen Yelp 2","6":"Whelen Wail","7":"Whelen PHSR","8":"Patelite Wail" };

// --- FUNKCJE POMOCNICZE ---
function parseDataList(val) { 
    if (!val) return []; 
    return String(val).split(",").map(s => s.trim()).filter(s => s.length > 0); 
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback dla starszych przeglądarek
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        return true;
    }
}

// Funkcja czytająca konfigurację naklejek z atrybutów data-
function readStickerConfig(section) {
    const cntList = parseDataList(section.dataset.sticker_cnt);
    const items = [];
    
    // Priorytet 1: lista sticker_cnt
    if (cntList.length > 0) {
        cntList.forEach(id => {
            const label = section.dataset[`sticker_${id}`];
            items.push({ id: String(id), label: label !== undefined ? String(label) : String(id) });
        });
        return items;
    }
    
    // Priorytet 2: wszystkie atrybuty sticker_
    Object.keys(section.dataset).forEach(k => {
        if (k.startsWith("sticker_") && k !== "sticker_cnt" && k !== "sticker_id") {
            const id = k.substring("sticker_".length);
            items.push({ id: String(id), label: String(section.dataset[k]) });
        }
    });
    
    if (items.length > 0) return items;
    return [{ id: "0", label: "Domyślne oklejenie" }];
}

// --- GŁÓWNA INICJALIZACJA ---
document.addEventListener("DOMContentLoaded", () => {
    const section = document.getElementById("creator");
    if (!section) return;

    // Pobranie elementów formularza
    const typeSelect = document.getElementById("type");
    const lightbarSelect = document.getElementById("lightbar");
    const strobSelect = document.getElementById("strob");
    const strobwSelect = document.getElementById("strobw");
    const sirenSelect = document.getElementById("siren");
    const stickersSelect = document.getElementById("stickers");
    const playerInput = document.getElementById("playerID");
    const generateBtn = document.getElementById("generateCode");

    // Pobranie elementów popupa (z istniejącego HTML)
    const overlay = document.getElementById("overlay");
    const popup = document.getElementById("codePopup");
    const codeField = document.getElementById("generatedCodeField");
    const copyBtn = document.getElementById("copyCodeBtn");

    // --- FUNKCJA WYPEŁNIAJĄCA SELECTY ---
    function fillSelect(selectElement, dataObj, allowedIdsStr, currentIdStr, updateDatasetKey) {
        if (!selectElement) return;
        selectElement.innerHTML = "";
        
        const allowed = parseDataList(allowedIdsStr || Object.keys(dataObj).join(","));
        
        // Jeśli allowed jest puste, a mamy słownik, wypełnij wszystkim (fallback)
        const keysToUse = allowed.length > 0 ? allowed : Object.keys(dataObj);

        keysToUse.forEach(id => {
            if (dataObj[id] !== undefined) {
                const opt = document.createElement("option");
                opt.value = id;
                opt.textContent = dataObj[id];
                selectElement.appendChild(opt);
            }
        });

        // Ustawienie wartości początkowej
        if (currentIdStr && [...selectElement.options].some(o => o.value === currentIdStr)) {
            selectElement.value = currentIdStr;
        } else if (selectElement.options.length > 0) {
            selectElement.selectedIndex = 0;
            section.dataset[updateDatasetKey] = selectElement.value;
        }

        // Aktualizacja dataset przy zmianie
        selectElement.addEventListener("change", () => {
            section.dataset[updateDatasetKey] = selectElement.value;
        });
    }

    // 1. Fillowanie selectów
    fillSelect(typeSelect, typeLabels, section.dataset.type_cnt, section.dataset.type_id, "type_id");
    fillSelect(lightbarSelect, lightbarLabels, section.dataset.lightbar_cnt, section.dataset.lightbar_id, "lightbar_id");
    fillSelect(strobSelect, strobLabels, section.dataset.strob_cnt, section.dataset.strob_id, "strob_id");
    fillSelect(strobwSelect, strobInternalLabels, section.dataset.strobw_cnt, section.dataset.strobw_id, "strobw_id");
    fillSelect(sirenSelect, sirenLabels, section.dataset.siren_cnt, section.dataset.siren_id, "siren_id");

    // 2. Naklejki (specjalna obsługa)
    if (stickersSelect) {
        stickersSelect.innerHTML = "";
        const stickerItems = readStickerConfig(section);
        stickerItems.forEach(it => {
            const o = document.createElement("option");
            o.value = it.id;
            o.textContent = it.label;
            stickersSelect.appendChild(o);
        });
        
        let defSticker = section.dataset.sticker_id || "0";
        if ([...stickersSelect.options].some(o => o.value === defSticker)) {
            stickersSelect.value = defSticker;
        } else {
            stickersSelect.selectedIndex = 0;
            section.dataset.sticker_id = stickersSelect.value;
        }
        stickersSelect.addEventListener("change", () => {
            section.dataset.sticker_id = stickersSelect.value;
        });
    }

    // --- WALIDACJE I USTAWIENIA POLA GRACZA ---

    function validatePlayerID() {
        if (!playerInput) return;
        
        const currentVal = playerInput.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
        playerInput.value = currentVal.slice(0, 8); // Ograniczenie do 8 znaków

        // Usunięcie starych klas
        playerInput.classList.remove("valid", "invalid");

        if (currentVal.length === 8) {
            playerInput.classList.add("valid"); // Pełny kod = Zielony
        } else if (currentVal.length > 0 && currentVal.length < 8) {
            playerInput.classList.add("invalid"); // Niepełny kod = Czerwony
        } 
        // W przeciwnym razie (puste pole) - brak dodatkowych klas, domyślny styl
    }


    if (playerInput) {
        playerInput.maxLength = 8;
        playerInput.setAttribute("inputmode", "text");
        
        // Zdarzenia do kolorowania ramki na bieżąco
        playerInput.addEventListener("input", validatePlayerID);
        playerInput.addEventListener("blur", validatePlayerID);
        
        // Walidacja na start, jeśli pole jest pre-wypełnione
        if (playerInput.value) validatePlayerID();
    }
    
    // --- GENEROWANIE KODU ---
    if (generateBtn) {
        generateBtn.addEventListener("click", () => {
            // 1. Wymuś końcową walidację, by upewnić się, że klasy są aktualne
            validatePlayerID(); 
            
            const pID = (playerInput && playerInput.value) ? playerInput.value.trim() : "";
            
            // 2. Sprawdź, czy pole jest prawidłowe (czy ma klasę 'valid')
            if (pID.length !== 8 || !playerInput.classList.contains('valid')) {
                // Jeśli walidacja nie przeszła, komunikat dla użytkownika
                alert("Proszę podać poprawne ID gracza (8 znaków) przed wygenerowaniem kodu.");
                if (playerInput) playerInput.focus();
                // Ważne: usuń starą, ręczną walidację ramki na czerwono,
                // ponieważ teraz robi to funkcja validatePlayerID() i CSS.
                return;
            }

            // --- 3. POBIERANIE WARTOSCI I SKŁADANIE KODU ---
            
            // Pobieranie wartości
            const modID = section.dataset.mod_id || "";
            
            const typeID = typeSelect ? typeSelect.value : "0";
            const lightbarID = lightbarSelect ? lightbarSelect.value : "0"; 
            const strobID = strobSelect ? strobSelect.value : "0";
            const strobwID = strobwSelect ? strobwSelect.value : "0";
            const genID = sirenSelect ? sirenSelect.value : "0";
            const stickID = stickersSelect ? stickersSelect.value : "0";

            // SKŁADANIE KODU (BEZ SEPARATORÓW)
            const finalCode = `${pID}${modID}${typeID}${lightbarID}${strobID}${strobwID}${genID}${stickID}`;

            // Wstawienie do popupa
            if (codeField) codeField.value = finalCode;

            // Wyświetlenie popupa
            if (overlay) overlay.classList.add("active");
            if (popup) popup.classList.add("active");
        });
    }

    // --- OBSŁUGA POPUPA ---
    
    // Kopiowanie do schowka
    if (copyBtn) {
        copyBtn.addEventListener("click", () => {
            if (codeField) {
                copyToClipboard(codeField.value).then(() => {
                    const originalContent = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="bi bi-check" style="color:white; font-size:18px;"></i>';
                    setTimeout(() => {
                        copyBtn.innerHTML = originalContent;
                    }, 1500);
                });
            }
        });
    }

    // Zamykanie popupa
    if (overlay) {
        overlay.addEventListener("click", () => {
            overlay.classList.remove("active");
            if (popup) popup.classList.remove("active");
        });
    }
});