// script.js

// Get all emoji buttons
const emojiButtons = document.querySelectorAll('.emoji-picker button');

let selectedEmoji = null;

emojiButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove 'selected' class from all
    emojiButtons.forEach(btn => btn.classList.remove('selected'));

    // Add 'selected' class to clicked button
    button.classList.add('selected');

    // Store selected emoji (for saving later)
    selectedEmoji = button.textContent;
  });
});

const saveButton = document.querySelector('.save-btn');
const journalInput = document.querySelector('textarea');

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
