// Skrypt odpowiedzialny za wybór belki świetlnej za pomocą miniaturek

document.addEventListener('DOMContentLoaded', () => {
    const creatorSection = document.getElementById('creator');
    const lightbarSelect = document.getElementById('lightbar'); 
    const container = document.getElementById('lightbarThumbsContainer');
    
    if (!creatorSection || !lightbarSelect || !container) {
        console.error("Brak wymaganych elementów HTML dla selektora belki świetlnej.");
        return;
    }
    
    // MAPOWANIE ID NA NAZWY BEL ŚWIETLNYCH (NOWOŚĆ)
    const lightbarNames = {
        "0": "Slicktop",
        "1": "Gamet Prism",
        "2": "Patlite",
        "3": "FS Vision",
        "4": "FSV Aurum",
        "5": "Elektra LZP",
        "6": "Elektra LZ",
        "7": "Elektra LBL",
        "8": "Hella RTK b",
        "9": "Hella RTK e"
    };

    const availableLightbarsAttr = creatorSection.getAttribute('data-lightbar_cnt');
    
    if (!availableLightbarsAttr) {
        console.warn("Brak atrybutu data-lightbar_cnt. Nie można wczytać miniaturek.");
        return;
    }

    const lightbarIDs = availableLightbarsAttr.split(',').map(id => id.trim()).filter(id => id.length > 0);
    const defaultLightbarID = creatorSection.getAttribute('data-lightbar_id');

    const updateSelection = (selectedID) => {
        // 1. Zapisz wybrane ID w UKRYTYM ELEMENCIE SELECT
        lightbarSelect.value = selectedID;
        const event = new Event('change');
        lightbarSelect.dispatchEvent(event); 

        // 2. Aktualizuj obramowanie miniaturek (wizualny feedback)
        document.querySelectorAll('.lightbar-thumb').forEach(t => {
            t.classList.remove('active-lightbar-thumb');
        });

        const activeThumb = document.querySelector(`.lightbar-thumb[data-lightbar-id="${selectedID}"]`);
        if (activeThumb) {
            activeThumb.classList.add('active-lightbar-thumb');
        }
    };

    // Wczytanie miniaturek
    lightbarIDs.forEach(id => {
        const thumb = document.createElement('img');
        thumb.src = `../../../../img/lightbars/belka_${id}.png`; 
        thumb.classList.add('lightbar-thumb');
        thumb.setAttribute('data-lightbar-id', id);
        
        // USTAWIENIE NAZWY JAKO TITLE (NOWOŚĆ)
        const lightbarName = lightbarNames[id] || `Nieznana belka ID: ${id}`;
        thumb.title = lightbarName; 
        
        // Obsługa kliknięcia
        thumb.addEventListener('click', () => {
            updateSelection(id);
        });

        container.appendChild(thumb);
        
        // DODATKOWY KROK: Dodaj opcje do ukrytego elementu <select>
        const option = document.createElement('option');
        option.value = id;
        option.textContent = lightbarName; // Używamy nazwy, jeśli skrypt kreatora wypełnia nim kod
        lightbarSelect.appendChild(option);
    });

    // Ustawienie początkowego wyboru
    const initialSelectionID = defaultLightbarID && lightbarIDs.includes(defaultLightbarID) ? defaultLightbarID : lightbarIDs[0];
    
    if (initialSelectionID) {
        setTimeout(() => {
            updateSelection(initialSelectionID);
        }, 0);
    }
});