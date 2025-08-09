// ---------------------------
// Chaotic SnarkBot (DeepSeek)
// ---------------------------

const API_KEY = "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"; // ⚠️ Don't expose this in production! Only for local/dev use.

const chat = document.getElementById('chat');
const input = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearBtn');

// Add chat bubble
function addBubble(text, who = 'bot') {
  const el = document.createElement('div');
  el.className = 'bubble ' + (who === 'me' ? 'me' : 'bot');
  el.innerHTML = text; // allow emojis
  chat.appendChild(el);
  chat.scrollTop = chat.scrollHeight;
}

// Detect distress (basic safety guard)
function userShowsDistress(s) {
  const distressWords = [
    'sad', 'depress', 'suicid', 'hopeless', 'alone',
    'kill myself', 'cant go on', 'worthless'
  ];
  s = s.toLowerCase();
  return distressWords.some(w => s.includes(w));
}

// Fun random emoji
function randomEmoji() {
  const emojis = ["😂", "🙃", "🦄", "🍕", "🔥", "🤡", "🥴", "👀", "💩", "😜", "🪩", "🤯"];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

// Predefined fallback replies
const funnyReplies = [
  "Oh sure, let me just consult my crystal ball 🔮... yep, still no idea.",
  "Wow, deep question... have you tried asking your toaster?",
  "Hold up, I need coffee before I answer that ☕.",
  "That’s above my pay grade, ask Google… or your cat.",
  "Oh absolutely... if we were in an alternate universe 🌌.",
  "Bruh. Just… bruh.",
  "Plot twist: I’m actually a potato 🥔.",
  "Do you want the short answer or the overcomplicated nonsense one?",
  "If I answer this, do I get pizza?",
  "You’re speaking to an AI, not Gandalf."
];

// Get AI response from DeepSeek via OpenRouter
async function getResponse(text) {
  if (userShowsDistress(text)) {
    return "I’m hearing some distress. If you’re feeling very low, please reach out to someone you trust or a helpline ❤️. You matter.";
  }

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
        "HTTP-Referer": "http://localhost:5500", // Change to your site if hosted
        "X-Title": "Snarky Chatbot"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat", // DeepSeek model
        messages: [
          {
            role: "system",
            content: "Answer in a ridiculous, unserious, sarcastic tone with random jokes."
          },
          {
            role: "user",
            content: text
          }
        ]
      })
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    if (data.choices?.length) {
      return `${data.choices[0].message.content} ${randomEmoji()} ${randomEmoji()}`;
    }
  } catch (err) {
    console.error("Error fetching AI reply:", err);
  }

  // Fallback if API fails
  return `${funnyReplies[Math.floor(Math.random() * funnyReplies.length)]} ${randomEmoji()} ${randomEmoji()}`;
}

// Send message from user
function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addBubble(text, 'me');
  input.value = '';

  const typingEl = document.createElement('div');
  typingEl.className = 'bubble bot';
  typingEl.textContent = "SnarkBot is thinking...";
  chat.appendChild(typingEl);
  chat.scrollTop = chat.scrollHeight;

  getResponse(text).then(reply => {
    chat.removeChild(typingEl);
    addBubble(reply, 'bot');
  });
}

// Event listeners
sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMessage();
});
clearBtn.addEventListener('click', () => {
  chat.innerHTML = '';
  addBubble("Say hi to Chaotic SnarkBot! 🤪", 'bot');
});

// Initial greeting
addBubble("Say hi to Chaotic SnarkBot! 🤪", 'bot');
