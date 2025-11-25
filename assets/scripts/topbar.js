const toggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');

toggle.addEventListener('click', () => {
    menu.classList.toggle('active');
});

// Zamknięcie menu po kliknięciu poza jego obszar
document.addEventListener('click', (e) => {
    const isClickInsideMenu = menu.contains(e.target);
    const isClickOnToggle = toggle.contains(e.target);

    if (!isClickInsideMenu && !isClickOnToggle) {
        menu.classList.remove('active');
    }
});

// Skalowanie przycisków social
function scaleSocialButtons() {
    const banner = document.querySelector('.banner img');
    const buttons = document.querySelector('.social-buttons');
    const scale = banner.clientWidth / 1200; // 1200px – baza rozmiaru bannera
    buttons.style.transform = `scale(${scale})`;
}

window.addEventListener('resize', scaleSocialButtons);
window.addEventListener('load', scaleSocialButtons);

// =======================
//   WYSZUKIWARKA
// =======================
const searchInput = document.querySelector('.menu-search');

// mapa fraz -> ID sekcji
const sectionsMap = {
    "updates": "updates",
    "new mods": "mods",
    "mods": "mods",
    "categories": "categories",
    "tractors": "cat-tractors",
    "harvesters": "cat-harvesters",
    "trucks": "cat-trucks",
    "cars": "cat-cars",
    "trailers": "cat-trailers",
    "loading wagons": "cat-loadingwagons",
    "manure spreaders": "cat-manurespreaders",
    "manure tanks": "cat-manuretanks",
    "fertilizer spreaders": "cat-fertilizerspreaders",
    "sowing machines": "cat-sowingmachines",
    "cultivators": "cat-cultivators",
    "plows": "cat-plows",
    "crops": "cat-crops",
    "mowers": "cat-mowers",
    "tedders": "cat-tedders",
    "windrowers": "cat-windrowers",
    "balers": "cat-balers",
    "autoloaders": "cat-autoloaders",
    "forestry": "cat-forestry",
    "maps": "cat-maps",
    "gameplay": "cat-gameplay",
    "textures": "cat-textures",
    "sounds": "cat-sounds",
    "scripts": "cat-scripts",
    "shaders": "cat-shaders",
    "others": "cat-others"
};

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim().toLowerCase();
        if (sectionsMap[query]) {
            const targetId = sectionsMap[query];
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                menu.classList.remove('active'); // zamknij menu
                targetElement.scrollIntoView({ behavior: "smooth" });
            }
        } else {
            alert("Category not found!");
        }
    }
});
