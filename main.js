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


// Target word
let targetWord = "threejs";
let targetWordGroup = createText(targetWord, 0.5, 0.1, -2, 1, 0);

// Typed word (initially empty)
let typedWord = "";
let typedWordGroup = createText(typedWord, 0.3, 0.05, -2, 0, 0);


// --- Game Logic ---

// Function to update the typed word
function updateTypedWord(char) {
    typedWord += char;
    scene.remove(typedWordGroup); // Remove the old text
    typedWordGroup = createText(typedWord, 0.3, 0.05, -2, 0, 0); // Create new text
}

// Function to check if the typed word matches the target word
function checkWord() {
    if (typedWord === targetWord) {
        // Correct word typed!
        console.log("Correct!");
        // Reset
        typedWord = "";
        scene.remove(typedWordGroup);
        typedWordGroup = createText(typedWord, 0.3, 0.05, -2, 0, 0);

        // Get a new target word (for now, just cycle through some words)
        const words = ["threejs", "typing", "game", "javascript", "webgl"];
        targetWord = words[(words.indexOf(targetWord) + 1) % words.length];
        scene.remove(targetWordGroup);
        targetWordGroup = createText(targetWord, 0.5, 0.1, -2, 1, 0);

    } else if (targetWord.startsWith(typedWord)) {
        // Still typing the correct word
        console.log("Keep typing...");
    }
     else {
        // Incorrect word
        console.log("Incorrect!");
        // Reset typed word
        typedWord = "";
        scene.remove(typedWordGroup);
        typedWordGroup = createText(typedWord, 0.3, 0.05, -2, 0, 0);
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
        typedWordGroup = createText(typedWord, 0.3, 0.05, -2, 0, 0);
        checkWord();
    }
});

// --- Animation Loop ---

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate(); 