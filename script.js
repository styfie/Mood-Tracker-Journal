// script.js

// Get all emoji buttons
const emojiButtons = document.querySelectorAll('.emoji-picker button');
let selectedEmoji = null;

emojiButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    // Hapus semua highlight
    emojiButtons.forEach(btn => btn.classList.remove('selected'));
    
    // Tambahkan highlight ke tombol yang dipilih
    button.classList.add('selected');
    
    // Simpan emoji dan mood
    selectedEmoji = button.textContent;

    const mood = button.parentElement.getAttribute("data-mood");
    showQuoteForMood(mood);
  });
});

function showQuoteForMood(mood) {
  const quoteBox = document.getElementById("quote-box");
  let quote = "";

  switch (mood) {
    case "happy":
      quote = happyQuotes[Math.floor(Math.random() * happyQuotes.length)];
      break;
    case "sad":
      quote = sadQuotes[Math.floor(Math.random() * sadQuotes.length)];
      break;
    case "angry":
      quote = angryQuotes[Math.floor(Math.random() * angryQuotes.length)];
      break;
    case "tired":
      quote = tiredQuotes[Math.floor(Math.random() * tiredQuotes.length)];
      break;
    case "normal":
      quote = normalQuotes[Math.floor(Math.random() * normalQuotes.length)];
      break;
    default:
      quote = "";
  }

  quoteBox.textContent = quote;
}


const saveButton = document.querySelector('.save-btn');
const journalInput = document.querySelector('textarea');

const happyQuotes = [
  "Keep smiling, it's contagious 😊",
  "Today is a beautiful day to be happy!",
  "Happiness looks good on you!",
  "Keep the good vibes going 💛"
];

const sadQuotes = [
  "It's okay to not be okay 💙",
  "You are stronger than you think",
  "Worry about nothing. Pray about everything",
  "This too shall pass 🌧️☀️"
];

const angryQuotes = [
  "Take a deep breath. You're in control 🔥",
  "It's okay to feel angry, just don't let it control you.",
  "Turn your anger into action 💪",
  "Anger is valid. Let it pass like a storm."
];

const tiredQuotes = [
  "Rest if you must, but don't quit 😴",
  "You're allowed to take a break. You deserve it",
  "Recharge, don't give up 🌙",
  "Even superheroes need to rest 💤"
];

const normalQuotes = [
  "A calm day is a blessing ☁️",
  "Not every day needs fireworks, sometimes peace is enough 🌼",
  "Enjoy the little moments.",
  "Balance is beautiful ⚖️"
];

saveButton.addEventListener('click', () => {
  if (!selectedEmoji) {
    alert("Please select a mood emoji!");
    return;
  }

  const journalText = journalInput.value.trim();
  const today = new Date().toISOString().split('T')[0]; // format: "2025-07-24"

  const moodEntry = {
    emoji: selectedEmoji,
    journal: journalText
  };
  
  
  // Save to localStorage
  localStorage.setItem(today, JSON.stringify(moodEntry));

  alert("Mood saved!");
  journalInput.value = ""; // Clear journal input
  emojiButtons.forEach(btn => btn.classList.remove('selected'));
  selectedEmoji = null;

  // Optional: refresh calendar after saving
  renderCalendar();
});

function handleEmojiClick(event) {
  selectedMood = event.target.getAttribute("data-mood");

  // Highlight selected
  emojiBoxes.forEach(box => box.classList.remove("selected"));
  event.target.classList.add("selected");

  // Show related quote
  const quoteBox = document.getElementById("quote-box");
  let quote = "";

  switch (selectedMood) {
    case "happy":
      quote = happyQuotes[Math.floor(Math.random() * happyQuotes.length)];
      break;
    case "sad":
      quote = sadQuotes[Math.floor(Math.random() * sadQuotes.length)];
      break;
    case "angry":
      quote = angryQuotes[Math.floor(Math.random() * angryQuotes.length)];
      break;
    case "tired":
      quote = tiredQuotes[Math.floor(Math.random() * tiredQuotes.length)];
      break;
    case "normal":
      quote = normalQuotes[Math.floor(Math.random() * normalQuotes.length)];
      break;
    default:
      quote = "";
  }

  quoteBox.textContent = quote;
}


function renderCalendar() {
  const calendarEl = document.getElementById("calendar");
  calendarEl.innerHTML = ""; // Clear previous calendar

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0 = January

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const totalDays = lastDay.getDate();

  const startDay = firstDay.getDay(); // 0 = Sunday

  // Add empty boxes before the 1st of the month
  for (let i = 0; i < startDay; i++) {
    const empty = document.createElement("div");
    calendarEl.appendChild(empty);
  }

  for (let day = 1; day <= totalDays; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const entry = JSON.parse(localStorage.getItem(dateStr));

    const dayBox = document.createElement("div");
    dayBox.classList.add("calendar-day");
    dayBox.textContent = day;

    if (entry) {
      const emoji = document.createElement("div");
      emoji.textContent = entry.emoji;
      emoji.style.fontSize = "1.5rem";
      dayBox.appendChild(emoji);

      dayBox.style.cursor = "pointer";
      dayBox.addEventListener("click", () => {
        alert(`Mood: ${entry.emoji}\nJournal: ${entry.journal || "(no journal)"}`);
      });
    }

    calendarEl.appendChild(dayBox);
  }
}

// Render calendar when page loads
renderCalendar();
