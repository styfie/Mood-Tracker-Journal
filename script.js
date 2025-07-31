// Quotes categorized by mood
const quotesByMood = {
  happy: [
    "Keep smiling, it's contagious 😊",
    "Today is a beautiful day to be happy!",
    "Happiness looks good on you!",
    "Keep the good vibes going 💛"
  ],
  sad: [
    "It's okay to not be okay 💙",
    "You are stronger than you think",
    "Worry about nothing. Pray about everything",
    "This too shall pass 🌧️☀️"
  ],
  angry: [
    "Take a deep breath. You're in control 🔥",
    "It's okay to feel angry, just don't let it control you.",
    "Turn your anger into action 💪",
    "Anger is valid. Let it pass like a storm."
  ],
  tired: [
    "Rest if you must, but don't quit 😴",
    "You're allowed to take a break. You deserve it",
    "Recharge, don't give up 🌙",
    "Even superheroes need to rest 💤"
  ],
  normal: [
    "A calm day is a blessing ☁️",
    "Not every day needs fireworks, sometimes peace is enough 🌼",
    "Enjoy the little moments.",
    "Balance is beautiful ⚖️"
  ]
};

let selectedMood = null;
let selectedEmoji = null;

const emojiButtons = document.querySelectorAll('.emoji-picker button');
const reasonInput = document.querySelector('textarea');
const saveButton = document.querySelector('.save-btn');
const quoteBox = document.getElementById('quote-box');
const calendarEl = document.getElementById('calendar');

if (emojiButtons.length > 0) {
  emojiButtons.forEach(button => {
    button.addEventListener('click', () => {
      emojiButtons.forEach(btn => btn.classList.remove('selected'));
      button.classList.add('selected');
      selectedEmoji = button.textContent;
      selectedMood = button.parentElement.dataset.mood;
      showQuote(selectedMood);
    });
  });
}

function showQuote(mood) {
  const quotes = quotesByMood[mood];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  if (quoteBox) quoteBox.textContent = randomQuote;
}

if (saveButton) {
  saveButton.addEventListener('click', () => {
    if (!selectedEmoji || !selectedMood) {
      alert("Please select a mood emoji!");
      return;
    }

    const journalText = reasonInput.value.trim();
    const today = new Date().toISOString().split('T')[0];

    const moodEntry = {
      emoji: selectedEmoji,
      mood: selectedMood,
      journal: journalText
    };

    localStorage.setItem(today, JSON.stringify(moodEntry));
    alert("Mood saved!");

    reasonInput.value = "";
    emojiButtons.forEach(btn => btn.classList.remove('selected'));
    selectedEmoji = null;
    selectedMood = null;
  });
}

// Calendar page logic
let viewDate = new Date();

function updateCalendarTitle() {
  const titleEl = document.getElementById("calendar-title");
  const options = { month: "long", year: "numeric" };
  titleEl.textContent = `Mood Calendar – ${viewDate.toLocaleDateString("en-US", options)}`;
}

function populateDropdowns() {
  const monthSelect = document.getElementById("month-select");
  const yearSelect = document.getElementById("year-select");

  if (!monthSelect || !yearSelect) return;

  monthSelect.innerHTML = "";
  yearSelect.innerHTML = "";

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  months.forEach((month, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.text = month;
    monthSelect.appendChild(option);
  });

  const currentYear = new Date().getFullYear();
  for (let y = currentYear - 5; y <= currentYear + 5; y++) {
    const option = document.createElement("option");
    option.value = y;
    option.text = y;
    yearSelect.appendChild(option);
  }

  monthSelect.value = viewDate.getMonth();
  yearSelect.value = viewDate.getFullYear();

  monthSelect.addEventListener("change", () => {
    viewDate.setMonth(parseInt(monthSelect.value));
    renderCalendar();
  });

  yearSelect.addEventListener("change", () => {
    viewDate.setFullYear(parseInt(yearSelect.value));
    renderCalendar();
  });
}

function renderCalendar() {
  updateCalendarTitle();
  populateDropdowns();
  if (!calendarEl) return;

  calendarEl.innerHTML = "";

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    calendarEl.appendChild(empty);
  }

  for (let day = 1; day <= lastDate; day++) {
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
      dayBox.title = entry.mood;
      dayBox.style.cursor = "pointer";

      dayBox.addEventListener("click", () => {
        const newJournal = prompt(`Edit journal for ${entry.emoji} on ${dateStr}:`, entry.journal || "");
        if (newJournal !== null) {
          entry.journal = newJournal;
          localStorage.setItem(dateStr, JSON.stringify(entry));
          renderCalendar();
        }
      });

      dayBox.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        if (confirm(`Delete mood entry for ${dateStr}?`)) {
          localStorage.removeItem(dateStr);
          renderCalendar();
        }
      });
    }

    calendarEl.appendChild(dayBox);
  }
}

document.getElementById("prev-month")?.addEventListener("click", () => {
  viewDate.setMonth(viewDate.getMonth() - 1);
  renderCalendar();
});

document.getElementById("next-month")?.addEventListener("click", () => {
  viewDate.setMonth(viewDate.getMonth() + 1);
  renderCalendar();
});

if (calendarEl) renderCalendar();
