
// Gemini API key and configuration
const API_KEY = "AIzaSyCxMEitiQFch34Qzz5QNXqknZOYnoYJzB0"; // Replace with your actual API key
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// DOM elements
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const clearChatBtn = document.getElementById('clear-chat-btn');
const newChatBtn = document.getElementById('new-chat-btn');
const welcomeMessage = document.getElementById('welcome-message');
const currentChatTitle = document.getElementById('current-chat-title');
const historySearch = document.getElementById('history-search');
const searchResults = document.getElementById('search-results');
const todayChats = document.getElementById('today-chats');
const previousChats = document.getElementById('previous-chats');
const inputContainer = document.getElementById('input-container');
const overlay = document.getElementById('overlay');
const menuBtn = document.getElementById('menu-btn');
const closeSidebar = document.getElementById('close-sidebar');
const sidebar = document.getElementById('sidebar');
const mobileOverlay = document.getElementById('mobile-overlay');
const deviceIndicator = document.getElementById('device-indicator');
const deviceText = document.getElementById('device-text');
const clickableDiv = document.querySelector(".clickable");
const newChatToastContainer = document.getElementById("newChatToastContainer");
const clearBtn = document.getElementById("clear-chat-btn");
const toastContainer = document.getElementById("toast-container");

messageInput.addEventListener('input', function () {
  if (this.value.trim().length > 0) {
    // Input has text → darker button
    sendBtn.classList.remove('bg-blue-200');
    sendBtn.classList.add('bg-blue-500');
  } else {
    // Input is empty → lighter button
    sendBtn.classList.remove('bg-blue-500');
    sendBtn.classList.add('bg-blue-200');
  }
});
// Delete to create a toast popup

function createToast(message) {
  const toast = document.createElement("div");
  toast.className = `
  bg-gray-800 text-white px-6 py-4 rounded-lg shadow-lg
  flex items-center gap-2 min-w-[200px]
 text-md opacity-0 translate-y-[-20px] transition-all duration-500 ease-in-out
  whitespace-nowrap overflow-hidden
`;

  toast.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span class="flex-1">${message}</span>
    <button class="text-white hover:text-gray-300 focus:outline-none">
      <i class="fas fa-times"></i>
    </button>
  `;

  const closeBtn = toast.querySelector("button");
  closeBtn.addEventListener("click", () => {
    toast.classList.remove("opacity-100", "translate-y-0");
    toast.classList.add("opacity-0", "translate-y-[-20px]");
    setTimeout(() => toast.remove(), 300);
  });

  toastContainer.appendChild(toast);

  // Show toast (fade + slide)
  setTimeout(() => {
    toast.classList.remove("opacity-0", "translate-y-[-20px]");
    toast.classList.add("opacity-100", "translate-y-0");
  }, 50);

  // Auto-hide after 3 seconds
  setTimeout(() => {
    toast.classList.remove("opacity-100", "translate-y-0");
    toast.classList.add("opacity-0", "translate-y-[-20px]");
  }, 3000);

  setTimeout(() => toast.remove(), 3500);
}

clearBtn.addEventListener("click", () => {
  createToast("Chat cleared successfully!");
});


//new chat toast

newChatBtn.addEventListener("click", () => {
  createNewChatToast("New chat added!");
});

// Function to create a toast like your clear-chat toast
function createNewChatToast(message) {
  const toast = document.createElement("div");
  toast.className = `
    bg-gray-800 text-white px-6 py-4 rounded-lg shadow-lg
    flex items-center gap-2 min-w-[200px]
    text-md opacity-0 translate-y-[-20px] transition-all duration-500 ease-in-out
    whitespace-nowrap overflow-hidden
  `;

  toast.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span class="flex-1">${message}</span>
    <button class="text-white hover:text-gray-300 focus:outline-none">
      <i class="fas fa-times"></i>
    </button>
  `;

  const closeBtn = toast.querySelector("button");
  closeBtn.addEventListener("click", () => {
    toast.classList.remove("opacity-100", "translate-y-0");
    toast.classList.add("opacity-0", "translate-y-[-20px]");
    setTimeout(() => toast.remove(), 300);
  });

  newChatToastContainer.appendChild(toast);

  // Show toast (fade + slide)
  setTimeout(() => {
    toast.classList.remove("opacity-0", "translate-y-[-20px]");
    toast.classList.add("opacity-100", "translate-y-0");
  }, 50);

  // Auto-hide after 3 seconds
  setTimeout(() => {
    toast.classList.remove("opacity-100", "translate-y-0");
    toast.classList.add("opacity-0", "translate-y-[-20px]");
  }, 3000);

  setTimeout(() => toast.remove(), 3500);
}

// Chat state
let currentChat = [];
let allChats = JSON.parse(localStorage.getItem('gemini-chats')) || {};
let currentChatId = 'chat-' + Date.now();
let isInputCentered = false;

// Update device indicator based on screen size
function updateDeviceIndicator() {
  const width = window.innerWidth;

  let iconHTML = '';
  let text = '';

  if (width < 768) {
    iconHTML = '<i class="fas fa-mobile-screen"></i>';
    text = 'Mobile View';
    deviceIndicator.className = 'device-indicator mobile';
  } else if (width >= 768 && width < 1024) {
    iconHTML = '<i class="fas fa-tablet-alt"></i>';
    text = 'Tablet View';
    deviceIndicator.className = 'device-indicator tablet';
  } else {
    iconHTML = '<i class="fas fa-desktop"></i>';
    text = 'Desktop View';
    deviceIndicator.className = 'device-indicator desktop';
  }

  deviceIndicator.innerHTML = `${iconHTML} <span id="device-text">${text}</span>`;

  // Reset animation
  deviceIndicator.classList.remove('fade-out');
  void deviceIndicator.offsetWidth; // trigger reflow to restart animation
  deviceIndicator.classList.add('show');

  // Fade out and slide right after 5 seconds
  clearTimeout(deviceIndicator.hideTimeout);
  deviceIndicator.hideTimeout = setTimeout(() => {
    deviceIndicator.classList.remove('show');
    deviceIndicator.classList.add('fade-out');
  }, 3000);
}

// Call on load and resize
window.addEventListener('resize', updateDeviceIndicator);
updateDeviceIndicator();


// Call on load and resize
window.addEventListener('resize', updateDeviceIndicator);
updateDeviceIndicator();


// Initialize mobile sidebar
function initMobileSidebar() {
  menuBtn.addEventListener('click', () => {
    sidebar.classList.add('active');
    mobileOverlay.classList.add('active');
  });

  closeSidebar.addEventListener('click', () => {
    sidebar.classList.remove('active');
    mobileOverlay.classList.remove('active');
  });

  mobileOverlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    mobileOverlay.classList.remove('active');
  });
}

// Auto-resize textarea
messageInput.addEventListener('input', function () {
  this.style.height = 'auto';
  this.style.height = (this.scrollHeight) + 'px';
});

// Center input function
function centerInput() {
  inputContainer.classList.add('centered');
  overlay.classList.add('active');
  isInputCentered = true;
  messageInput.focus();
}

// Reset input position function
function resetInputPosition() {
  inputContainer.classList.remove('centered');
  overlay.classList.remove('active');
  isInputCentered = false;
}

// Send message function
async function sendMessage(messageText = null) {
  const message = messageText || messageInput.value.trim();
  if (!message) return;

  // Reset input position if it was centered
  if (isInputCentered) {
    resetInputPosition();
  }

  // Clear input and reset height if using message input
  if (!messageText) {
    messageInput.value = '';
    messageInput.style.height = 'auto';
  }

  // Hide welcome message if it's the first message
  if (welcomeMessage.style.display !== 'none') {
    welcomeMessage.style.display = 'none';
  }

  // Add user message to chat
  addMessageToChat(message, 'user');

  // Show typing indicator
  showTypingIndicator();

  try {
    // Call Gemini API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: message
          }]
        }]
      })
    });

    const data = await response.json();

    // Remove typing indicator
    removeTypingIndicator();

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const aiResponse = data.candidates[0].content.parts[0].text;
      addMessageToChat(aiResponse, 'ai');
    } else {
      throw new Error('Invalid response from Gemini API');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    removeTypingIndicator();
    addMessageToChat('Sorry, I encountered an error processing your request. Please try again.', 'ai');
  }

  // Save chat to localStorage
  saveChat();
}

// Add message to chat UI
function addMessageToChat(message, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`;

  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (sender === 'user') {
    messageDiv.innerHTML = `
  <div class="bg-white border border-gray-200 rounded-2xl rounded-se-none 
              px-3 py-2 sm:px-4 sm:py-3 max-w-[85%] xs:max-w-xs sm:max-w-md md:max-w-lg 
              shadow-sm hover:shadow-md transition-all duration-200 ml-auto inline-block">
      
     <div class="flex items-center gap-2">
      <div class="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
          <i class="fas fa-user text-blue-600 text-xs"></i>
      </div>
      <span class="font-semibold text-blue-600 text-[14px] sm:text-[16px]">You</span>
  </div>
          
          <div class="flex-1 min-w-0">
             

              <p class="text-gray-800 mt-1 text-[14px] sm:text-[16px] break-words">${escapeHtml(message)}</p>
              <span class="text-[10px] sm:text-xs text-gray-500 block mt-2 text-right">${timestamp}</span>
          </div>
      </div>
  </div>
`;





  } else {
    // Format AI response with proper code formatting
    const formattedMessage = formatAIResponse(message);

    messageDiv.innerHTML = `
<div class="message-card bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 max-w-md shadow-sm hover:shadow-md transition-shadow duration-200 max-w-3xl relative">

    
    <div class="flex items-center gap-2 mb-2">
      <div class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center shadow-sm">
          <img 
                    width="19" height="19" src="https://www.gstatic.com/lamda/images/gemini_sparkle_aurora_33f86dc0c0257da337c63.svg"
                        alt="">
      </div>
      <span class="font-semibold text-gray-800 text-[14px] sm:text-[16px]">Gemini AI</span>
    </div>

    <div class="text-gray-800 leading-relaxed mb-2 message-content text-[14px] sm:text-[16px] break-words">${formattedMessage.replace(/`/g, "\\`")}</div>

    <!-- Buttons below the message, aligned right -->
             <div class="flex items-center gap-2 button-group">
      <!-- Copy Button -->
<button
  class="action-btn copy-btn relative flex items-center gap-1.5 
         bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg 
         text-sm text-gray-700 transition-colors group"
  onclick="copyMessage(this)" 
>
  <i class="fas fa-copy text-xs"></i>
  <span>Copy</span>

  <!-- Tooltip -->
 <!-- <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 
               bg-black text-white text-xs px-2 py-1 rounded 
               opacity-0 group-hover:opacity-100 
               ">
    Copy
  </span>-->
</button>


      <button
  class="action-btn share-btn relative flex items-center gap-1.5 
         bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg 
         text-sm text-gray-700 transition-colors group"
  onclick="shareMessage(this)"
>
  <i class="fas fa-share-nodes text-xs"></i>
  <span>Share</span>

  <!-- Tooltip -->
  <!--
  <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 
               bg-black text-white text-xs px-2 py-1 rounded 
               opacity-0 group-hover:opacity-100 
               ">
    Share
  </span>-->
</button>


     <button
  class="action-btn download-btn relative flex items-center gap-1.5 
         bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg 
         text-sm text-gray-700 transition-colors group"
  onclick="downloadMessage(this)"
>
  <i class="fas fa-file-arrow-down text-xs"></i>
  <span>Download</span>

  <!-- Tooltip -->
  <!--
  <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 
               bg-black text-white text-xs px-2 py-1 rounded 
               opacity-0 group-hover:opacity-100 
               ">
    Download
  </span>-->
</button>

      </div>
       <span class="text-xs text-gray-500 block mt-2 text-right">${timestamp}</span>
  </div>
`;


  }

  // Make them global so inline onclick can find them
  window.copyMessage = function (button) {
    const container = button.closest('.message-card');
    if (!container) return;
    const messageContent = container.querySelector('.message-content').textContent;
    navigator.clipboard.writeText(messageContent).then(() => {
      const originalHtml = button.innerHTML;
      button.innerHTML = '<i class="fas fa-check text-xs"></i><span>Copied!</span>';
      button.classList.add('bg-blue-100');
      setTimeout(() => {
        button.innerHTML = originalHtml;
        button.classList.remove('bg-blue-100');
      }, 2000);
    });
  };

  window.shareMessage = function (button) {
    const container = button.closest('.message-card');
    if (!container) return;
    const messageContent = container.querySelector('.message-content').textContent;
    if (navigator.share) {
      navigator.share({ title: 'Message from Gemini AI', text: messageContent });
    } else {
      alert('Web Share API not supported. Message: ' + messageContent);
    }
  };

  window.downloadMessage = function (button) {
    const container = button.closest('.message-card');
    if (!container) return;
    const messageContent = container.querySelector('.message-content').textContent;
    const blob = new Blob([messageContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gemini-message.txt';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    const originalHtml = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check text-xs"></i><span>Downloaded!</span>';
    button.classList.add('bg-green-100');
    setTimeout(() => {
      button.innerHTML = originalHtml;
      button.classList.remove('bg-green-100');
    }, 2000);
  };

  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Add copy functionality to code blocks
  setTimeout(() => {
    document.querySelectorAll('.code-block').forEach(block => {
      if (!block.querySelector('.copy-btn')) {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-btn';
        copyButton.innerHTML = '<i class="fas fa-copy mr-1"></i> Copy';
        copyButton.addEventListener('click', () => {
          const code = block.querySelector('code') ? block.querySelector('code').textContent : block.textContent;
          navigator.clipboard.writeText(code).then(() => {
            copyButton.innerHTML = '<i class="fas fa-check mr-1"></i> Copied!';
            setTimeout(() => {
              copyButton.innerHTML = '<i class="fas fa-copy mr-1"></i> Copy';
            }, 2000);
          });
        });

        const header = document.createElement('div');
        header.className = 'code-header';

        // Detect language
        const language = detectProgrammingLanguage(block.textContent);
        header.innerHTML = `<span>${language}</span>`;
        header.appendChild(copyButton);

        block.insertBefore(header, block.firstChild);
      }
    });

    // Apply syntax highlighting
    if (typeof Prism !== 'undefined') {
      Prism.highlightAllUnder(chatMessages);
    }
  }, 100);

  // Add to current chat
  currentChat.push({ sender, message, timestamp: Date.now() });
}
// Detect programming language from code

function detectProgrammingLanguage(code) {
  if (code.includes('def ') && code.includes('import ')) return 'Python';
  if (code.includes('function ') && (code.includes('{') || code.includes('=>'))) return 'JavaScript';
  if (code.includes('public class') || code.includes('import java.')) return 'Java';
  if (code.includes('<?php') || code.includes('$')) return 'PHP';
  if (code.includes('using ') && code.includes('namespace ')) return 'C#';
  if (code.includes('#include') && (code.includes('int main') || code.includes('printf'))) return 'C/C++';
  if (code.includes('<!DOCTYPE html>') || code.includes('<div>') || code.includes('<span class="text-bold" >')) return 'HTML';
  if (code.includes('color:') || code.includes('margin:') || code.includes('padding:')) return 'CSS';
  if (code.includes('{') && code.includes('}') && code.includes('":')) return 'JSON';
  return 'Code';
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag]));
}

function formatAIResponse(text) {
  if (!text) return "";

  // highlight BEFORE handling code blocks
  let formattedText = highlightText(text);

  // Replace code blocks (```lang ... ```)
  const codeBlockRegex = /```(\w+)?\s*([\s\S]*?)```/g;
  formattedText = formattedText.replace(codeBlockRegex, (match, language, code) => {
    const langClass = language ? `language-${language}` : 'language-none';
    return `<div class="code-block"><code class="${langClass}">${escapeHtml(code.trim())}</code></div>`;
  });

  // ✅ Convert markdown bold (**text**) to <b>
  formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

  // ✅ Convert markdown italic (*text*) to <i>
  formattedText = formattedText.replace(/\*(.*?)\*/g, '<i>$1</i>');

  // ✅ Convert inline code `text` to <code>
  formattedText = formattedText.replace(/`([^`]+)`/g, '<code>$1</code>');

  // ✅ Convert markdown-style bullets (*) into list items
  formattedText = formattedText.replace(/\n\s*\* (.+)/g, '<li>$1</li>');
  formattedText = formattedText.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');

  return formattedText;
}


function highlightText(text) {
  if (!text) return text;

  // Dates (YYYY-MM-DD or MM/DD/YYYY)
  text = text.replace(/(\d{4}-\d{2}-\d{2})|(\d{1,2}\/\d{1,2}\/\d{4})/g,
    '<span class="highlight">$&</span>');

  // Numbers with commas
  text = text.replace(/(\d{1,3}(,\d{3})*(\.\d+)?)/g,
    '<span class="highlight">$&</span>');

  // Important terms
  const importantTerms = [
    'important', 'critical', 'urgent', 'note', 'warning',
    'remember', 'key point', 'essential', 'crucial', 'attention',
    'deadline', 'priority', 'significant', 'major', 'alert'
  ];

  importantTerms.forEach(term => {
    const regex = new RegExp(term, 'gi');
    text = text.replace(regex, '<span class="highlight">$&</span>');
  });

  return text;
}

// Escape HTML to prevent XSS
function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Show typing indicator
function showTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.id = 'typing-indicator';
  typingDiv.className = 'flex justify-start mb-4';

  typingDiv.innerHTML = `
        <div class="bg-white border rounded-2xl rounded-bl-none px-4 py-3 max-w-md shadow-sm">
          <div class="flex items-center gap-2 mb-2">
              <div class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center shadow-sm">
          <img 
                    width="19" height="19" src="https://www.gstatic.com/lamda/images/gemini_sparkle_aurora_33f86dc0c0257da337c63.svg"
                        alt="">
      </div>
            <span class="font-medium text-gray-700">Gemini AI</span>
          </div>
          <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
        </div>
      `;

  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
  const typingIndicator = document.getElementById('typing-indicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// Save chat to localStorage
function saveChat() {
  allChats[currentChatId] = {
    messages: currentChat,
    title: currentChat[0]?.message.substring(0, 30) + (currentChat[0]?.message.length > 30 ? '...' : ''),
    timestamp: Date.now()
  };
  localStorage.setItem('gemini-chats', JSON.stringify(allChats));
  updateChatHistoryUI();
}

// Clear current chat
function clearChat() {
  currentChat = [];
  chatMessages.innerHTML = '';
  welcomeMessage.style.display = 'flex';
  currentChatId = 'chat-' + Date.now();
  currentChatTitle.textContent = 'New Chat';

  // Center the input when starting a new chat
  centerInput();
}

// Load a specific chat
function loadChat(chatId) {
  if (allChats[chatId]) {
    currentChatId = chatId;
    currentChat = allChats[chatId].messages;
    currentChatTitle.textContent = allChats[chatId].title;

    // Clear chat messages and rebuild only if not already showing
    chatMessages.innerHTML = '';
    welcomeMessage.style.display = 'none';

    // Render all previous messages
    if (Array.isArray(currentChat)) {
      currentChat.forEach(msg => {
        addMessageToChat(msg.message, msg.sender);
      });
    }

    // Reset input position when loading a chat
    resetInputPosition();

    // Close sidebar after selecting a chat (both desktop and mobile)
    sidebar.classList.remove('active');
    mobileOverlay.classList.remove('active');
  }
}

// Delete a chat
let chatToDelete = null;

function deleteChat(chatId, event) {
  event.stopPropagation();
  chatToDelete = chatId;
  document.getElementById('deleteModal').classList.remove('hidden');
}

// Cancel button
document.getElementById('cancelBtn').addEventListener('click', () => {
  chatToDelete = null;
  document.getElementById('deleteModal').classList.add('hidden');
});

// Confirm Delete button
document.getElementById('confirmBtn').addEventListener('click', () => {
  if (chatToDelete !== null) {
    delete allChats[chatToDelete];
    localStorage.setItem('gemini-chats', JSON.stringify(allChats));

    if (chatToDelete === currentChatId) {
      clearChat();
    }

    updateChatHistoryUI();
    chatToDelete = null;
  }
  document.getElementById('deleteModal').classList.add('hidden');
});

// Update chat history UI
function updateChatHistoryUI() {
  // Clear existing lists
  todayChats.innerHTML = '';
  previousChats.innerHTML = '';

  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  // Sort chats by timestamp (newest first)
  const sortedChats = Object.entries(allChats).sort((a, b) => b[1].timestamp - a[1].timestamp);

  sortedChats.forEach(([chatId, chat]) => {
    const li = document.createElement('li');
    li.className = 'chat-history-item relative px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-lg';
    li.innerHTML = `
  <div class="flex justify-between items-center">
    <div class="flex items-center gap-2">
      <i class="fas fa-message text-gray-400" aria-hidden="true"></i>
      <span class="text-sm truncate">
        ${chat.title && chat.title.length > 10 ? chat.title.slice(0, 20) + '...' : chat.title || 'New Chat'}
      </span>
    </div>
    <button class="delete-chat p-1 text-gray-400 hover:text-red-500 rounded transition-colors duration-200" 
            data-chat-id="${chatId}"
            aria-label="Delete chat">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
      </svg>
    </button>
  </div>
`;

    // Add click event to load chat
    li.addEventListener('click', () => loadChat(chatId));

    // Add delete event
    const deleteBtn = li.querySelector('.delete-chat');
    deleteBtn.addEventListener('click', (e) => deleteChat(chatId, e));

    // Categorize by date
    if (now - chat.timestamp < oneDay) {
      todayChats.appendChild(li);
    } else if (now - chat.timestamp < 7 * oneDay) {
      previousChats.appendChild(li);
    }
  });
}

// Search chat history
function searchChatHistory(query) {
  if (!query) {
    searchResults.classList.add('hidden');
    return;
  }

  const results = [];
  Object.entries(allChats).forEach(([chatId, chat]) => {
    chat.messages.forEach(msg => {
      if (msg.message.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          chatId,
          chatTitle: chat.title,
          message: msg.message,
          timestamp: msg.timestamp
        });
      }
    });
  });

  // Display results
  searchResults.innerHTML = '';
  if (results.length > 0) {
    results.slice(0, 5).forEach(result => {
      const div = document.createElement('div');
      div.className = 'search-result-item';
      div.innerHTML = `
            <div class="font-medium">${result.chatTitle}</div>
            <div class="text-sm text-gray-500 truncate">${result.message.substring(0, 5)}...</div>
          `;
      div.addEventListener('click', () => {
        loadChat(result.chatId);
        searchResults.classList.add('hidden');
        historySearch.value = '';
      });
      searchResults.appendChild(div);
    });
    searchResults.classList.remove('hidden');
  } else {
    const div = document.createElement('div');
    div.className = 'search-result-item';
    div.textContent = 'No results found';
    searchResults.appendChild(div);
    searchResults.classList.remove('hidden');
  }

  // Reset input position when searching
  resetInputPosition();
}

// Event listeners
sendBtn.addEventListener('click', () => sendMessage());
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

clearChatBtn.addEventListener('click', clearChat);
newChatBtn.addEventListener('click', clearChat);

// Search functionality
historySearch.addEventListener('input', () => {
  searchChatHistory(historySearch.value);
});

historySearch.addEventListener('blur', () => {
  setTimeout(() => searchResults.classList.add('hidden'), 200);
});

// Close centered input when clicking on overlay
overlay.addEventListener('click', resetInputPosition);

// Window resize handler
window.addEventListener('resize', updateDeviceIndicator);

// Initialize
updateDeviceIndicator();
initMobileSidebar();
updateChatHistoryUI();
// Center input on initial load for better UX

centerInput();
