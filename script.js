const imagePaths = [...Array(30).keys()].map(i => `images/image${i}.jpg`); // Change to .png if needed
let placedImages = new Map(); 
let usedImages = new Set(); // To track used images

function displayImages() {
    let container = document.getElementById("image-container");
    container.innerHTML = "";
    imagePaths.forEach(path => {
        let img = document.createElement("img");
        img.src = path;
        img.className = "image-box";
        container.appendChild(img);
    });

    startCountdown(120); // 2 minutes countdown

    setTimeout(() => {
        skipViewing();
    }, 120000); // 2 minutes
}

function startCountdown(seconds) {
    let timerElement = document.getElementById("timer");
    let interval = setInterval(() => {
        let minutes = Math.floor(seconds / 60);
        let secs = seconds % 60;
        timerElement.innerText = `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
        seconds--;
        if (seconds < 0) {
            clearInterval(interval);
            skipViewing();
        }
    }, 1000);
}

function skipViewing() {
    document.getElementById("viewing-phase").style.display = "none";
    document.getElementById("recall-phase").style.display = "block";
    setupRecallGrid();
}

function setupRecallGrid() {
    let bank = document.getElementById("photo-bank");
    let grid = document.getElementById("empty-grid");

    bank.innerHTML = "";
    grid.innerHTML = "";

    let shuffledImages = [...imagePaths].sort(() => Math.random() - 0.5);

    shuffledImages.forEach(path => {
        let container = document.createElement("div");
        container.style.position = "relative";
        container.className = "photo-container";

        let img = document.createElement("img");
        img.src = path;
        img.className = "image-box draggable";
        img.draggable = true;
        img.ondragstart = dragStart;
        container.appendChild(img);

        let xOverlay = document.createElement("div");
        xOverlay.className = "used";
        xOverlay.innerText = "X";
        xOverlay.style.display = "none"; // Initially hidden
        container.appendChild(xOverlay);

        bank.appendChild(container);
    });

    for (let i = 0; i < 30; i++) {
        let slot = document.createElement("div");
        slot.className = "grid-slot";
        slot.ondragover = allowDrop;
        slot.ondrop = drop;
        grid.appendChild(slot);
        placedImages.set(slot, null); // Track slot contents
    }
}

function dragStart(event) {
    event.dataTransfer.setData("text", event.target.src);
    event.dataTransfer.setData("origin", event.target.parentNode.className);
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    let data = event.dataTransfer.getData("text");
    let origin = event.dataTransfer.getData("origin");
    let targetSlot = event.target.closest(".grid-slot");

    if (targetSlot && !usedImages.has(data)) {
        let draggedImg = document.createElement("img");
        draggedImg.src = data;
        draggedImg.className = "image-box";
        draggedImg.draggable = true;
        draggedImg.ondragstart = dragStart;
        targetSlot.appendChild(draggedImg);
        usedImages.add(data);

        let bankImages = document.querySelectorAll(".photo-container img");
        bankImages.forEach(img => {
            if (img.src.includes(data)) {
                img.style.opacity = "0.3"; 
                img.parentNode.querySelector(".used").style.display = "flex"; 
            }
        });
    }
}

window.onload = displayImages;
