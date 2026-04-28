const board = document.getElementById("board");
const pieceSize = 100;

const image = new Image();
image.onload = createPieces;
image.src = "bg.png";

function createPieces() {
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {

            let piece = document.createElement("div");
            piece.className = "piece";

            piece.dataset.correctX = x;
            piece.dataset.correctY = y;
            piece.dataset.locked = "false";

            piece.style.backgroundPosition = `-${x * pieceSize}px -${y * pieceSize}px`;

            piece.style.left = Math.random() * 100 + "px";
            piece.style.top = Math.random() * 100 + "px";

            makeDraggable(piece);

            board.appendChild(piece);
        }
    }
}

function makeDraggable(el) {
    let isDragging = false;
    let offsetX, offsetY;

    function start(e) {
        if (el.dataset.locked === "true") return;

        isDragging = true;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        offsetX = clientX - el.offsetLeft;
        offsetY = clientY - el.offsetTop;
    }

    function move(e) {
        if (!isDragging) return;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        el.style.left = (clientX - offsetX) + "px";
        el.style.top = (clientY - offsetY) + "px";
    }

    function end(e) {
        if (!isDragging || el.dataset.locked === "true") return;
        isDragging = false;

        const correctX = el.dataset.correctX * pieceSize;
        const correctY = el.dataset.correctY * pieceSize;

        const currentX = el.offsetLeft;
        const currentY = el.offsetTop;

        const dx = currentX - correctX;
        const dy = currentY - correctY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const SNAP_DISTANCE = 40;

        if (distance < SNAP_DISTANCE) {
            el.style.left = correctX + "px";
            el.style.top = correctY + "px";
            el.dataset.locked = "true";
            el.style.cursor = "default";
            el.style.border = "2px solid #022543";
        }
    }

    // Mouse events for desktop
    el.addEventListener("mousedown", start);
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);

    // Touch events for mobile
    el.addEventListener("touchstart", start);
    document.addEventListener("touchmove", move);
    document.addEventListener("touchend", end);
}

