import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11.22.3/+esm";

// ====== Ask Player Name ======
document.querySelector(".control-buttons span").onclick = async function () {
  const { value: playerName } = await Swal.fire({
    title: "Enter Your Name",
    input: "text",
    inputLabel: "Your Name",
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value) {
        return "You need to write something!";
      }
    },
  });

  if (playerName) {
    document.querySelector(".name span").innerHTML = playerName;
    document.querySelector(".control-buttons").remove();
  }
};

// ====== Game Settings ======
let duration = 1000; // Duration for flipping blocks back in ms
let blocksContainer = document.querySelector(".game-container");
let blocks = Array.from(blocksContainer.children);

// ====== Create an array of numbers representing order ======
let orderRange = Array.from(Array(blocks.length).keys());

// ====== Fisher–Yates Shuffle Algorithm ======
for (let i = orderRange.length - 1; i > 0; i--) {
  let j = Math.floor(Math.random() * (i + 1));
  [orderRange[i], orderRange[j]] = [orderRange[j], orderRange[i]];
}

// ====== Apply random order and add click event ======
blocks.forEach((block, index) => {
  block.style.order = orderRange[index];
  block.addEventListener("click", () => flipBlock(block));
});

// ====== Flip Block Function ======
function flipBlock(selectedBlock) {
  selectedBlock.classList.add("flipped");

  let allFlippedBlocks = blocks.filter((b) => b.classList.contains("flipped"));

  if (allFlippedBlocks.length === 2) {
    stopClicking();
    checkMatched(allFlippedBlocks);
  }
}

// ====== Prevent Clicking Temporarily ======
function stopClicking() {
  blocksContainer.classList.add("no-clicking");
  setTimeout(() => {
    blocksContainer.classList.remove("no-clicking");
  }, duration);
}

// ====== Check If Two Flipped Blocks Match ======
function checkMatched([firstBlock, secondBlock]) {
  let triesElement = document.querySelector(".tries span");

  if (firstBlock.dataset.technology === secondBlock.dataset.technology) {
    // If blocks match
    firstBlock.classList.remove("flipped");
    secondBlock.classList.remove("flipped");

    firstBlock.classList.add("has-match");
    secondBlock.classList.add("has-match");

    // Check if all blocks are matched
    if (blocks.every((b) => b.classList.contains("has-match"))) {
      Swal.fire({
        icon: "success",
        title: "You Won! 🎉",
        text: "Congratulations, you matched all pairs!",
        showCancelButton: true,
        confirmButtonText: "Play Again",
        cancelButtonText: "Close",
      }).then((result) => {
        if (result.isConfirmed) {
          // Reload page to restart game
          location.reload();
        }
      });
    }
  } else {
    // If blocks do not match
    triesElement.textContent = parseInt(triesElement.textContent) + 1;

    setTimeout(() => {
      firstBlock.classList.remove("flipped");
      secondBlock.classList.remove("flipped");
    }, duration);
  }
}
