// Skrypt odpowiedzialny za wybór generatora sygnałów i odtwarzanie audio

document.addEventListener('DOMContentLoaded', () => {
    const creatorSection = document.getElementById('creator');
    const sirenSelect = document.getElementById('siren'); 
    const container = document.getElementById('sirenThumbsContainer');
    
    if (!creatorSection || !sirenSelect || !container) {
        console.error("Brak wymaganych elementów HTML dla selektora sygnałów.");
        return;
    }
    
    // MAPOWANIE ID NA NAZWY SYGNAŁÓW (Pełna lista ID 1-9)
    const sirenNames = {
        "1": "Whelen Yelp",
        "2": "Elektra Mix",
        "3": "Hazard Le-On 1",
        "4": "Hazard Le-On 2",
        "5": "Whelen Yelp 2",
        "6": "Whelen Wail",
        "7": "Hazard Yelp",
        "8": "Whelen PHSR",
        "9": "Patlite Wail"
    };

    const availableSirensAttr = creatorSection.getAttribute('data-siren_cnt');
    
    if (!availableSirensAttr) {
        console.warn("Brak atrybutu data-siren_cnt. Nie można wczytać odtwarzaczy.");
        return;
    }

    // Wczytanie tylko ID podanych w data-siren_cnt (np. "1,2,3,7")
    const sirenIDs = availableSirensAttr.split(',').map(id => id.trim()).filter(id => id.length > 0);
    const defaultSirenID = creatorSection.getAttribute('data-siren_id');
    
    // --- Logika Odtwarzania i Stanu ---
    let currentAudio = null;
    let currentlyPlayingThumb = null;

    // Zatrzymuje odtwarzanie i resetuje ikonę
    const stopAudio = () => {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
        if (currentlyPlayingThumb) {
            currentlyPlayingThumb.querySelector('i').classList.remove('bi-pause-fill');
            currentlyPlayingThumb.querySelector('i').classList.add('bi-play-fill');
            currentlyPlayingThumb.classList.remove('playing-siren-thumb');
        }
        currentAudio = null;
        currentlyPlayingThumb = null;
    };


    // Aktualizuje wybór (ustawia zieloną ramkę i wartość w ukrytym select)
    const updateSelection = (selectedID) => {
        // 1. Zapisz wybrane ID w UKRYTYM ELEMENCIE SELECT
        sirenSelect.value = selectedID;
        const event = new Event('change');
        sirenSelect.dispatchEvent(event); 

        // 2. Aktualizuj obramowanie miniaturek (wizualny feedback)
        document.querySelectorAll('.siren-player-thumb').forEach(t => {
            t.classList.remove('active-siren-thumb');
        });

        const activeThumb = document.querySelector(`.siren-player-thumb[data-siren-id="${selectedID}"]`);
        if (activeThumb) {
            activeThumb.classList.add('active-siren-thumb');
        }
    };

    // --- Generowanie Odtwarzaczy ---
    sirenIDs.forEach(id => {
        const thumb = document.createElement('div');
        thumb.classList.add('siren-player-thumb');
        thumb.setAttribute('data-siren-id', id);
        
        // Pobiera nazwę tylko dla ID podanego w metadanych
        const sirenName = sirenNames[id] || `Nieznany sygnał ID: ${id}`;
        thumb.title = sirenName; 
        
        const icon = document.createElement('i');
        icon.classList.add('bi', 'bi-play-fill', 'siren-player-icon');
        thumb.appendChild(icon);

        // Obsługa kliknięcia (Wybór + Odtwarzanie)
        thumb.addEventListener('click', () => {
            // KROK 1: Zmień aktywny wybór
            updateSelection(id); 

            // KROK 2: Obsługa odtwarzania audio
            const audioPath = `../../../../audio/sirens/siren_${id}.wav`;

            if (currentlyPlayingThumb === thumb) {
                // Jeśli kliknięto na aktualnie odtwarzany, zatrzymaj
                stopAudio();
            } else {
                // Zakończ poprzednie odtwarzanie (jeśli jest)
                stopAudio();
                
                // Rozpocznij nowe odtwarzanie
                currentAudio = new Audio(audioPath);
                currentlyPlayingThumb = thumb;
                const currentIcon = thumb.querySelector('i');

                currentIcon.classList.remove('bi-play-fill');
                currentIcon.classList.add('bi-pause-fill');
                thumb.classList.add('playing-siren-thumb');
                
                currentAudio.play().catch(error => {
                    console.error(`Błąd odtwarzania audio dla ID ${id}: ${error}`);
                    stopAudio(); 
                });

                // Obsługa automatycznego zatrzymania po zakończeniu pliku
                currentAudio.onended = () => {
                    stopAudio();
                    updateSelection(id); 
                };
            }
        });

        container.appendChild(thumb);
        
        // Dodatkowy krok: Dodaj opcje do ukrytego elementu <select>
        const option = document.createElement('option');
        option.value = id;
        option.textContent = sirenName; 
        sirenSelect.appendChild(option);
    });

    // --- Ustawienie Wyboru Początkowego ---
    // Sprawdzamy, czy defaultSirenID istnieje ORAZ czy jest na liście dostępnych sygnałów
    const initialSelectionID = defaultSirenID && sirenIDs.includes(defaultSirenID) ? defaultSirenID : sirenIDs[0];
    
    if (initialSelectionID) {
        updateSelection(initialSelectionID);
    }
});