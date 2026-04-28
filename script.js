const puzzle = [
  ["S", "O", "L", "#", "R"],
  ["J", "#", "Y", "A", "K"],
  ["O", "R", "D", "#", "E"],
  ["R", "E", "V", "Y", "#"],
  ["D", "A", "T", "A", "#"]
];

const across = [
  { n: 1, clue: "Stjerne i sentrum av vårt solsystem (3)", answer: "SOL" },
  { n: 4, clue: "Rask bevegelse i vann, ofte med finne (HAI baklengs i rutenettet) (3)", answer: "RIA" },
  { n: 5, clue: "Tekst i dokument eller tale (3)", answer: "ORD" },
  { n: 6, clue: "Kort for dataanalyse-språket i revers (4)", answer: "REVY" },
  { n: 7, clue: "Informasjon lagret digitalt (4)", answer: "DATA" }
];

const down = [
  { n: 1, clue: "Motsatt av å ikke være i orden (5)", answer: "SJORD" },
  { n: 2, clue: "Bokstavrekke med O-R-E-A (4)", answer: "OREA" },
  { n: 3, clue: "Bokstavrekke med L-Y-D-V-T (5)", answer: "LYDVT" },
  { n: 4, clue: "Bokstavrekke med R-K-E (3)", answer: "RKE" }
];

const board = document.getElementById("board");
const acrossList = document.getElementById("acrossClues");
const downList = document.getElementById("downClues");
const statusEl = document.getElementById("status");

const inputs = [];

function isBlock(r, c) {
  return puzzle[r][c] === "#";
}

function cellNumber(r, c) {
  if (isBlock(r, c)) return null;
  const startsAcross = c === 0 || isBlock(r, c - 1);
  const startsDown = r === 0 || isBlock(r - 1, c);
  if (!startsAcross && !startsDown) return null;

  let count = 0;
  for (let rr = 0; rr < puzzle.length; rr++) {
    for (let cc = 0; cc < puzzle[0].length; cc++) {
      if (isBlock(rr, cc)) continue;
      const sa = cc === 0 || isBlock(rr, cc - 1);
      const sd = rr === 0 || isBlock(rr - 1, cc);
      if (sa || sd) {
        count += 1;
      }
      if (rr === r && cc === c) return count;
    }
  }
  return null;
}

function buildBoard() {
  for (let r = 0; r < puzzle.length; r++) {
    for (let c = 0; c < puzzle[r].length; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      if (isBlock(r, c)) {
        cell.classList.add("block");
        board.appendChild(cell);
        continue;
      }

      const n = cellNumber(r, c);
      if (n) {
        const badge = document.createElement("span");
        badge.className = "num";
        badge.textContent = String(n);
        cell.appendChild(badge);
      }

      const input = document.createElement("input");
      input.maxLength = 1;
      input.dataset.r = String(r);
      input.dataset.c = String(c);
      input.addEventListener("input", () => {
        input.value = input.value.toUpperCase().replace(/[^A-ZÆØÅ]/g, "");
      });
      cell.appendChild(input);
      inputs.push(input);
      board.appendChild(cell);
    }
  }
}

function renderClues(listEl, items) {
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.n}. ${item.clue}`;
    listEl.appendChild(li);
  });
}

function checkAnswers() {
  let total = 0;
  let good = 0;

  inputs.forEach((input) => {
    const r = Number(input.dataset.r);
    const c = Number(input.dataset.c);
    const expected = puzzle[r][c];
    const actual = (input.value || "").toUpperCase();
    total += 1;
    if (actual === expected) {
      good += 1;
      input.style.background = "#e9f8ef";
    } else {
      input.style.background = "#fff1f1";
    }
  });

  if (good === total) {
    statusEl.textContent = "Perfekt! Hele kryssordet er riktig.";
    statusEl.className = "ok";
  } else {
    statusEl.textContent = `Du har ${good} av ${total} riktige bokstaver.`;
    statusEl.className = "bad";
  }
}

function resetBoard() {
  inputs.forEach((input) => {
    input.value = "";
    input.style.background = "#fff";
  });
  statusEl.textContent = "";
  statusEl.className = "";
}

buildBoard();
renderClues(acrossList, across);
renderClues(downList, down);

document.getElementById("checkBtn").addEventListener("click", checkAnswers);
document.getElementById("resetBtn").addEventListener("click", resetBoard);
