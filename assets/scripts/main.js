// --- CONFIG ---
const LOAD_SPEED_MS = 400;  // Extrémna rýchlosť pre efekt "kmitania"
// --------------

const codeSnippets = [
    "color: $main-color", "status-icon", "div class='row'", "href='#'", "return false",
    "const LOAD_SPEED", "document.getElem", "window.addEvent", "opacity: 0", "display: none",
    "flex-direction: col", "margin: 20px auto", "z-index: 999", "position: absolute", "pointer-events: none",
    "requestAnimationFrame", "Math.random()", "performance.now()", "fetch(file.url)", "if(!output) return",
    "@keyframes blink", "box-shadow: 0 0 10px", "transform: rotate(360)", "transition: 0.3s", "clip-path: polygon",
    "nav > a:hover", "letter-spacing: 5px", "font-family: Hacked", "src: url(/assets/)", "background: conic-gradient",
    "content: attr(data-text)", "filter: brightness(1.2)", "animation: rotateSnake", "mask-size: 51%", "outline: 0.6px solid",
    "area.innerHTML = html", "console.error(err)", "classList.add('active')", "setTimeout(() => {", "await new Promise",
    "let progress = 0", "clearInterval(interval)", "hex.toString(16)", "prefixes[Math.floor]", "generateCyberFiles",
    "while(true)", "async function", "<body>", "<nav>", "<footer>", "header > nav", ".portfolio-frame",
    ".inner-mask", ".content-inside", "#site-loader", ".loader-row", "#terminal-output", ".status-icon",
    "text-transform: upper", "font-weight: bold", "opacity: 1 !important", "will-change: width", "steps(1) infinite",
    "rgba(246, 255, 0, 0.5)", "linear-gradient(135deg)", "perspective(1000px)", "backface-visibility", "translateZ(0)",
    "-webkit-font-smoothing", "contain: paint", "min-height: 400px", "text-shadow: 20px 20px", "line-height: 1",
    "url(/img/bg.jpg)", "fixed; top: 0; left: 0", "user-select: none", "overflow-x: hidden", "cursor: pointer",
    "event.preventDefault()", "history.pushState", "location.reload()", "JSON.parse(data)", "localStorage.set",
    "document.body.style", "window.innerHeight", "element.getAttribute", "new IntersectionObs", "forEach(el => {",
    "Math.floor(Math.random)", "Array.from({length: 200})", "setTimeout(r, 10)", "bar.style.width", "percent + '%'",
    "console.log('INIT...')", "system.status = 'READY'", "kernel_check: OK", "buffer_load: 100%", "access_level: ROOT",
    "protocol: CYBERNET", "v1.0.26_build", "encryption: AES-256", "handshake: SUCCESS", "port: 5500", "host: 0.0.0.0",
    "GET /assets/scripts", "HTTP/1.1 200 OK", "Content-Type: text/js", "Cache-Control: no-cache", "Connection: keep-alive",
    "0% { opacity: 1 }", "50% { opacity: 0 }", ".mytitle { font-size: 4rem }", "border: 1px solid", "padding: 10px",
    "display: flex", "justify-content: center", "align-items: stretch", "height: 60px", "background: $bg-color",
    "polygon(0% 5%, 5% 0%)", "clip-path: inset(0)", "pointer-events: auto", "transition: transform 1s", "ease-in-out",
    "input:focus", "button::after", "::selection { background }", "::-webkit-scrollbar", "width: 4px", "thumb: $main-color",
    "var(--primary-glow)", "calc(100% - 20px)", "max-width: 450px", "border-radius: 0", "border-top-left: 15px",
    "transform: translateY(-20)", "box-sizing: border-box", "visibility: visible", "none !important", "vertical-align: middle"
];

async function startCodeLoop() {
    const output = document.getElementById('terminal-output');
    const percentDisplay = document.getElementById('loader-percentage');
    
    if (!output || !percentDisplay) return;

    // Nekonečná slučka
    while (true) {
        for (let snippet of codeSnippets) {
            output.innerText = snippet;
            
            // Mikro-loading pre každý snippet
            await animateSnippetProgress(percentDisplay, LOAD_SPEED_MS);
            
            // Blesková pauza medzi kúskami kódu
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

window.addEventListener('load', startCodeLoop);



// put main link active
window.addEventListener('DOMContentLoaded', () => {
    // 1. Nájdi prvý odkaz v nav a pridaj mu triedu active-link
    const homeLink = document.querySelector('nav a');
    if (homeLink) homeLink.classList.add('active-link');

    // 2. Tvoj existujúci kód pre načítanie home.html
    navigate('home.html'); 
});


function navigate(file, element) {
    const area = document.getElementById('main-section');
    if (!area) return;

    // --- TÁTO ČASŤ JE KĽÚČOVÁ PRE ACTIVE STAV ---
    if (element) {
        // Zoberie active-link všetkým buttonom
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('active-link');
        });
        // Pridá ho len tomu, na ktorý si práve klikol
        element.classList.add('active-link');
    }
    // --------------------------------------------

    // ... zvyšok tvojho fetch kódu ...
    area.style.opacity = '0';
    setTimeout(() => {
        fetch(file)
            .then(res => res.text())
            .then(html => {
                area.innerHTML = html;
                area.style.opacity = '1';
            });
    }, 200);
}

