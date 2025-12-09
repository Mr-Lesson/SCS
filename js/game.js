// game.js
document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // ELEMENTS
    // =========================
    const startBtn = document.getElementById("start-btn");
    const titleScreen = document.getElementById("title-screen");
    const gameScreen = document.getElementById("game-screen");
    const textBox = document.getElementById("text-box");
    const choicesDiv = document.getElementById("choices");
    const canvas = document.getElementById("scene-canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 800;
    canvas.height = 400;

    // =========================
    // STATE
    // =========================
    let typing = false;
    let skipTyping = false;
    let waitingForEnter = false;
    let nextLineCallback = null;

    // Game state additions
    let gold = 50; // starting gold
    let favorSettlers = 0; // increments when player sides with settlers
    let favorOthers = 0; // increments when player helps Josiah/Aiyana/Solomon
    let testifiedForJosiah = false;
    let shieldedSomeone = false;

    // =========================
    // ART SETTINGS
    // =========================
    const CHAR_SIZE = 16;

    // =========================
    // UTILS
    // =========================
    function clearScene() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // =========================
    // BACKGROUND / SIMPLE PIXEL ART
    // =========================
    function drawBackground() {
        clearScene();

        // sky gradient
        const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
        g.addColorStop(0, "#a8d8ff");
        g.addColorStop(0.6, "#cfeefc");
        g.addColorStop(1, "#e8f7ee");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // sun
        ctx.fillStyle = "#ffd24d";
        ctx.beginPath();
        ctx.arc(700, 70, 28, 0, Math.PI * 2);
        ctx.fill();

        // distant hills
        ctx.fillStyle = "#6a8a3f";
        ctx.beginPath();
        ctx.moveTo(0, 260);
        ctx.quadraticCurveTo(200, 200, 380, 260);
        ctx.quadraticCurveTo(520, 300, 800, 260);
        ctx.lineTo(800, 400);
        ctx.lineTo(0, 400);
        ctx.fill();

        // mid hills
        ctx.fillStyle = "#3a7b2f";
        ctx.beginPath();
        ctx.moveTo(0, 300);
        ctx.quadraticCurveTo(180, 250, 360, 300);
        ctx.quadraticCurveTo(520, 350, 800, 300);
        ctx.lineTo(800, 400);
        ctx.lineTo(0, 400);
        ctx.fill();

        // winding path
        ctx.fillStyle = "#d6b98a";
        ctx.beginPath();
        ctx.moveTo(40, 360);
        ctx.quadraticCurveTo(200, 320, 360, 360);
        ctx.quadraticCurveTo(520, 400, 760, 360);
        ctx.lineTo(760, 390);
        ctx.quadraticCurveTo(520, 410, 360, 390);
        ctx.quadraticCurveTo(200, 370, 40, 390);
        ctx.closePath();
        ctx.fill();

        // river
        ctx.fillStyle = "#4aa3ff";
        ctx.beginPath();
        ctx.moveTo(120, 320);
        ctx.quadraticCurveTo(220, 280, 360, 320);
        ctx.quadraticCurveTo(500, 360, 680, 320);
        ctx.lineTo(680, 360);
        ctx.quadraticCurveTo(500, 400, 360, 360);
        ctx.quadraticCurveTo(220, 320, 120, 360);
        ctx.closePath();
        ctx.fill();

        // foreground grass strip
        ctx.fillStyle = "#79c25e";
        ctx.fillRect(0, 360, canvas.width, 40);
    }

    // =========================
    // PIXEL PRIMITIVES
    // =========================
    function drawTree(x, y, size = 18) {
        ctx.fillStyle = "#2f7b2a";
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.lineTo(x - size, y + size / 2);
        ctx.lineTo(x + size, y + size / 2);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#6b3e1f";
        ctx.fillRect(x - Math.floor(size / 6), y + size / 2, Math.floor(size / 3), Math.floor(size / 2));
    }

    function drawHouse(x, y, w = 48, h = 36) {
        ctx.fillStyle = "#7a4a22";
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = "#9b2b2b";
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + w / 2, y - h / 2);
        ctx.lineTo(x + w, y);
        ctx.closePath();
        ctx.fill();
    }

    function drawTent(x, y, w = 40, h = 30) {
        ctx.fillStyle = "#ff6b4b";
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - w / 2, y + h);
        ctx.lineTo(x + w / 2, y + h);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#a2412a";
        ctx.fillRect(x - 2, y + h - 6, 4, 6);
    }

    function drawCharacter(x, y, skin = "#f1d1bb", clothes = "#4a9", hat = false, tool = false, bag = false, scale = 1) {
        const s = Math.round(CHAR_SIZE * scale);

        // head
        ctx.fillStyle = skin;
        ctx.fillRect(x, y, s, s);

        // body
        ctx.fillStyle = clothes;
        ctx.fillRect(x, y + s, s, s * 1.6);

        // arms
        ctx.fillRect(x - Math.round(s / 2), y + s, Math.round(s / 2), Math.round(s * 1.2));
        ctx.fillRect(x + s, y + s, Math.round(s / 2), Math.round(s * 1.2));

        // legs
        ctx.fillRect(x, y + Math.round(s * 2.6), Math.round(s / 2), Math.round(s * 1.4));
        ctx.fillRect(x + Math.round(s / 2), y + Math.round(s * 2.6), Math.round(s / 2), Math.round(s * 1.4));

        // hat
        if (hat) {
            ctx.fillStyle = "#7a4a22";
            ctx.fillRect(x - Math.round(s / 6), y - Math.round(s / 4), Math.round(s * 1.3), Math.round(s / 4));
        }

        // tool
        if (tool) {
            ctx.fillStyle = "#8a8a8a";
            ctx.fillRect(x + s, y + s, Math.max(3, Math.round(s * 0.3)), Math.round(s * 1.0));
        }

        // bag
        if (bag) {
            ctx.fillStyle = "#8a6b42";
            ctx.fillRect(x - Math.round(s / 2), y + s, Math.round(s / 2), Math.round(s * 0.8));
        }
    }

    // =========================
    // SCENE DRAWERS (visuals)
    // =========================
    function scene1Visual() {
        drawBackground();
        drawCharacter(150, 240, "#f1d1bb", "#4ac", true, true, true); // Player
        drawCharacter(260, 240, "#f1d1bb", "#6f4", true, false, true); // companion
        drawHouse(520, 260);
        drawTree(670, 240, 22);
        drawTree(90, 250, 22);
    }

    function scene2Visual() {
        drawBackground();
        drawCharacter(140, 240, "#f1d1bb", "#4ac", true, true, true);
        drawCharacter(300, 240, "#f1d1bb", "#b85", true, false, true); // Elias
        drawHouse(460, 260);
        drawTent(600, 250);
        drawTree(360, 250, 20);
        drawTree(720, 260, 18);
    }

    function npc3Visual() {
        drawBackground();
        drawCharacter(160, 240, "#f1d1bb", "#4ac", true, true, true);
        drawCharacter(280, 240, "#f1d1bb", "#e96", true, false, true); // Aiyana
        drawTent(600, 250);
        drawTree(420, 250, 20);
        drawTree(720, 260, 18);
    }

    function scene3Visual() {
        drawBackground();
        drawCharacter(150, 240, "#f1d1bb", "#4ac", true, true, true);
        drawHouse(480, 260);
        drawTree(560, 240, 18);
        drawTent(620, 250);
        drawTree(720, 260, 18);
    }

    function saloonVisual() {
        drawBackground();
        drawCharacter(140, 240, "#f1d1bb", "#4ac", true, true, true);
        drawCharacter(260, 240, "#f1d1bb", "#b85", true, false, true);
        drawHouse(420, 260);
        drawTree(580, 240, 18);
        drawTent(650, 250);
    }

    function battleVisual() {
        drawBackground();
        drawCharacter(120, 240, "#f1d1bb", "#4ac", true, true, true);
        drawCharacter(240, 240, "#f1d1bb", "#6f4", true, false, true);
        drawHouse(450, 260);
        drawTree(600, 240, 18);
        drawTent(660, 250);
    }

    function finalVisual() {
        drawBackground();
        drawCharacter(150, 240, "#f1d1bb", "#4ac", true, true, true);
        drawTree(500, 240, 18);
        drawTent(620, 250);
    }

    function josiahAndSolomonVisual() {
        drawBackground();
        drawCharacter(140, 240, "#f1d1bb", "#4ac", true, true, true); // Josiah (player's friend)
        drawCharacter(200, 240, "#4a3426", "#2b2b2b", false, false, false, 0.95); // Solomon
        drawHouse(500, 260);
        drawTree(560, 240, 18);
        drawTent(620, 250);
    }

    // New forced labor visual (settler coercing Josiah)
    function forcedLaborVisual() {
        drawBackground();
        drawHouse(420, 240);
        // Settler forcing (light skin)
        drawCharacter(300, 250, "#f1d1bb", "#c88", true, false, false);
        // Josiah (darker skin)
        drawCharacter(340, 250, "#4a3426", "#6f6f6f", false, false, false);
        // Player witnessing
        drawCharacter(180, 250, "#f1d1bb", "#4ac", true, true, true);
    }

    // =========================
    // START BUTTON
    // =========================
    startBtn.addEventListener("click", () => {
        titleScreen.style.display = "none";
        gameScreen.style.display = "block";
        showSkipHint();
        scene1();
    });

    // =========================
    // TYPEWRITER
    // =========================
    function typeText(text, onComplete) {
        typing = true;
        skipTyping = false;
        waitingForEnter = false;
        textBox.innerHTML = "";
        hideChoices();
        showSkipHint();

        let i = 0;
        const speed = 26;

        function step() {
            if (skipTyping) {
                textBox.innerHTML = text;
                finish();
                return;
            }
            if (i < text.length) {
                textBox.innerHTML += text.charAt(i);
                i++;
                setTimeout(step, speed);
            } else {
                finish();
            }
        }

        function finish() {
            typing = false;
            waitingForEnter = true;
            nextLineCallback = onComplete;
        }

        step();
    }

    // =========================
    // CHOICES
    // =========================
    function showChoices(list) {
        choicesDiv.innerHTML = "";
        hideSkipHint();
        waitingForEnter = false;
        list.forEach(c => {
            const btn = document.createElement("button");
            btn.textContent = c.text;
            btn.onclick = () => typeText(c.response, () => {
                // small wrapper to allow passing of choice side effects
                if (c.onChoose) c.onChoose();
                c.action();
            });
            choicesDiv.appendChild(btn);
        });
    }

    function hideChoices() {
        choicesDiv.innerHTML = "";
    }

    // =========================
    // SKIP HINT
    // =========================
    const skipHint = document.createElement("p");
    skipHint.style.color = "#d4aa70";
    skipHint.style.fontSize = "13px";
    skipHint.style.marginTop = "8px";
    skipHint.innerText = "Press ENTER to continue";
    skipHint.style.display = "none";
    gameScreen.appendChild(skipHint);

    function showSkipHint() {
        skipHint.style.display = "block";
        updateStatusDisplay();
    }

    function hideSkipHint() {
        skipHint.style.display = "none";
    }

    // small status display for gold in top-right of canvas
    function updateStatusDisplay() {
        // clear small corner
        ctx.fillStyle = "rgba(0,0,0,0.25)";
        ctx.fillRect(canvas.width - 150, 10, 140, 36);
        ctx.fillStyle = "#f2e6c9";
        ctx.font = "14px sans-serif";
        ctx.fillText("Gold: " + gold, canvas.width - 140, 32);
    }

    // =========================
    // ENTER KEY
    // =========================
    document.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            if (typing) {
                skipTyping = true;
            } else if (waitingForEnter && nextLineCallback) {
                const fn = nextLineCallback;
                nextLineCallback = null;
                waitingForEnter = false;
                fn();
            }
        }
    });

    // =========================
    // END GAME
    // =========================
    function endGame(message) {
        typeText(message, () => {
            hideChoices();
            clearScene();
            setTimeout(() => {
                textBox.innerHTML += "<br><br><strong>Thank you for playing</strong>";
            }, 500);
        });
    }

    // =========================
    // NAMES MAPPING (kept)
    // Josiah replaces NPC1
    // Elias replaces NPC2
    // Aiyana replaces NPC3
    // Solomon is the Black arrivant
    // =========================

    // =========================
    // SCENES (full dialogue preserved)
    // =========================

    function scene1() {
        scene1Visual();
        const lines = [
            "The year is 1851. Mexico has just lost the war, and the United States has taken California. Settlers from all over now flock west, chasing the smell of gold. You walk beside your wagon headed for the Sierra Nevada, hoping for a chance to stake a claim to find some gold.",
            "As you walk, you breathe a smile of relief: after months of grueling travel, you were almost at California.",
            "The people you’ve met traveling the California Trail all said the same thing: This is the place of opportunity. This is where you will have the chance to make the money you need to make you and your family rich.",
            "You give yourself a small smile. This may be the place where your dreams can come true. A place of equal opportunity: where every man could have an equal shot at getting rich. But you must remain vigilant: despite all that those have said to you, you have no idea what you’re getting into.",
            "As you walk, you encounter Josiah, a freedman you’ve encountered many times on your way to California, setting up camp. As it’s getting late, you decide to do the same.",
            "After you finish, you begin chatting with Josiah about the land ahead.",
            'Josiah: "Back East, I worked fields I would never own. I was just property. Here, they say the land is free. You think it’ll be free for someone like me?"'
        ];
        let i = 0;
        function nextLine() {
            if (i < lines.length) {
                nextLineCallback = nextLine;
                typeText(lines[i], nextLine);
                i++;
            } else {
                showChoices([
                    {
                        text: "Of course it is free",
                        response: "Josiah nods quietly, a small hopeful smile on his face.",
                        action: () => { scene2(); }
                    },
                    {
                        text: "Not sure",
                        response: "Josiah shrugs, uncertain, but maintains a quiet optimism.",
                        action: () => { scene2(); }
                    },
                    {
                        text: "I do not care about what others think",
                        response: "Josiah looks at you, takes a deep breath, but continues with a quiet optimism.",
                        action: () => { scene2(); }
                    }
                ]);
            }
        }
        nextLine();
    }

    function scene2() {
        scene2Visual();
        const lines = [
            "After some time, you finally reach a river valley crowded with tents and rough shacks. As you look around, you see the Gold Rush is in full swing: Americans like you from the East, European fortune seekers, Chilean and Sonoran miners, Kanakas from the Pacific, and growing numbers of Chinese laborers work the banks.",
            "The hills bear scars where hydraulic hoses and picks have torn the soil. You see the remnants of what appear to be native villages along the river burnt to ashes.",
            'A broad shouldered man with a faded militia jacket walks up to you.',
            'Elias: "The name’s Elias. When I rode in 49, this valley was full of camps. Governor said they wanted to make it safe for you settlers. We took care of that. State paid us per head."'
        ];
        let i = 0;
        function nextLine() {
            if (i < lines.length) {
                nextLineCallback = nextLine;
                typeText(lines[i], nextLine);
                i++;
            } else {
                showChoices([
                    {
                        text: "Approve",
                        response: "Elias will remember this.",
                        onChoose: () => { gold += 10; favorSettlers += 1; updateStatusDisplay(); },
                        action: () => { npc3Scene(); }
                    },
                    {
                        text: "Ask about the villages",
                        response: "Elias brushes you off.",
                        action: () => { npc3Scene(); }
                    },
                    {
                        text: "Ask for advice",
                        response: "Elias advises you to avoid areas with other white men staking a claim.",
                        action: () => { npc3Scene(); }
                    }
                ]);
            }
        }
        nextLine();
    }

    function npc3Scene() {
        npc3Visual();
        const lines = [
            "As you examine the banks, a small group approaches. At their head walks Aiyana, a Maidu woman, carrying woven baskets. You see those behind her carrying items foraged from around the river.",
            'Aiyana: "Hello, I am Aiyana. The men who came before you cut down our oaks, drove off our game, and turned our water into mud. Our dead still reside here. Whatever we can find, we bring here to sell. Please, will you buy something from us?"'
        ];
        let i = 0;
        function nextLine() {
            if (i < lines.length) {
                nextLineCallback = nextLine;
                typeText(lines[i], nextLine);
                i++;
            } else {
                showChoices([
                    {
                        text: "Buy and listen",
                        response: "Aiyana thanks you and tells you more about their story.",
                        onChoose: () => { gold -= 5; favorOthers += 1; updateStatusDisplay(); },
                        action: () => { scene3(); }
                    },
                    {
                        text: "Dismiss her",
                        response: "Aiyana leaves quietly.",
                        onChoose: () => { favorSettlers += 0; },
                        action: () => { scene3(); }
                    },
                    {
                        text: "Reassure her but do not buy",
                        response: "Aiyana didn’t seem to appreciate that.",
                        onChoose: () => { favorOthers += 0; },
                        action: () => { scene3(); }
                    }
                ]);
            }
        }
        nextLine();
    }

    function scene3() {
        // Scene 3 includes the notices and then the courthouse hearing
        scene3Visual();
        const lines = [
            "Having finally found a place to claim, you begin trying to find gold, but fail. As night falls, you head to the small settlement put together for those searching for gold. You eat and fall asleep, thinking about Aiyana.",
            "As you wake up, you see some new notices being set up outside the courthouse.",
            "You walk towards them, reading the following:",
            'Act for the Government and Protection of Indians: By order of the State of California, settlers are authorized to employ indigenous persons under binding contracts and to assume custody of Indian minors as necessary for their care and protection. All such arrangements must be registered within the county.',
            'Section 14 of the Criminal Proceedings Act: No Indian or Black person shall be permitted to give evidence in any case involving a white citizen.',
            "Foreign Miner’s Tax: Effective immediately, all foreign miners are required to pay a monthly fee of $20 dollars to mine. Persons originating from China, Mexico, Chile, or other foreign countries must present proof of payment on request or vacate their claims.",
            "Inside, you see a hearing underway. A Californio man waves land grants written in Spanish while a white man argues that under American law, that grant is void.",
            'Judge: "Under the treaty of Guadalupe Hidalgo, valid Mexican grants may be recognized only when proven under the procedure of the United States. This court follows American law, and that law requires proper documentation in English."',
            'Californio through interpreter: "This land fed our family before either flag flew above it. We hold a grant signed by the Mexican Governor. Our cattle grazed here long before the Americans arrived. Must our home disappear because our papers are different?"',
            'Judge: "Your claim lacks the survey and documentation required by the Land Act of 1851. Your grant is not sufficient for recognition in this court. The present settler has demonstrated occupation and improvement under U.S. standards, thus the claim is awarded to him."',
            "You step back into the crowd and see Josiah, alongside the family of the Mexican and some white settlers, watching the trial. Josiah looks to you, almost expecting you to say something."
        ];
        let i = 0;
        function nextLine() {
            if (i < lines.length) {
                nextLineCallback = nextLine;
                typeText(lines[i], nextLine);
                i++;
            } else {
                // After the hearing text we proceed to the courthouse addition scene where Solomon is introduced
                sceneCourthouse();
            }
        }
        nextLine();
    }

    // NEW: Scene after courthouse where settler coerces/illegally enslaves Josiah
    function sceneCourthouse() {
        // Visual: courthouse crowd - reuse scene3Visual
        forcedLaborVisual();
        const lines = [
            "The judge continues and the crowd murmurs. At the edge of the courthouse a white settler stands with a man who looks worn and watchful.",
            'Solomon: "I am called Solomon. I am to accompany this settler."',
            "Solomon is a Black arrivant who had been brought along to work. He stands quietly, watching the proceedings and the exchanges.",
            "Josiah looks over to you, his expression a mixture of fatigue and resolve. Aiyana watches from the edge of the crowd, holding a small basket.",
            "You watch as, after the ruling, the settler who just won the case approaches Josiah and speaks in a low voice. The settler insists Josiah work for him to 'help with the claim'. Josiah resists.",
            "You have to decide what to do."
        ];
        let i = 0;
        function nextLine() {
            if (i < lines.length) {
                nextLineCallback = nextLine;
                typeText(lines[i], nextLine);
                i++;
            } else {
                showChoices([
                    {
                        text: "Confront the settler",
                        response: "You forcefully tell the settler his behavior is wrong. He sneers but steps back. Josiah thanks you.",
                        onChoose: () => { favorOthers += 2; gold -= 5; testifiedForJosiah = true; updateStatusDisplay(); },
                        action: () => { sceneJosiahAndArrivant(); }
                    },
                    {
                        text: "Offer Josiah some gold and leave",
                        response: "You slip Josiah some coins and walk away. He nods softly but appears resigned.",
                        onChoose: () => { gold -= 10; favorOthers += 1; updateStatusDisplay(); },
                        action: () => { sceneJosiahAndArrivant(); }
                    },
                    {
                        text: "Do nothing and let it be",
                        response: "You stay silent. The settler drags Josiah away. You feel a hollow weight in your chest.",
                        onChoose: () => { favorSettlers += 1; gold += 5; updateStatusDisplay(); },
                        action: () => { sceneJosiahAndArrivant(); }
                    }
                ]);
            }
        }
        nextLine();
    }

    function sceneJosiahAndArrivant() {
        josiahAndSolomonVisual();
        const lines = [
            'Josiah: "We have come a long way and things are changing fast. I will keep an eye out for you."',
            'Solomon: "I will do what I must, but I wish freedom had come sooner."',
            "Aiyana approaches with a small woven basket and offers some food. The three of you share a quiet moment before deciding what to do next.",
            "Together, you plan your next steps in this unsettled land."
        ];
        let i = 0;
        function nextLine() {
            if (i < lines.length) {
                nextLineCallback = nextLine;
                typeText(lines[i], nextLine);
                i++;
            } else {
                showChoices([
                    {
                        text: "Continue to the settlement",
                        response: "You all head toward the small settlement to find your claims and prepare for the work ahead.",
                        action: () => { scene4Normal(); }
                    },
                    {
                        text: "Offer to help Solomon find work",
                        response: "Solomon looks grateful but cautious.",
                        onChoose: () => { favorOthers += 1; gold -= 2; updateStatusDisplay(); },
                        action: () => { scene4Normal(); }
                    },
                    {
                        text: "Part ways for now",
                        response: "Josiah nods and you each take your own route for now.",
                        action: () => { scene4Normal(); }
                    }
                ]);
            }
        }
        nextLine();
    }

    function scene4Normal() {
        saloonVisual();
        const lines = [
            "One evening, miners and townspeople gather outside a saloon. Elias sits on a crate, reading a notice.",
            'Elias: "County Supervisors have authorized funds for a new expedition. A band in the hills has been accused of stock theft and threatening settlers. The state will reimburse expenses and those who bring in hostiles."',
            'Elias: "Player, your standing on land men like us cleared. Are you riding with us?"'
        ];
        let i = 0;
        function nextLine() {
            if (i < lines.length) {
                nextLineCallback = nextLine;
                typeText(lines[i], nextLine);
                i++;
            } else {
                showChoices([
                    {
                        text: "Join fully",
                        response: "You agree to join the expedition fully.",
                        onChoose: () => { gold += 20; favorSettlers += 2; updateStatusDisplay(); },
                        action: () => { sceneBattle(); }
                    },
                    {
                        text: "Refuse",
                        response: "You refuse. Nothing changes today.",
                        action: () => { endGame("You refused the expedition. Nothing changes today."); }
                    },
                    {
                        text: "Join but will not shoot unless needed",
                        response: "You join but promise to avoid killing unless necessary.",
                        onChoose: () => { gold += 10; updateStatusDisplay(); },
                        action: () => { sceneBattle(); }
                    }
                ]);
            }
        }
        nextLine();
    }

    function scene4NPC1Followup() {
        // This scene triggered earlier in original logic as well
        drawBackground();
        drawCharacter(110, 240, "#f1d1bb", "#4ac", true, true, true);
        drawCharacter(230, 240, "#f1d1bb", "#c84", true, false, true);
        drawHouse(400, 260);
        drawTree(550, 240, 18);
        drawTent(600, 250);
        const lines = [
            "Josiah comes up to you later that day, covered in scratches and bruises.",
            'Josiah: "A white miner jumped my claim. When I fought back, he and his friends beat me. If this goes to court, notice says my word can’t stand against his."',
            "What do you say?"
        ];
        let i = 0;
        function nextLine() {
            if (i < lines.length) {
                nextLineCallback = nextLine;
                typeText(lines[i], nextLine);
                i++;
            } else {
                showChoices([
                    {
                        text: "Blame him",
                        response: "Distance grows between you and Josiah. Josiah leaves.",
                        onChoose: () => { favorSettlers += 1; gold += 5; updateStatusDisplay(); },
                        action: () => { scene4Normal(); }
                    },
                    {
                        text: "Promise to testify for him",
                        response: "Josiah thanks you sincerely.",
                        onChoose: () => { testifiedForJosiah = true; favorOthers += 2; updateStatusDisplay(); },
                        action: () => { scene4Normal(); }
                    },
                    {
                        text: "Tell him he should move on",
                        response: "Josiah gets upset and leaves.",
                        onChoose: () => { favorSettlers += 0; },
                        action: () => { scene4Normal(); }
                    }
                ]);
            }
        }
        nextLine();
    }

    function sceneBattle() {
        battleVisual();
        const lines = [
            "At dawn, you ride into the hills with Josiah and several others. You find the camp filled with small shelters.",
            "Gunfire erupts. People scatter. What will you do?"
        ];
        let i = 0;
        function nextLine() {
            if (i < lines.length) {
                nextLineCallback = nextLine;
                typeText(lines[i], nextLine);
                i++;
            } else {
                showChoices([
                    {
                        text: "Fire at a fleeing figure",
                        response: "The camp is destroyed and burnt down. Josiah praises your effort. You win a sizeable bounty.",
                        onChoose: () => { gold += 40; favorSettlers += 2; updateStatusDisplay(); },
                        action: () => { finalScene(); }
                    },
                    {
                        text: "Fire and purposefully miss",
                        response: "Same destruction occurs. Josiah is upset and you do not receive any reward.",
                        onChoose: () => { favorOthers -= 1; updateStatusDisplay(); },
                        action: () => { finalScene(); }
                    },
                    {
                        text: "Shield someone physically",
                        response: "A few are saved. Josiah is extremely upset and promises punishment.",
                        onChoose: () => { shieldedSomeone = true; favorOthers += 2; gold -= 20; updateStatusDisplay(); },
                        action: () => { finalScene(); }
                    }
                ]);
            }
        }
        nextLine();
    }

    // =========================
    // FINAL / REFLECTION
    // reflection with 3 endings determined by gold and choices
    // =========================
    function finalScene() {
        finalVisual();
        // compute fate based on gold and actions
        const linesIntro = [
            "Fast forward to 1855, the gold is all but gone.",
            "You get an opportunity to talk to Josiah and reflect on the choices you made.",
            'Josiah: "Based on your actions, here’s what I think about how we all navigated these times..."'
        ];
        let i = 0;
        function nextReflection() {
            if (i < linesIntro.length) {
                nextLineCallback = nextReflection;
                typeText(linesIntro[i], nextReflection);
                i++;
            } else {
                // show reflection (campfire) screen and decide ending
                runReflection();
            }
        }
        nextReflection();
    }

    function runReflection() {
        finalReflectionVisual();
        // Determine ending score
        // Heuristic:
        // if favorSettlers high and gold high => Settler Prosperity ending
        // if favorOthers high or testifiedForJosiah or shieldedSomeone => Moral/Communal ending (helped others)
        // else low gold and neutral => Tainted/Regret ending
        const totalFavorSettlers = favorSettlers;
        const totalFavorOthers = favorOthers + (testifiedForJosiah ? 1 : 0) + (shieldedSomeone ? 1 : 0);

        // Compose lines to show and choose one of three endings
        let endingTitle = "";
        let endingLines = [];

        if (gold >= 80 || totalFavorSettlers >= 3) {
            // Settler Prosperity Ending (material success, morally compromised)
            endingTitle = "Settler Prosperity";
            endingLines = [
                "Around the campfire your actions are remembered.",
                "Because you sided with the expanding settler interests and collected gold, you are materially comfortable: a modest ranch and claim have your name on them.",
                "Josiah's face in the firelight looks distant. He does not forgive easily, and many of the people you hurt will remember your choices.",
                `Gold total: ${gold}`,
                "This is your prosperity at a cost."
            ];
        } else if (totalFavorOthers >= 3 || gold < 40) {
            // Moral/Communal Ending (helped others, less gold)
            endingTitle = "Moral Communion";
            endingLines = [
                "The campfire warmth is small but real. Because you stood up for others, helped Josiah or Aiyana, and shielded the vulnerable, they gather close.",
                "Gold is not plentiful, but bonds are. You have respect and a place among folks who survived together.",
                `Gold total: ${gold}`,
                "It is a hard life, but something like dignity remains."
            ];
        } else {
            // Tainted/Regret Ending (mixed, ambiguous)
            endingTitle = "Tainted Regret";
            endingLines = [
                "You sit by the dying embers. You have some gold and some friends, but neither fully. Your choices were mixed: sometimes convenience, sometimes courage.",
                "Josiah nods at you with a complicated expression. The land remembers.",
                `Gold total: ${gold}`,
                "You will live with that mixture."
            ];
        }

        // Display the reflection lines then the ending
        let j = 0;
        function nextReflectionLine() {
            if (j < endingLines.length) {
                nextLineCallback = nextReflectionLine;
                typeText(endingLines[j], nextReflectionLine);
                j++;
            } else {
                // final end
                typeText("=== THE END ===", () => {
                    hideChoices();
                    // optionally show a summary
                    setTimeout(() => {
                        textBox.innerHTML += `<br><br><strong>Ending: ${endingTitle}</strong>`;
                        textBox.innerHTML += `<br>Gold: ${gold} | FavorSettlers: ${favorSettlers} | FavorOthers: ${favorOthers} | Testified: ${testifiedForJosiah} | Shielded: ${shieldedSomeone}`;
                    }, 300);
                });
            }
        }
        nextReflectionLine();
    }

    // Helper visuals used earlier but declared after to keep file orderly
    function scene3VisualPlaceholder() {
        drawBackground();
        drawCharacter(150, 240, "#f1d1bb", "#4ac", true, true, true);
        drawHouse(480, 260);
        drawTree(560, 240, 18);
        drawTent(620, 250);
        drawTree(720, 260, 18);
    }

    function josiahAndSolomonVisualPlaceholder() {
        drawBackground();
        drawCharacter(140, 240, "#f1d1bb", "#4ac", true, true, true);
        drawCharacter(200, 240, "#4a3426", "#2b2b2b", false, false, false, 0.95);
        drawHouse(500, 260);
        drawTree(560, 240, 18);
        drawTent(620, 250);
    }

    // Map the visual names used earlier to placeholders (keeps original call names)
    function scene3Visual() { scene3VisualPlaceholder(); }
    function josiahAndSolomonVisual() { josiahAndSolomonVisualPlaceholder(); }

    // =========================
    // ON-LOAD DRAW
    // update status once to show initial gold
    // =========================
    drawBackground();
    updateStatusDisplay();

}); // DOMContentLoaded end
