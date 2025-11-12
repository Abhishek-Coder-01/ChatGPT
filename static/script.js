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
const clickableDiv = document.querySelector(".clickable");
const newChatToastContainer = document.getElementById("newChatToastContainer");
const clearBtn = document.getElementById("clear-chat-btn");
const toastContainer = document.getElementById("toast-container");
const confirmBtn = document.getElementById('confirmBtn');

// Frontend -> backend endpoint
const API_URL = '/chat';

// Speech Recognition
const micBtn = document.getElementById("mic-btn");
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = "en-US";

  let isListening = false;

  micBtn.addEventListener("click", () => {
    if (!isListening) {
      recognition.start();
      isListening = true;
      micBtn.classList.remove("text-gray-500", "hover:bg-gray-100");
      micBtn.classList.add("bg-red-500", "text-white");
    } else {
      recognition.stop();
      isListening = false;
      micBtn.classList.remove("bg-red-500", "text-white");
      micBtn.classList.add("text-gray-500", "hover:bg-gray-100");
    }
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    messageInput.value += transcript + " ";
    messageInput.dispatchEvent(new Event('input'));
  };

  recognition.onend = () => {
    isListening = false;
    micBtn.classList.remove("bg-red-500", "text-white");
    micBtn.classList.add("text-gray-500", "hover:bg-gray-100");
  };
} else {
}

// Send button state management
messageInput.addEventListener('input', function () {
  if (this.value.trim().length > 0) {
    sendBtn.classList.remove('bg-blue-200');
    sendBtn.classList.add('bg-blue-500');
  } else {
    sendBtn.classList.remove('bg-blue-500');
    sendBtn.classList.add('bg-blue-200');
  }
});

// Toast creation function
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

  setTimeout(() => {
    toast.classList.remove("opacity-0", "translate-y-[-20px]");
    toast.classList.add("opacity-100", "translate-y-0");
  }, 50);

  setTimeout(() => {
    toast.classList.remove("opacity-100", "translate-y-0");
    toast.classList.add("opacity-0", "translate-y-[-20px]");
  }, 3000);

  setTimeout(() => toast.remove(), 3500);
}

// New chat toast
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

  setTimeout(() => {
    toast.classList.remove("opacity-0", "translate-y-[-20px]");
    toast.classList.add("opacity-100", "translate-y-0");
  }, 50);

  setTimeout(() => {
    toast.classList.remove("opacity-100", "translate-y-0");
    toast.classList.add("opacity-0", "translate-y-[-20px]");
  }, 3000);

  setTimeout(() => toast.remove(), 3500);
}

//  Chat state with proper initialization
let currentChat = [];
let allChats = {};
let currentChatId = null;
let isInputCentered = false;

//  Initialize chat data from localStorage properly
function initializeChatData() {
  try {
    const savedChats = localStorage.getItem('gemini-chats');
    if (savedChats) {
      allChats = JSON.parse(savedChats);
    }
  } catch (error) {
    allChats = {};
  }

  // Create new chat ID
  currentChatId = 'chat-' + Date.now();

}


// Mobile sidebar initialization
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

//  Send message function with proper chat saving
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
    messageInput.dispatchEvent(new Event('input'));
  }

  // Hide welcome message if it's the first message
  if (welcomeMessage.style.display !== 'none') {
    welcomeMessage.style.display = 'none';
  }

  // Add user message to chat immediately
  const userTimestamp = Date.now();
  addMessageToChat(message, 'user');

  //  Add to currentChat array immediately
  currentChat.push({
    sender: 'user',
    message: message,
    timestamp: userTimestamp
  });

  // Show typing indicator
  showTypingIndicator();

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message })
    });

    let dataText = null;
    try {
      dataText = await response.text();
    } catch (e) {
    
    }

    let data = null;
    try {
      data = dataText ? JSON.parse(dataText) : null;
    } catch (e) {
      data = null;
    }

    removeTypingIndicator();

    if (!response.ok) {
    
      const errMsg = (data && data.error) ? data.error : `Server responded with status ${response.status}`;
      throw new Error(errMsg);
    }

    let aiResponse = '';
    if (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      aiResponse = data.choices[0].message.content;
    } else if (data && data.choices && data.choices[0] && data.choices[0].text) {
      aiResponse = data.choices[0].text;
    } else if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      aiResponse = data.candidates[0].content.parts[0].text || dataText;
    } else {
      aiResponse = dataText || 'Sorry, I got an unexpected response from the server.';
    }

    // Add AI response to chat with typing effect
    addMessageToChat(aiResponse, 'ai');

  } catch (error) {
   
    removeTypingIndicator();
    const errorMessage = 'Sorry, I encountered an error processing your request. Please try again.';
    addMessageToChat(errorMessage, 'ai');
  }
}

//  Add message to chat with proper saving
function addMessageToChat(message, sender, skipTyping = false) {
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

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

  } else {
    // AI message with typing effect
    const formattedMessage = formatAIResponse(message);

    messageDiv.innerHTML = `
<div class="message-card bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 max-w-md shadow-sm hover:shadow-md transition-shadow duration-200 max-w-3xl relative">
    
    <div class="flex items-center gap-2 mb-2">
      <div class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center shadow-sm">
          <img
            class="ai-avatar"
            width="19" height="19"
            src="https://www.gstatic.com/lamda/images/gemini_sparkle_aurora_33f86dc0c0257da337c63.svg"
            alt=""
            style="width:19px;height:19px;min-width:19px;min-height:19px;"
          />
      </div>
      <span class="font-semibold text-gray-700 text-[14px] sm:text-[16px]">ChatGPT</span>
    </div>

    <div class="text-gray-800 leading-relaxed mb-2 message-content text-[14px] sm:text-[16px] break-words"></div>

    <!-- Buttons below the message, aligned right -->
             <div class="flex items-center gap-[16px] button-group">
      <!-- Copy Button -->
<button
  class="copy-btn relative flex items-center gap-1.5 
         rounded-lg 
         text-sm text-gray-700 transition-colors group"
  onclick="copyMessage(this)" 
>
 <span>
   <svg 
    width="20" 
    height="20" 
    viewBox="0 0 20 20" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg">
    <path d="M12.668 10.667C12.668 9.95614 12.668 9.46258 12.6367 9.0791C12.6137 8.79732 12.5758 8.60761 12.5244 8.46387L12.4688 8.33399C12.3148 8.03193 12.0803 7.77885 11.793 7.60254L11.666 7.53125C11.508 7.45087 11.2963 7.39395 10.9209 7.36328C10.5374 7.33197 10.0439 7.33203 9.33301 7.33203H6.5C5.78896 7.33203 5.29563 7.33195 4.91211 7.36328C4.63016 7.38632 4.44065 7.42413 4.29688 7.47559L4.16699 7.53125C3.86488 7.68518 3.61186 7.9196 3.43555 8.20703L3.36524 8.33399C3.28478 8.49198 3.22795 8.70352 3.19727 9.0791C3.16595 9.46259 3.16504 9.95611 3.16504 10.667V13.5C3.16504 14.211 3.16593 14.7044 3.19727 15.0879C3.22797 15.4636 3.28473 15.675 3.36524 15.833L3.43555 15.959C3.61186 16.2466 3.86474 16.4807 4.16699 16.6348L4.29688 16.6914C4.44063 16.7428 4.63025 16.7797 4.91211 16.8027C5.29563 16.8341 5.78896 16.835 6.5 16.835H9.33301C10.0439 16.835 10.5374 16.8341 10.9209 16.8027C11.2965 16.772 11.508 16.7152 11.666 16.6348L11.793 16.5645C12.0804 16.3881 12.3148 16.1351 12.4688 15.833L12.5244 15.7031C12.5759 15.5594 12.6137 15.3698 12.6367 15.0879C12.6681 14.7044 12.668 14.211 12.668 13.5V10.667ZM13.998 12.665C14.4528 12.6634 14.8011 12.6602 15.0879 12.6367C15.4635 12.606 15.675 12.5492 15.833 12.4688L15.959 12.3975C16.2466 12.2211 16.4808 11.9682 16.6348 11.666L16.6914 11.5361C16.7428 11.3924 16.7797 11.2026 16.8027 10.9209C16.8341 10.5374 16.835 10.0439 16.835 9.33301V6.5C16.835 5.78896 16.8341 5.29563 16.8027 4.91211C16.7797 4.63025 16.7428 4.44063 16.6914 4.29688L16.6348 4.16699C16.4807 3.86474 16.2466 3.61186 15.959 3.43555L15.833 3.36524C15.675 3.28473 15.4636 3.22797 15.0879 3.19727C14.7044 3.16593 14.211 3.16504 13.5 3.16504H10.667C9.9561 3.16504 9.46259 3.16595 9.0791 3.19727C8.79739 3.22028 8.6076 3.2572 8.46387 3.30859L8.33399 3.36524C8.03176 3.51923 7.77886 3.75343 7.60254 4.04102L7.53125 4.16699C7.4508 4.32498 7.39397 4.53655 7.36328 4.91211C7.33985 5.19893 7.33562 5.54719 7.33399 6.00195H9.33301C10.022 6.00195 10.5791 6.00131 11.0293 6.03809C11.4873 6.07551 11.8937 6.15471 12.2705 6.34668L12.4883 6.46875C12.984 6.7728 13.3878 7.20854 13.6533 7.72949L13.7197 7.87207C13.8642 8.20859 13.9292 8.56974 13.9619 8.9707C13.9987 9.42092 13.998 9.97799 13.998 10.667V12.665ZM18.165 9.33301C18.165 10.022 18.1657 10.5791 18.1289 11.0293C18.0961 11.4302 18.0311 11.7914 17.8867 12.1279L17.8203 12.2705C17.5549 12.7914 17.1509 13.2272 16.6553 13.5313L16.4365 13.6533C16.0599 13.8452 15.6541 13.9245 15.1963 13.9619C14.8593 13.9895 14.4624 13.9935 13.9951 13.9951C13.9935 14.4624 13.9895 14.8593 13.9619 15.1963C13.9292 15.597 13.864 15.9576 13.7197 16.2939L13.6533 16.4365C13.3878 16.9576 12.9841 17.3941 12.4883 17.6982L12.2705 17.8203C11.8937 18.0123 11.4873 18.0915 11.0293 18.1289C10.5791 18.1657 10.022 18.165 9.33301 18.165H6.5C5.81091 18.165 5.25395 18.1657 4.80371 18.1289C4.40306 18.0962 4.04235 18.031 3.70606 17.8867L3.56348 17.8203C3.04244 17.5548 2.60585 17.151 2.30176 16.6553L2.17969 16.4365C1.98788 16.0599 1.90851 15.6541 1.87109 15.1963C1.83431 14.746 1.83496 14.1891 1.83496 13.5V10.667C1.83496 9.978 1.83432 9.42091 1.87109 8.9707C1.90851 8.5127 1.98772 8.10625 2.17969 7.72949L2.30176 7.51172C2.60586 7.0159 3.04236 6.6122 3.56348 6.34668L3.70606 6.28027C4.04237 6.136 4.40303 6.07083 4.80371 6.03809C5.14051 6.01057 5.53708 6.00551 6.00391 6.00391C6.00551 5.53708 6.01057 5.14051 6.03809 4.80371C6.0755 4.34588 6.15483 3.94012 6.34668 3.56348L6.46875 3.34473C6.77282 2.84912 7.20856 2.44514 7.72949 2.17969L7.87207 2.11328C8.20855 1.96886 8.56979 1.90385 8.9707 1.87109C9.42091 1.83432 9.978 1.83496 10.667 1.83496H13.5C14.1891 1.83496 14.746 1.83431 15.1963 1.87109C15.6541 1.90851 16.0599 1.98788 16.4365 2.17969L16.6553 2.30176C17.151 2.60585 17.5548 3.04244 17.8203 3.56348L17.8867 3.70606C18.031 4.04235 18.0962 4.40306 18.1289 4.80371C18.1657 5.25395 18.165 5.81091 18.165 6.5V9.33301Z"></path>
  </svg>
 </span>

  <!-- Tooltip -->
 <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 
               bg-black text-white text-xs px-2 py-1 rounded 
               opacity-0 group-hover:opacity-100 
               ">
    Copy
  </span>
</button>

      <button
  class="share-btn relative flex items-center gap-1.5 
           rounded-lg 
         text-sm text-gray-700 transition-colors group"
  onclick="shareMessage(this)"
>
  <span>
  <svg 
      width="20" 
      height="20" 
      viewBox="0 0 20 20" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg" 
      class="-ms-0.5 icon">
    <path d="M2.66821 12.6663V12.5003C2.66821 12.1331 2.96598 11.8353 3.33325 11.8353C3.70052 11.8353 3.99829 12.1331 3.99829 12.5003V12.6663C3.99829 13.3772 3.9992 13.8707 4.03052 14.2542C4.0612 14.6298 4.11803 14.8413 4.19849 14.9993L4.2688 15.1263C4.44511 15.4137 4.69813 15.6481 5.00024 15.8021L5.13013 15.8577C5.2739 15.9092 5.46341 15.947 5.74536 15.97C6.12888 16.0014 6.62221 16.0013 7.33325 16.0013H12.6663C13.3771 16.0013 13.8707 16.0014 14.2542 15.97C14.6295 15.9394 14.8413 15.8825 14.9993 15.8021L15.1262 15.7308C15.4136 15.5545 15.6481 15.3014 15.802 14.9993L15.8577 14.8695C15.9091 14.7257 15.9469 14.536 15.97 14.2542C16.0013 13.8707 16.0012 13.3772 16.0012 12.6663V12.5003C16.0012 12.1332 16.2991 11.8355 16.6663 11.8353C17.0335 11.8353 17.3313 12.1331 17.3313 12.5003V12.6663C17.3313 13.3553 17.3319 13.9124 17.2952 14.3626C17.2624 14.7636 17.1974 15.1247 17.053 15.4613L16.9866 15.6038C16.7211 16.1248 16.3172 16.5605 15.8215 16.8646L15.6038 16.9866C15.227 17.1786 14.8206 17.2578 14.3625 17.2952C13.9123 17.332 13.3553 17.3314 12.6663 17.3314H7.33325C6.64416 17.3314 6.0872 17.332 5.63696 17.2952C5.23642 17.2625 4.87552 17.1982 4.53931 17.054L4.39673 16.9866C3.87561 16.7211 3.43911 16.3174 3.13501 15.8216L3.01294 15.6038C2.82097 15.2271 2.74177 14.8206 2.70435 14.3626C2.66758 13.9124 2.66821 13.3553 2.66821 12.6663ZM9.33521 12.5003V4.9388L7.13696 7.13704C6.87732 7.39668 6.45625 7.39657 6.19653 7.13704C5.93684 6.87734 5.93684 6.45631 6.19653 6.19661L9.52954 2.86263L9.6311 2.77962C9.73949 2.70742 9.86809 2.66829 10.0002 2.66829C10.1763 2.66838 10.3454 2.73819 10.47 2.86263L13.804 6.19661C14.0633 6.45628 14.0634 6.87744 13.804 7.13704C13.5443 7.39674 13.1222 7.39674 12.8625 7.13704L10.6653 4.93977V12.5003C10.6651 12.8673 10.3673 13.1652 10.0002 13.1654C9.63308 13.1654 9.33538 12.8674 9.33521 12.5003Z"></path>
  </svg>
  </span>

  <!-- Tooltip -->
  <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 
               bg-black text-white text-xs px-2 py-1 rounded 
               opacity-0 group-hover:opacity-100 
               ">
    Share
  </span>
</button>

     <button
  class="download-btn relative flex items-center gap-1.5 
          rounded-lg 
         text-sm text-gray-700 transition-colors group"
  onclick="downloadMessage(this)"
>
  <span> 
    <svg 
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg">
    <path d="M15.3694 11.4111L15.1234 12.8866C14.8869 14.3043 13.6602 15.3436 12.223 15.3437H3.77667C2.33951 15.3435 1.11273 14.3042 0.876282 12.8866L0.630188 11.4111L2.05402 11.1747L2.29913 12.6493C2.41966 13.3713 3.04469 13.9001 3.77667 13.9003H12.223C12.9551 13.9003 13.5799 13.3714 13.7005 12.6493L13.9456 11.1747L15.3694 11.4111ZM8.72198 8.99406C8.77711 8.9394 8.83786 8.88112 8.90265 8.81633L12.4827 5.2343L13.5042 6.25578L9.92218 9.83586C9.63943 10.1186 9.38757 10.3732 9.15851 10.5575C8.91886 10.7503 8.63947 10.9225 8.28644 10.9784C8.09704 11.0084 7.90357 11.0084 7.71417 10.9784C7.36099 10.9225 7.08084 10.7504 6.84113 10.5575C6.61209 10.3732 6.36016 10.1186 6.07745 9.83586L2.4964 6.25578L3.51691 5.2343L7.09698 8.81633C7.16213 8.88148 7.22324 8.94012 7.27863 8.99504V1.30656H8.72198V8.99406Z" fill="currentColor"></path>
    </svg>
  </span>

  <!-- Tooltip -->
  <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 
               bg-black text-white text-xs px-2 py-1 rounded 
               opacity-0 group-hover:opacity-100 
               ">
    Download
  </span>
</button>

<button
  class=" sound-btn relative flex items-center gap-1.5 
           rounded-lg 
         text-sm text-gray-700 transition-colors group"
  onclick="sound(this)"
>
<svg class="w-[23px] h-[23px] text-[#374151]" 
     aria-hidden="true" xmlns="http://www.w3.org/2000/svg" 
     fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
        d="M15.5 8.43A4.985 4.985 0 0 1 17 12a4.984 4.984 0 0 1-1.43 3.5m2.794 2.864A8.972 8.972 0 0 0 21 12a8.972 8.972 0 0 0-2.636-6.364M12 6.135v11.73a1 1 0 0 1-1.64.768L6 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2l4.36-3.633a1 1 0 0 1 1.64.768Z"/>
</svg>

  <!-- Tooltip (optional) -->
  <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 
               bg-black text-white text-xs px-2 py-1 rounded 
               opacity-0 group-hover:opacity-100">
    Sound
  </span>
</button>

      </div>
       <span class="text-xs text-gray-500 block mt-2 text-right">${timestamp}</span>
  </div>
`;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Apply typing effect to AI response (unless skipped for history loading)
    if (!skipTyping) {
      startTypingEffect(messageDiv, formattedMessage, message, sender, timestamp);
    } else {
      const contentDiv = messageDiv.querySelector('.message-content');
      contentDiv.innerHTML = formattedMessage.replace(/`/g, "\\`");
      setupMessageInteractions(messageDiv);
      currentChat.push({ sender, message, timestamp: Date.now() });
    }
  }

  // Add copy functionality to code blocks
  setTimeout(() => {
    document.querySelectorAll('.code-block').forEach(block => {
      if (!block.querySelector('.copy-btn-code')) {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-btn-code';
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

        const language = detectProgrammingLanguage(block.textContent);
        header.innerHTML = `<span>${language}</span>`;
        header.appendChild(copyButton);

        block.insertBefore(header, block.firstChild);
      }
    });

    if (typeof Prism !== 'undefined') {
      Prism.highlightAllUnder(chatMessages);
    }
  }, 100);
}

//  Typing effect function with proper chat saving
function startTypingEffect(messageDiv, formattedMessage, originalMessage, sender, timestamp) {
  const contentDiv = messageDiv.querySelector('.message-content');
  const plainText = originalMessage;

  let index = 0;
  const typingSpeed = 10;

  function typeNextCharacter() {
    if (index < plainText.length) {
      const currentText = plainText.substring(0, index + 1);
      contentDiv.textContent = currentText;
      index++;
      setTimeout(typeNextCharacter, typingSpeed);
    } else {
      // Typing complete - show formatted version
      contentDiv.innerHTML = formattedMessage.replace(/`/g, "\\`");
      setupMessageInteractions(messageDiv);

      //  Add to chat history after typing is complete
      const aiTimestamp = Date.now();
      currentChat.push({
        sender,
        message: originalMessage,
        timestamp: aiTimestamp
      });

      // Save chat after AI response is complete
      saveChat();
     
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  typeNextCharacter();
}

// Setup message interaction buttons
function setupMessageInteractions(messageDiv) {
  window.copyMessage = function (button) {
    const container = button.closest('.message-card');
    if (!container) return;
    const messageContent = container.querySelector('.message-content').textContent;
    navigator.clipboard.writeText(messageContent).then(() => {
      const originalHtml = button.innerHTML;
      button.innerHTML = '<i class="fas fa-check text-xs text-[#3b82f6]"></i><span class="text-[#3b82f6]">Copied!</span>';
      setTimeout(() => {
        button.innerHTML = originalHtml;
      }, 2000);
    });
  };

  window.shareMessage = function (button) {
    const container = button.closest('.message-card');
    if (!container) return;
    const messageContent = container.querySelector('.message-content').textContent;
    if (navigator.share) {
      navigator.share({ title: 'Message from ChatGPT', text: messageContent });
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
    button.innerHTML = '<i class="fas fa-check text-xs text-[#f59e0b]"></i><span class="text-[#f59e0b]">Downloaded!</span>';
    setTimeout(() => {
      button.innerHTML = originalHtml;
    }, 2000);
  };
}

// Sound functionality
(function () {
  const PAUSE_ICON = `
    <svg xmlns="http://www.w3.org/2000/svg" class="w-[17px] h-[17px]" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="25" fill="black" />
        <rect x="15" y="12" width="6" height="26" fill="white" rx="1"/>
        <rect x="29" y="12" width="6" height="26" fill="white" rx="1"/>
    </svg>
`;


function resetButton(button) {
  if (!button) return;
  if (button.dataset.originalIcon) {
    button.innerHTML = button.dataset.originalIcon;
    delete button.dataset.originalIcon;
  }
  button.classList.remove('playing');
  button.setAttribute('aria-pressed', 'false');
}

window.sound = function (button) {
  try {
    const container = button.closest('.message-card');
    if (!container) return;
    const messageEl = container.querySelector('.message-content');
    if (!messageEl) return;
    const text = messageEl.textContent.trim();
    if (!text) return;

    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech not supported in this browser.');
      return;
    }

    // Stop current speech if same button clicked again
    if (window.currentUtterance && window.currentUtterance._originButton === button && speechSynthesis.speaking) {
      speechSynthesis.cancel();
      resetButton(button);
      window.currentUtterance = null;
      window.currentSpeakButton = null;
      return;
    }

    // Stop ongoing speech if another button clicked
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      if (window.currentSpeakButton && window.currentSpeakButton !== button) {
        resetButton(window.currentSpeakButton);
      }
      window.currentUtterance = null;
      window.currentSpeakButton = null;
    }

    const utterance = new SpeechSynthesisUtterance(text);

    // 🔍 Detect Hindi automatically using Unicode range
    const isHindi = /[\u0900-\u097F]/.test(text);

    utterance.lang = isHindi ? 'hi-IN' : 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    // 🗣 Try to set matching voice
    const voices = speechSynthesis.getVoices();
    let voice = voices.find(v => v.lang === utterance.lang);

    // 🛠 Fallback: if Hindi voice not found, use English
    if (!voice && isHindi) {
      voice = voices.find(v => v.lang.startsWith('en')) || voices[0];
    }

    utterance.voice = voice || voices[0];
    utterance._originButton = button;

    if (!button.dataset.originalIcon) {
      button.dataset.originalIcon = button.innerHTML;
    }
    button.innerHTML = PAUSE_ICON;

    button.classList.add('playing');
    button.setAttribute('aria-pressed', 'true');

    window.currentUtterance = utterance;
    window.currentSpeakButton = button;

    utterance.onend = utterance.onerror = function () {
      resetButton(button);
      if (window.currentUtterance === utterance) {
        window.currentUtterance = null;
        window.currentSpeakButton = null;
      }
    };

    // 🔄 Some browsers load voices asynchronously
    if (voices.length === 0) {
      speechSynthesis.onvoiceschanged = () => speechSynthesis.speak(utterance);
    } else {
      speechSynthesis.speak(utterance);
    }

  } catch (err) {
    
  }
};


  window.stopAllSpeech = function () {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    if (window.currentSpeakButton) resetButton(window.currentSpeakButton);
    window.currentUtterance = null;
    window.currentSpeakButton = null;
  };

  window.addEventListener('beforeunload', () => {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  });
})();

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

  let formattedText = highlightText(text);

  const codeBlockRegex = /```(\w+)?\s*([\s\S]*?)```/g;
  formattedText = formattedText.replace(codeBlockRegex, (match, language, code) => {
    const langClass = language ? `language-${language}` : 'language-none';
    return `<div class="code-block"><code class="${langClass}">${escapeHtml(code.trim())}</code></div>`;
  });

  formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  formattedText = formattedText.replace(/\*(.*?)\*/g, '<i>$1</i>');
  formattedText = formattedText.replace(/`([^`]+)`/g, '<code>$1</code>');
  formattedText = formattedText.replace(/\n\s*\* (.+)/g, '<li>$1</li>');
  formattedText = formattedText.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');

  return formattedText;
}

function highlightText(text) {
  if (!text) return text;

  text = text.replace(/(\d{4}-\d{2}-\d{2})|(\d{1,2}\/\d{1,2}\/\d{4})/g,
    '<span class="highlight">$&</span>');

  text = text.replace(/(\d{1,3}(,\d{3})*(\.\d+)?)/g,
    '<span class="highlight">$&</span>');

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

// Show typing indicator
function showTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.id = 'typing-indicator';
  typingDiv.className = 'flex justify-start mb-4';

  typingDiv.innerHTML = `
  <div class="bg-white border rounded-2xl rounded-bl-none px-4 py-3 max-w-md shadow-sm">
    <div class="flex items-center gap-2 mb-2">
      
      <div class="relative flex items-center justify-center w-6 h-6">
        <div class="absolute w-6 h-6 rounded-full animate-spin">
          <div class="w-6 h-6 rounded-full border-2 
                      border-t-blue-500 border-r-red-500 
                      border-b-green-500 border-l-yellow-500">
          </div>
        </div>

        <div class="w-6 h-6 rounded-full flex items-center justify-center shadow-sm relative z-10">
          <img
            class="ai-avatar"
            src="https://www.gstatic.com/lamda/images/gemini_sparkle_aurora_33f86dc0c0257da337c63.svg"
            alt="Logo"
            style="width:19px;height:19px;min-width:19px;min-height:19px;"
          />
        </div>
      </div>

      <span class="font-semibold text-gray-700 text-[14px] sm:text-[16px]">ChatGPT</span>
    </div>

    <div class="typing-indicator flex">
      <div class="typing-dot w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
      <div class="typing-dot w-2 h-2 bg-red-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
      <div class="typing-dot w-2 h-2 bg-yellow-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
    </div>
  </div>
`;

  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
  const typingIndicator = document.getElementById('typing-indicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

//  Save chat function with better error handling
function saveChat() {
  try {
    if (!currentChatId) {
     
      return;
    }

    if (currentChat.length === 0) {
      
      return;
    }

    // Create chat title from first user message
    const firstUserMessage = currentChat.find(msg => msg.sender === 'user');
    const title = firstUserMessage
      ? (firstUserMessage.message.substring(0, 30) + (firstUserMessage.message.length > 30 ? '...' : ''))
      : 'New Chat';

    // Save chat with all messages
    allChats[currentChatId] = {
      messages: [...currentChat], // Create a copy of the array
      title: title,
      timestamp: Date.now()
    };

    // Save to localStorage
    localStorage.setItem('gemini-chats', JSON.stringify(allChats));

    // Update UI
    updateChatHistoryUI();

    // Update current chat title
    if (currentChatTitle) {
      currentChatTitle.textContent = title;
    }

  } catch (error) {

  }
}

//  Clear chat function
function clearChat() {


  // Stop any ongoing speech
  if (window.stopAllSpeech) {
    window.stopAllSpeech();
  }

  // Clear current chat data
  currentChat = [];
  currentChatId = 'chat-' + Date.now();

  // Clear UI
  chatMessages.innerHTML = '';
  welcomeMessage.style.display = 'flex';

  // Update title
  if (currentChatTitle) {
    currentChatTitle.textContent = 'New Chat';
  }

  // Center the input when starting a new chat
  centerInput();

}

//  Load chat function
function loadChat(chatId) {

  if (!allChats[chatId]) {
  
    return;
  }

  // Stop any ongoing speech
  if (window.stopAllSpeech) {
    window.stopAllSpeech();
  }

  // Set current chat
  currentChatId = chatId;
  currentChat = [...allChats[chatId].messages]; // Create a copy

  // Update title
  if (currentChatTitle) {
    currentChatTitle.textContent = allChats[chatId].title;
  }

  // Clear UI and rebuild
  chatMessages.innerHTML = '';
  welcomeMessage.style.display = 'none';

  // Render all messages WITHOUT typing effect
  if (Array.isArray(currentChat)) {
    currentChat.forEach(msg => {
      addMessageToChat(msg.message, msg.sender, true); // skipTyping = true
    });
  }

  // Reset input position
  resetInputPosition();

  // Close sidebar
  sidebar.classList.remove('active');
  mobileOverlay.classList.remove('active');

}

// Delete chat functions
let chatToDelete = null;

function deleteChat(chatId, event) {
  event.stopPropagation();
  chatToDelete = chatId;
  document.getElementById('deleteModal').classList.remove('hidden');
}

document.getElementById('cancelBtn').addEventListener('click', () => {
  chatToDelete = null;
  document.getElementById('deleteModal').classList.add('hidden');
});

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

//  Update chat history UI
function updateChatHistoryUI() {
  todayChats.innerHTML = '';
  previousChats.innerHTML = '';

  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  const sortedChats = Object.entries(allChats).sort((a, b) => b[1].timestamp - a[1].timestamp);

  sortedChats.forEach(([chatId, chat]) => {
    const li = document.createElement('li');
    li.className = 'chat-history-item relative px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-lg';

    // Ensure we have a title
    const title = chat.title || 'New Chat';
    const displayTitle = title.length > 20 ? title.slice(0, 20) + '...' : title;

    li.innerHTML = `
  <div class="flex justify-between items-center">
    <div class="flex items-center gap-2">
      <i class="fas fa-message text-gray-400" aria-hidden="true"></i>
      <span class="text-sm truncate">${displayTitle}</span>
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

    li.addEventListener('click', () => loadChat(chatId));

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
    if (chat.messages && Array.isArray(chat.messages)) {
      chat.messages.forEach(msg => {
        if (msg.message && msg.message.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            chatId,
            chatTitle: chat.title || 'New Chat',
            message: msg.message,
            timestamp: msg.timestamp
          });
        }
      });
    }
  });

  searchResults.innerHTML = '';
  if (results.length > 0) {
    results.slice(0, 5).forEach(result => {
      const div = document.createElement('div');
      div.className = 'search-result-item';
      div.innerHTML = `
            <div class="font-medium">${result.chatTitle}</div>
            <div class="text-sm text-gray-500 truncate">${result.message.substring(0, 50)}...</div>
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

  resetInputPosition();
}

// Event listeners send button to enter key
sendBtn.addEventListener('click', () => sendMessage());
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Delete chat button entry key

function handleDelete() {

}

// Click event
confirmBtn.addEventListener('click', handleDelete);

// Enter key listener for Delete button
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    // Optional: agar Delete button visible ho
    if (confirmBtn.offsetParent !== null) {
      e.preventDefault(); // prevent other actions
      confirmBtn.click();
    }
  }
});

// end


clearChatBtn.addEventListener('click', () => {
  clearChat();
  createToast("Chat cleared successfully!");
});

newChatBtn.addEventListener('click', () => {
  clearChat();
  createNewChatToast("New chat added!");
});

// Search functionality
historySearch.addEventListener('input', () => {
  searchChatHistory(historySearch.value);
});

historySearch.addEventListener('blur', () => {
  setTimeout(() => searchResults.classList.add('hidden'), 200);
});

// Close centered input when clicking on overlay
overlay.addEventListener('click', resetInputPosition);


//  Initialize everything properly
document.addEventListener('DOMContentLoaded', () => {

  // Initialize chat data
  initializeChatData();

  // Initialize other components
  initMobileSidebar();
  updateChatHistoryUI();

  // Center input on initial load
  centerInput();

});

//  Initialize even if DOMContentLoaded already fired
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeChatData();
    initMobileSidebar();
    updateChatHistoryUI();
    centerInput();
  });
} else {
  // DOM is already ready
  initializeChatData();
  initMobileSidebar();
  updateChatHistoryUI();
  centerInput();
}
