// DOM Elements
const startBtn = document.getElementById("start-btn");
const titleScreen = document.getElementById("title-screen");
const gameScreen = document.getElementById("game-screen");
const textBox = document.getElementById("text-box");
const choicesDiv = document.getElementById("choices");

// ==== START BUTTON ====
startBtn.addEventListener("click", () => {
    titleScreen.style.display = "none";
    gameScreen.style.display = "block";
    scene1();
});

// ==== TYPEWRITER SYSTEM WITH ENTER ADVANCE ====
let linesQueue = [];
let currentCallback = null;
let typing = false;
let charIndex = 0;
let currentText = "";
let speed = 20; // Faster typing
const skipHintText = "Press ENTER to continue...";

function showLines(lines, callback) {
    linesQueue = [...lines];
    currentCallback = callback;
    showNextLine();
}

function showNextLine() {
    if (linesQueue.length === 0) {
        if (currentCallback) currentCallback();
        return;
    }
    currentText = linesQueue.shift();
    charIndex = 0;
    textBox.innerHTML = "";
    typing = true;
    typeLine();
}

function typeLine() {
    if (charIndex < currentText.length) {
        textBox.innerHTML += currentText.charAt(charIndex);
        charIndex++;
        setTimeout(typeLine, speed);
    } else {
        typing = false;
        const skipHint = document.createElement("div");
        skipHint.style.fontSize = "14px";
        skipHint.style.marginTop = "8px";
        skipHint.style.color = "#d4aa70";
        skipHint.textContent = skipHintText;
        textBox.appendChild(skipHint);
    }
}

// Press Enter to advance
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        if (typing) {
            textBox.innerHTML = currentText + `<div style="font-size:14px;margin-top:8px;color:#d4aa70">${skipHintText}</div>`;
            typing = false;
        } else {
            showNextLine();
        }
    }
});

// ==== SHOW CHOICES ====
function showChoices(choices) {
    choicesDiv.innerHTML = "";
    choices.forEach(choice => {
        const btn = document.createElement("button");
        btn.textContent = choice.text;
        btn.className = "choice-btn";
        btn.onclick = () => choice.action();
        choicesDiv.appendChild(btn);
    });
}

function typeSingleLine(text, callback) {
    showLines([text], callback);
}

// ==== SCENES ====

// Scene 1
function scene1() {
    const lines = [
        "Narrator: The year is 1851. Mexico has just lost the war, and the United States has taken California. Settlers from all over now flock west, chasing the smell of gold. You walk beside your wagon headed for the Sierra Nevada, hoping for a chance to stake a claim to find some gold.",
        "As you walk, you breathe a smile of relief: after months of grueling travel, you were almost at California.",
        "The people you’ve met traveling the California Trail all said the same thing: This is the place of opportunity. This is where you will have the chance to make the money you need to make you and your family rich.",
        "You give yourself a small smile. This may be the place where your dreams can come true. A place of equal opportunity: where every man could have an equal shot at getting rich. But you must remain vigilant: despite all that those have said to you, you have no idea what you’re getting into.",
        "As you walk, you encounter NPC1, a freedman you’ve encountered many times on your way to California, setting up camp. As it’s getting late, you decide to do the same.",
        "After you finish, you begin chatting with NPC1 about the land ahead.",
        'NPC1: "Back East, I worked fields I would never own. I was just property. Here, they say the land is free. You think it’ll be free for someone like me?"'
    ];

    showLines(lines, () => {
        showChoices([
            { text: "Of course it's free", action: () => typeSingleLine(
                'NPC1 smiles faintly, a mixture of hope and caution in his eyes. "I hope your optimism is justified… we have all been told that, but I’ve seen too many promises fall apart. Still, it feels good to hear someone speak with confidence about the future."', 
                scene2
            )},
            { text: "Not sure", action: () => typeSingleLine(
                'NPC1 nods slowly, looking down at the ground. "It’s complicated, stranger. The land is said to be free, but freedom is not guaranteed for people like me. We must tread carefully and hope that this promise holds true."', 
                scene2
            )},
            { text: "I don’t care about what others think", action: () => typeSingleLine(
                'NPC1 frowns, but there is a hint of understanding in his eyes. "Hmm… at least you are honest. Sometimes indifference is better than false hope. Just remember, our actions shape what this land will become."', 
                scene2
            )}
        ]);
    });
}

// Scene 2
function scene2() {
    const lines = [
        "Narrator: After some time, you finally reach a river valley crowded with tents and rough shacks. Gold Rush is in full swing.",
        "The hills bear scars where hydraulic hoses and picks have torn the soil. You see the remnants of what appear to be native villages along the river burnt to ashes.",
        "A broad-shouldered man with a faded militia jacket walks up to you.",
        'NPC2: "The name’s NPC2. When I rode in ‘49, this valley was full of camps. Governor said they wanted to make it ‘safe’ for you settlers. We took care of that. State paid us per head."'
    ];
    showLines(lines, () => {
        showChoices([
            { text: "Approve", action: () => typeSingleLine('NPC2 nods, approving your agreement.', sceneNPC3) },
            { text: "Ask about the villages", action: () => typeSingleLine('NPC2 brushes off your question with a stern look.', sceneNPC3) },
            { text: "Ask for advice", action: () => typeSingleLine('NPC2 advises: "Avoid areas with other white men staking a claim."', sceneNPC3) }
        ]);
    });
}

// Scene NPC3
function sceneNPC3() {
    const lines = [
        "Narrator: As you examine the banks, a small group approaches. At their head walks a Maidu woman, carrying woven baskets. You see those behind her carrying items foraged from around the river.",
        'NPC3: "Hello, I am NPC3. The men who came before you cut down our oaks, drove off our game, and turned our water into mud. Our dead still reside here. Whatever we can find, we bring here to sell. Please, will you buy something from us?"'
    ];
    showLines(lines, () => {
        showChoices([
            { text: "Buy and listen", action: () => typeSingleLine('NPC3 thanks you and tells you more about their story.', scene3) },
            { text: "Dismiss her", action: () => typeSingleLine('NPC3 leaves silently, disappointed.', scene3) },
            { text: "Reassure but don’t buy", action: () => typeSingleLine('NPC3 looks unhappy but understands.', scene3) }
        ]);
    });
}

// Scene 3
function scene3() {
    const lines = [
        "Having finally found a place to claim, you begin trying to find gold, but fail. As night falls, you head to the small settlement put together for those searching for gold. You eat and fall asleep, thinking about NPC3.",
        "Next morning, you see new notices being set up outside the courthouse.",
        'You read: "Act for the Government and Protection of Indians": Settlers authorized to employ indigenous persons under binding contracts...',
        "Section 14 of the Criminal Proceedings Act: No Indian or Black person shall be permitted to give evidence in any case involving a white citizen.",
        "Foreign Miner’s Tax: All foreign miners must pay $20 per month or vacate claims.",
        "Inside, a hearing is underway. A Californio man waves land-grants written in Spanish, while a white man argues that under American law, the grant is void.",
        'Judge: "Under the treaty of Guadalupe Hidalgo, valid Mexican grants may be recognized only when proven under U.S. law."',
        'Californio (Through interpreter): "This land fed our family before either flag flew above it. Must our home disappear because our papers are different?"',
        'Judge: "Your claim lacks the survey and documentation required by the Land Act of 1851. The present settler has demonstrated occupation and improvement under U.S. standards, thus the claim is awarded to him."'
    ];
    showLines(lines, () => {
        showChoices([
            { text: "Praise the ruling", action: () => typeSingleLine('NPC1 scoffs and turns away. NPC2 steps out of the crowd.', scene4) },
            { text: "Quietly approach the family", action: () => typeSingleLine('Family looks disheartened, NPC1 gives a small smile.', scene4) },
            { text: "Turn away", action: () => typeSingleLine('NPC1 gives you a strange look.', scene4) },
            { text: "Object to the trial", action: () => typeSingleLine('Judge flatly denies you. NPC2 is extremely unhappy. NPC1 and the Californio family thank you.', scene4B) }
        ]);
    });
}

// Scene 4 (main path)
function scene4() {
    const lines = [
        "Evening outside the saloon. NPC2 reads a notice about a new expedition.",
        'NPC2: "Player. Your standing on land men like us cleared. Are you riding with us?"'
    ];
    showLines(lines, () => {
        showChoices([
            { text: "Join fully", action: () => typeSingleLine('At dawn, you ride into the hills with NPC1 and others.', sceneBattle) },
            { text: "Refuse", action: () => endGame("You refused the expedition. Nothing changes today.") },
            { text: "Join but won’t shoot unless needed", action: () => typeSingleLine('You join cautiously, avoiding unnecessary harm.', sceneBattle) }
        ]);
    });
}

// Scene 4B (after objection in scene3)
function scene4B() {
    const lines = [
        'NPC1 comes up to you later that day, covered in scratches and bruises.',
        'NPC1: "A white miner jumped my claim. When I fought back, he and his friends beat me. If this goes to court, notice says my word can’t stand against his."'
    ];
    showLines(lines, () => {
        showChoices([
            { text: "Blame him", action: () => typeSingleLine('Distance grows between you and NPC1. NPC1 leaves.', sceneBattle) },
            { text: "Promise to testify for him", action: () => typeSingleLine('NPC1 thanks you for your support.', sceneBattle) },
            { text: "Tell him he should move on", action: () => typeSingleLine('NPC1 gets upset and leaves.', sceneBattle) }
        ]);
    });
}

// Scene Battle
function sceneBattle() {
    const lines = [
        "Dawn. You ride into the hills. Camp found. Firing begins!"
    ];
    showLines(lines, () => {
        showChoices([
            { text: "Fire at a fleeing figure", action: () => endGame("The camp is destroyed and burnt down, almost no survivors are found. NPC1 praises your effort and you win a sizeable bounty.") },
            { text: "Fire over their heads", action: () => endGame("The camp is destroyed. You avoid killing but many die. NPC1 is upset.") },
            { text: "Shield someone physically", action: () => endGame("A small section of natives are saved. NPC1 is extremely upset, promises punishment.") }
        ]);
    });
}

// End Game
function endGame(message) {
    textBox.innerHTML = message + "\n\n=== END OF GAME ===";
    choicesDiv.innerHTML = "";
}
