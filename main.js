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

// Function to create text geometry (modified to accept random positions)
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


// Target word (now an array to manage multiple words)
let targetWords = [];
const words = ["threejs", "typing", "game", "javascript", "webgl"];

// Function to add a new target word
function addTargetWord() {
    const word = words[Math.floor(Math.random() * words.length)];
    const x = (Math.random() * 4) - 2; // Random x between -2 and 2
    const y = (Math.random() * 2) - 1; // Random y between -1 and 1
    const group = createText(word, 0.5, 0.1, x, y, 0);
    targetWords.push({ word: word, group: group });
}

// Initialize with a few words
addTargetWord();
addTargetWord();
addTargetWord();


// Typed word (initially empty)
let typedWord = "";
let typedWordGroup = createText(typedWord, 0.3, 0.05, -2, -2, 0); // Keep typed word at a fixed position


// --- Game Logic ---

// Function to update the typed word
function updateTypedWord(char) {
    typedWord += char;
    scene.remove(typedWordGroup); // Remove the old text
    typedWordGroup = createText(typedWord, 0.3, 0.05, -2, -2, 0); // Create new text, fixed position
}

// Function to check if the typed word matches the target word
function checkWord() {
    for (let i = 0; i < targetWords.length; i++) {
        if (typedWord === targetWords[i].word) {
            // Correct word typed!
            console.log("Correct!");

            // Disappear after a delay
            setTimeout(() => {
                scene.remove(targetWords[i].group);
                targetWords.splice(i, 1); // Remove from the array
                addTargetWord(); // Add a new word immediately
            }, 500); // 500ms delay

            // Reset typed word
            typedWord = "";
            scene.remove(typedWordGroup);
            typedWordGroup = createText(typedWord, 0.3, 0.05, -2, -2, 0);
            return; // Important: Exit the loop after a match is found

        } else if (targetWords[i].word.startsWith(typedWord)) {
            // Still typing the correct word
            console.log("Keep typing...");
            return; //optimization
        }
    }

    //if we get here, no match was found
    if(typedWord.length > 0) { //avoid empty strings
        console.log("Incorrect!");
        // Reset typed word
        typedWord = "";
        scene.remove(typedWordGroup);
        typedWordGroup = createText(typedWord, 0.3, 0.05, -2, -2, 0);
    }

}

// --- Event Listener ---

document.addEventListener('keydown', (event) => {
    const key = event.key;

    // Only handle alphanumeric keys and backspace
    if (key.length === 1) { // Single character (a-z, 0-9, etc.)
        updateTypedWord(key);
        checkWord();
    } else if (key === 'Backspace') {
        typedWord = typedWord.slice(0, -1); // Remove last character
        scene.remove(typedWordGroup);
        typedWordGroup = createText(typedWord, 0.3, 0.05, -2, -2, 0);
        checkWord();
    }
});

// --- Animation Loop ---

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate(); 