// --- CONFIG & DATA ---
const LOAD_SPEED_MS = 400;

const codeSnippets = [
    "color: $main-color", "status-icon", "div class='row'", "href='#'", "return false",
    "const LOAD_SPEED", "document.getElem", "window.addEvent", "opacity: 0", "display: none",
    "flex-direction: col", "margin: 20px auto", "z-index: 999", "position: absolute", "pointer-events: none",
    "requestAnimationFrame", "Math.random()", "performance.now()", "fetch(file.url)", "if(!output) return",
    "system.status = 'READY'", "kernel_check: OK", "buffer_load: 100%", "access_level: ROOT",
    "protocol: CYBERNET", "v1.0.26_build", "encryption: AES-256", "handshake: SUCCESS"
];

// --- LOADER ENGINE ---
async function startCodeLoop() {
    const output = document.getElementById('terminal-output');
    const percentDisplay = document.getElementById('loader-percentage');
    
    if (!output || !percentDisplay) return;

    while (true) {
        for (let snippet of codeSnippets) {
            output.innerText = snippet;
            await animateSnippetProgress(percentDisplay, LOAD_SPEED_MS);
            await new Promise(r => setTimeout(r, 15));
        }
    }
}

function animateSnippetProgress(display, duration) {
    return new Promise(resolve => {
        let start = performance.now();
        function update(now) {
            let elapsed = now - start;
            let progress = Math.round((elapsed / duration) * 100);
            if (progress >= 100) {
                display.innerText = "100%";
                resolve();
            } else {
                display.innerText = progress + "%";
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    });
}

// --- NAVIGATION CORE ---
function navigate(file, element) {
    const area = document.getElementById('main-section');
    const menu = document.getElementById('main-nav-links');
    const toggle = document.getElementById('mobile-toggle');
    const mobileIndicator = document.querySelector('.active-indicator-mobile a');

    if (!area) return;

    // Vizuálny update navigácie
    if (element) {
        document.querySelectorAll('.nav-links-container a').forEach(link => {
            link.classList.remove('active-link');
        });
        element.classList.add('active-link');

        // Update mobilného indikátora (toho textu vľavo hore na mobile)
        if (mobileIndicator) {
            const txt = element.getAttribute('data-text').toUpperCase();
            mobileIndicator.innerText = txt;
            mobileIndicator.setAttribute('data-text', txt);
        }

        // Ak sme na mobile a menu je otvorené, zavrieme ho po kliknutí
        if (menu && menu.classList.contains('is-open')) {
            menu.classList.remove('is-open');
            toggle.classList.remove('is-active');
        }
    }

    // Animácia prechodu obsahu
    area.style.opacity = '0';
    setTimeout(() => {
        fetch(file)
            .then(res => {
                if (!res.ok) throw new Error('SYSTEM_ERROR: DATA_LOST');
                return res.text();
            })
            .then(html => {
                area.innerHTML = html;
                area.style.opacity = '1';
            })
            .catch(err => {
                area.innerHTML = "<h2 style='text-align:center; color:#ff0000;'>SYSTEM_ERROR: " + err.message + "</h2>";
                area.style.opacity = '1';
            });
    }, 250);
}

// --- INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('mobile-toggle');
    const menu = document.getElementById('main-nav-links');
    const navLinks = document.querySelectorAll('.nav-links-container a');

    // 1. Spustenie loaderu
    startCodeLoop();

    // 2. Hamburger menu event
    if (toggle && menu) {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Kritické: zabráni zavretiu hneď po otvorení
            toggle.classList.toggle('is-active');
            menu.classList.toggle('is-open');
            console.log("System: Hamburger state toggled.");
        });
    }

    // 3. Obsluha linkov (nahrádza starý onclick v HTML)
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Získame súbor z data-text (napr. Home -> home.html) 
            // alebo si do HTML pridaj data-file="home.html" pre istotu
            let file = link.getAttribute('data-text').toLowerCase() + ".html";
            
            // Špeciálny prípad pre Art Style kvôli medzere
            if (file === "art style.html") file = "artstyle.html"; 
            
            navigate(file, link);
        });
    });

    // 4. Zavrieť menu pri kliknutí mimo neho (UX vychytávka)
    document.addEventListener('click', (e) => {
        if (menu && menu.classList.contains('is-open')) {
            if (!menu.contains(e.target) && !toggle.contains(e.target)) {
                menu.classList.remove('is-open');
                toggle.classList.remove('is-active');
            }
        }
    });

    // 5. Načítanie úvodnej stránky (Home)
    const homeLink = document.querySelector('.nav-links-container a.active-link') || navLinks[0];
    if (homeLink) {
        navigate('home.html', homeLink);
    }
});