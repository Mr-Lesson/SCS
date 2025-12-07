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

// ==== TYPEWRITER SYSTEM WITH ENTER SKIP ====
let typing = false;
let skip = false;
let currentCallback = null;

function showLines(lines, callback) {
    let index = 0;

    function nextLine() {
        if (index < lines.length) {
            typeText(lines[index], () => {
                index++;
                nextLine();
            });
        } else if (callback) {
            callback();
        }
    }

    nextLine();
}

function typeText(text, callback) {
    textBox.innerHTML = "";
    choicesDiv.innerHTML = "";
    typing = true;
    skip = false;
    currentCallback = callback;

    let i = 0;
    let speed = 32; // milliseconds per character
    const skipHint = document.createElement("div");
    skipHint.style.fontSize = "14px";
    skipHint.style.marginTop = "8px";
    skipHint.style.color = "#d4aa70";
    skipHint.textContent = "Press ENTER to skip...";
    textBox.appendChild(skipHint);

    function type() {
        if (skip) {
            textBox.innerHTML = text;
            textBox.appendChild(skipHint);
            typing = false;
            if (callback) callback();
            return;
        }
        if (i < text.length) {
            textBox.innerHTML = textBox.innerHTML.replace(skipHint.outerHTML, "") + text.charAt(i);
            i++;
            textBox.appendChild(skipHint);
            setTimeout(type, speed);
        } else {
            typing = false;
            if (callback) callback();
        }
    }

    type();
}

// SKIP WITH ENTER
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && typing) {
        skip = true;
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

// HELPER to show a line then a callback
function typeLine(text, callback) {
    typeText(text, callback);
}

// ==== SCENES ====

// Scene 1
function scene1() {
    let lines = [
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
            { text: "Of course it's free", action: () => typeLine(
                'NPC1 smiles faintly, a mixture of hope and caution in his eyes. "I hope your optimism is justified… we have all been told that, but I’ve seen too many promises fall apart. Still, it feels good to hear someone speak with confidence about the future."', 
                scene2
            )},
            { text: "Not sure", action: () => typeLine(
                'NPC1 nods slowly, looking down at the ground. "It’s complicated, stranger. The land is said to be free, but freedom is not guaranteed for people like me. We must tread carefully and hope that this promise holds true."', 
                scene2
            )},
            { text: "I don’t care about what others think", action: () => typeLine(
                'NPC1 frowns, but there is a hint of understanding in his eyes. "Hmm… at least you are honest. Sometimes indifference is better than false hope. Just remember, our actions shape what this land will become."', 
                scene2
            )}
        ]);
    });
}

// Scene 2
function scene2() {
    let lines = [
        "Narrator: After some time, you finally reach a river valley crowded with tents and rough shacks. As you look around, you see the Gold Rush is in full swing: Americans like you from the East, European fortune seekers, Chilean and Sonoran miners, Kanakas from the Pacific, and growing numbers of Chinese laborers work the banks.",
        "The hills bear scars where hydraulic hoses and picks have torn the soil. You see the remnants of what appear to be native villages along the river burnt to ashes.",
        "A broad-shouldered man with a faded militia jacket walks up to you.",
        'NPC2: "The name’s NPC2. When I rode in ‘49, this valley was full of camps. Governor said they wanted to make it ‘safe’ for you settlers. We took care of that. State paid us per head."'
    ];

    showLines(lines, () => {
        showChoices([
            { text: "Approve", action: () => typeLine(
                'NPC2 nods approvingly and slaps you on the shoulder. "Good, it’s important that new settlers follow the rules, we need steady hands to keep order around here."', 
                sceneNPC3
            )},
            { text: "Ask about the villages", action: () => typeLine(
                'NPC2 shrugs. "Those villages? Not much to say… they were cleared long ago. Best not to get involved."', 
                sceneNPC3
            )},
            { text: "Ask for advice", action: () => typeLine(
                'NPC2 leans in close, lowering his voice. "Keep to areas where you have room, and avoid conflict with other claimants. That is how you stay alive and wealthy."', 
                sceneNPC3
            )}
        ]);
    });
}

// Scene NPC3
function sceneNPC3() {
    let lines = [
        "Narrator: As you examine the banks, a small group approaches. At their head walks a Maidu woman, carrying woven baskets. You see those behind her carrying items foraged from around the river.",
        'NPC3: "Hello, I am NPC3. The men who came before you cut down our oaks, drove off our game, and turned our water into mud. Our dead still reside here. Whatever we can find, we bring here to sell. Please, will you buy something from us?"'
    ];

    showLines(lines, () => {
        showChoices([
            { text: "Buy and listen", action: () => typeLine(
                'NPC3 smiles warmly, "Thank you for listening. There are stories of our struggles, of the land and our people. I can tell you what we have seen, if you wish to understand the valley."', 
                scene3
            )},
            { text: "Dismiss her", action: () => typeLine(
                'NPC3 frowns and shakes her head. "Very well, I will leave you to your journey. May your travels be safe, though we wish for fairness in these lands."', 
                scene3
            )},
            { text: "Reassure her but don’t buy", action: () => typeLine(
                'NPC3 looks disappointed, "I see… at least you mean well. Perhaps next time, you will consider more than just your own gain."', 
                scene3
            )}
        ]);
    });
}

// Scene 3
function scene3() {
    let lines = [
        "Having finally found a place to claim, you begin trying to find gold, but fail. As night falls, you head to the small settlement put together for those searching for gold. You eat and fall asleep, thinking about NPC3.",
        "Next morning, you see some new notices being set up outside the courthouse.",
        "Inside, a hearing is underway. A Californio man waves land-grants written in Spanish while a white man argues that under American law, that grant is void.",
        "Judge: Under the treaty of Guadalupe Hidalgo, valid Mexican grants may be recognized only when proven under the procedure of the United States. This court follows American law, and that law requires proper documentation in English.",
        "NPC1 looks to you, almost expecting you to say something."
    ];

    showLines(lines, () => {
        showChoices([
            { text: "Praise the ruling", action: () => typeLine(
                'NPC1 scoffs quietly but doesn’t argue. NPC2 steps forward, "That’s the kind of clear head we need. Old grants, tribal talk… they just tie up good ground." You feel a mix of unease and relief.', 
                scene4
            )},
            { text: "Object to the trial", action: () => typeLine(
                'NPC1 looks disappointed. "This is exactly why we must stay vigilant." NPC2 frowns and approaches you afterward, warning that your actions could have consequences.', 
                scene3B
            )},
            { text: "Turn away", action: () => typeLine(
                'NPC1 watches you leave silently. There is a tension in the air as the ruling is announced without your input.', 
                scene4
            )},
            { text: "Quietly approach the family", action: () => typeLine(
                'NPC1 nods at your discretion. The family of the Californio man looks at you with a mixture of fear and hope, understanding that your choices may influence their fate.', 
                scene3B
            )}
        ]);
    });
}

// Scene 3B: NPC1 follow-up after trial
function scene3B() {
    let lines = [
        "Later that day, NPC1 comes up to you, covered in scratches and bruises.",
        'NPC1: "A white miner jumped my claim. When I fought back, he and his friends beat me. If this goes to court, notice says my word can’t stand against his."',
        "What do you say?"
    ];

    showLines(lines, () => {
        showChoices([
            { text: "Blame him", action: () => typeLine(
                'NPC1 glares at you, "I can’t rely on you for help. I’ll have to handle things myself." He leaves, distant and disheartened.', 
                scene4
            )},
            { text: "Promise to testify for him", action: () => typeLine(
                'NPC1’s eyes soften. "Thank you. Your support could make a difference in the courts. I am grateful."', 
                scene4
            )},
            { text: "Tell him he should move on", action: () => typeLine(
                'NPC1 frowns, "I suppose… but it feels wrong to just let this go." He walks away, frustrated and disappointed.', 
                scene4
            )}
        ]);
    });
}

// Scene 4
function scene4() {
    let lines = [
        "One evening, miners and townspeople gather outside a saloon. NPC2 sits on a crate, reading a notice.",
        'NPC2: "County Supervisors have authorized funds for a new expedition. A band in the hills has been accused of stock theft and threatening settlers. The state will reimburse expenses and those who bring in ‘hostiles’. Player, your standing on land men like us cleared. Are you riding with us?"'
    ];

    showLines(lines, () => {
        showChoices([
            { text: "Join fully", action: () => typeLine(
                'NPC2 smiles, "Excellent. Together we will ensure the land is safe and claims are protected."', 
                sceneBattle
            )},
            { text: "Refuse", action: () => typeLine(
                'NPC2 frowns, "Very well… nothing changes today, but be ready if called upon."', 
                () => endGame("You refused the expedition. Nothing changes today.")
            )},
            { text: "Join but say you won’t shoot unless needed", action: () => typeLine(
                'NPC2 nods cautiously. "I understand. Stay alert and follow our lead. Lives may still be lost."', 
                sceneBattle
            )}
        ]);
    });
}

// Scene Battle
function sceneBattle() {
    let lines = [
        "Narrator: At dawn, you ride into the hills with NPC1 and several others. You find the camp filled with small shelters.",
        "Others begin firing around you, what will you do?"
    ];

    showLines(lines, () => {
        showChoices([
            { text: "Fire at a fleeing figure", action: () => typeLine(
                "The camp burns as chaos erupts around you. NPC1 praises your decisiveness, though a weight lingers in your chest. You gain a bounty but feel the moral cost heavily.", 
                endGame
            )},
            { text: "Fire and purposefully miss", action: () => typeLine(
                "You aim over their heads, hoping to scare them without killing. Many still perish in the crossfire. NPC1 is upset, seeing the results of your cautious approach.", 
                endGame
            )},
            { text: "Shield someone physically", action: () => typeLine(
                "You throw yourself in front of a vulnerable figure, saving a few. NPC1 is furious at the losses but notices your bravery. A sense of unease remains as most are still harmed.", 
                endGame
            )}
        ]);
    });
}

// END GAME
function endGame(message) {
    typeText(`${message}\n\n=== END OF GAME ===`);
    choicesDiv.innerHTML = "";
}
