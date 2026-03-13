// --- CONFIG & DATA ---
const LOAD_SPEED_MS = 350; // speed of animation / loader engine
const PAGES_DIR = "assets/pages/"; // variable, source path of pages

const codeSnippets = [
    "color:$main-color", "opacity:0", "z-index:999", "display:flex", "margin:0_auto", 
    "position:absolute", "pointer-events:none", "Math.random()", "performance.now()", "if(!output)return",
    "div_class='row'", "href='#'", "const_LOAD_SPEED", "document.getElem", "window.addEvent",
    "flex-direction:col", "padding:10px", "overflow:hidden", "cursor:pointer", "outline:none",
    "box-sizing:border", "width:100%", "height:100vh", "top:0;left:0", "filter:blur(2px)",
    "clip-path:poly()", "transform:scale(1)", "user-select:none", "let_active=true", "fetch(file.url)",
    "JSON.parse(raw)", "return_false;", "if(err)throw", "async_function()", "await_response",
    "event.target", "setTimeout(tick)", "setInterval(run)", "Array.from(list)", "Object.keys(obj)",
    "console.log(msg)", "requestAnimFrame", "ctx.beginPath()", "canvas.draw()", "span_id='stat'",
    "img_src='01.png'", "ul_class='nav'", "button_type='b'", "input_type='t'", "nav_role='main'",
    "background:$bg-color", "animation:rotate", "mix-blend-mode", "will-change:auto", "transition:0.4s",
    "text-align:center", "font-family:Hacked", "letter-spacing:1px", "text-transform:up", "max-width:400px",
    "display:inline-block", "white-space:nowrap", "min-width:40px", "opacity:1!important", "transform:transZ",
    "backface-visibility", "antialiased", "contain:paint", "transition:opacity", "min-height:400px",
    "width:calc(100%-2px)", "position:relative", "justify-content:ctr", "align-items:stretch", "height:60px",
    "text-decoration:none", "isolation:isolate", "content:attr(data)", "inset(0_0_51%_0)", "animation:glitch",
    "visibility:visible", "pointer-events:auto", "flex-direction:row", "border-bottom:1px", "gap:5px",
    "cursor:pointer", "display:none!imp", "border-top:1px_solid", "mask-image:linear", "filter:blur(1px)",
    "scaleY(-1)", "letter-spacing:25px", "font:bold_1.05em", "background-repeat:rep", "background-size:250",
    "hue-rotate(60deg)", "saturate(3)", "brightness(1.2)", "contrast(1.1)", "pointer-events:none"
];

// --- animation LOADER ENGINE ---
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

    // visual update menu
    if (element) {
        document.querySelectorAll('.nav-links-container a').forEach(link => {
            link.classList.remove('active-link');
        });
        element.classList.add('active-link');

        // selected page / mobile version
        if (mobileIndicator) {
            const txt = element.getAttribute('data-text').toUpperCase();
            mobileIndicator.innerText = txt;
            mobileIndicator.setAttribute('data-text', txt);
        }

        // close menu after click / mobile version
        if (menu && menu.classList.contains('is-open')) {
            menu.classList.remove('is-open');
            toggle.classList.remove('is-active');
        }
    }

    // animation of content
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

    // 1. loading animation loop
    startCodeLoop();

    // 2. hamburger menu event
    if (toggle && menu) {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Kritické: zabráni zavretiu hneď po otvorení
            toggle.classList.toggle('is-active');
            menu.classList.toggle('is-open');
            console.log("System: Hamburger state toggled.");
        });
    }

// 3. linking
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        

        let fileName = link.getAttribute('data-file');
        
        if (!fileName) {
            fileName = link.getAttribute('data-text').toLowerCase().replace(/\s/g, '') + ".html";
        }

        // Ak už data-file obsahuje celú cestu (assets/pages/...), použijeme ju.
        // Ak nie, prilepíme pred ňu našu premennú PAGES_DIR.
        const finalPath = fileName.startsWith('assets') ? fileName : PAGES_DIR + fileName;
        
        navigate(finalPath, link);
    });
});

    // 4. close menu outside click
    document.addEventListener('click', (e) => {
        if (menu && menu.classList.contains('is-open')) {
            if (!menu.contains(e.target) && !toggle.contains(e.target)) {
                menu.classList.remove('is-open');
                toggle.classList.remove('is-active');
            }
        }
    });

    // 5. loading base page
    const homeLink = document.querySelector('.nav-links-container a.active-link') || navLinks[0];
    if (homeLink) {
        let homeFile = homeLink.getAttribute('data-file') || "home.html";

        const finalHomePath = homeFile.includes('/') ? homeFile : PAGES_DIR + homeFile;
        
        navigate(finalHomePath, homeLink);
    }
});