// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('game-canvas') });
renderer.setSize(800, 600);

// Basic scene setup (background color)
scene.background = new THREE.Color(0x202020);

// Camera positioning
camera.position.z = 5;

// --- Text Rendering ---

// Function to create text geometry
function createText(text, size, height, x, y, z) {
    const loader = new THREE.FontLoader();
    const group = new THREE.Group();

    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        const textGeometry = new THREE.TextGeometry(text, {
            font: font,
            size: size,
            height: height,
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        textMesh.position.set(x, y, z);
        group.add(textMesh);
        scene.add(group);
    });
    return group;
}

// --- Game Variables ---
let targetWord = null; // Single target word
const words = [
    // Tiere (Animals)
    "Hund", // dog
    "Katze", // cat
    "Maus", // mouse
    "Vogel", // bird
    "Fisch", // fish
    "Pferd", // horse
    "Kuh", // cow
    "Schwein", // pig
    "Affe", // monkey
    "Bär", // bear

    // Gegenstände (Objects)
    "Ball", // ball
    "Buch", // book
    "Stift", // pen
    "Tisch", // table
    "Stuhl", // chair
    "Haus", // house
    "Auto", // car
    "Baum", // tree
    "Blume", // flower
    "Sonne", // sun
    "Mond", // moon
    "Stern", // star

    // Farben (Colors)
    "rot", // red
    "blau", // blue
    "grün", // green
    "gelb", // yellow
    "schwarz", // black
    "weiß", // white
    "braun", // brown
    "rosa", // pink

    // Familie (Family)
    "Mama", // mom
    "Papa", // dad
    "Bruder", // brother
    "Schwester", // sister
    "Oma", // grandma
    "Opa", // grandpa

    // Essen (Food)
    "Brot", // bread
    "Milch", // milk
    "Apfel", // apple
    "Banane", // banana
    "Käse", // cheese
    "Ei", // egg
    "Saft", // juice
    "Wasser", // water

    //Verben
    "sehen", //see
    "laufen", //run
    "spielen", //play
    "essen", //eat
    "trinken", //drink
    "singen", //sing
    "malen", //paint
    "lesen", //read
    "schreiben", //write
    "lachen", //laugh

     // Simple Sentences, combining words from above
    "Ich sehe.",       // I see.
    "Du siehst.",      // You see.
    "Ich laufe.",      // I run.
    "Du läufst.",     // You run.
    "Ich spiele.",     // I play.
    "Ich esse.",       // I eat.
    "Ich trinke.",     // I drink.
    "Ich singe.",      // I sing.
    "Ich male.",       // I paint/draw.
    "Ich lese.",       // I read.
    "Ich schreibe.",   // I write.
    "Ich lache.",      // I laugh.
];
let typedWord = "";
let typedWordGroup = createText(typedWord, 0.3, 0.05, -2, -2, 0); // Keep typed word at a fixed position
let score = 0;
const scoreDisplay = document.getElementById('score-display');

// --- Game Logic ---

// Function to add a new target word
function addTargetWord() {
    if (targetWord) return; // Ensure only one target word at a time

    const word = words[Math.floor(Math.random() * words.length)];
    const x = (Math.random() * 4) - 2; // Random x between -2 and 2
    const y = -2; // Start at the bottom
    const group = createText(word, 0.5, 0.1, x, y, 0);
    targetWord = { word: word, group: group, speed: 0.01 + Math.random() * 0.02 }; // Add speed
}

// Function to update the typed word
function updateTypedWord(char) {
    typedWord += char;
    scene.remove(typedWordGroup);
    typedWordGroup = createText(typedWord, 0.3, 0.05, -2, -2, 0);
}

// Function to check if the typed word matches the target word
function checkWord() {
    if (targetWord && typedWord === targetWord.word) {
        // Correct word typed!
        console.log("Correct!");
        score++;
        scoreDisplay.textContent = "Score: " + score;

        // Remove the word immediately (no delay)
        scene.remove(targetWord.group);
        targetWord = null;

        // Reset typed word
        typedWord = "";
        scene.remove(typedWordGroup);
        typedWordGroup = createText(typedWord, 0.3, 0.05, -2, -2, 0);
        addTargetWord(); // Add a new word

    } else if (targetWord && targetWord.word.startsWith(typedWord)) {
        // Keep typing...
    }
     else if (typedWord.length > 0){
        // Incorrect input: Reset typed word
        typedWord = "";
        scene.remove(typedWordGroup);
        typedWordGroup = createText(typedWord, 0.3, 0.05, -2, -2, 0);
    }
}

// --- Event Listener ---

document.addEventListener('keydown', (event) => {
    const key = event.key;

    // Only handle alphanumeric keys and backspace
    if (key.length === 1) {
        updateTypedWord(key);
        checkWord();
    } else if (key === 'Backspace') {
        typedWord = typedWord.slice(0, -1);
        scene.remove(typedWordGroup);
        typedWordGroup = createText(typedWord, 0.3, 0.05, -2, -2, 0);
        checkWord();
    }
});

// --- Animation Loop ---

function animate() {
    requestAnimationFrame(animate);

    // Move and remove the target word
    if (targetWord) {
        targetWord.group.position.y += targetWord.speed;

        // Remove if it goes off-screen
        if (targetWord.group.position.y > 2) {
            scene.remove(targetWord.group);
            targetWord = null;
            addTargetWord(); // Add a new word
        }
    }

    // Add a new word if there isn't one
    if (!targetWord) {
        addTargetWord();
    }

    renderer.render(scene, camera);
}
animate(); 