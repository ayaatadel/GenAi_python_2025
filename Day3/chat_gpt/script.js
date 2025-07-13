// Chat Application Class
class ChatApp {
  constructor() {
    this.chats = [];
    this.currentChatId = null;
    this.isTyping = false;
    this.initializeElements();
    this.bindEvents();
    this.loadFromLocalStorage();
    this.createNewChat();
  }
  initializeElements() {
    this.sidebar = document.getElementById("sidebar");
    this.sidebarToggle = document.getElementById("sidebarToggle");
    this.newChatBtn = document.getElementById("newChatBtn");
    this.clearHistoryBtn = document.getElementById("clearHistoryBtn");
    this.historyList = document.getElementById("historyList");
    this.chatMessages = document.getElementById("chatMessages");
    this.messageInput = document.getElementById("messageInput");
    this.sendBtn = document.getElementById("sendBtn");
    this.charCount = document.getElementById("charCount");
  }
  bindEvents() {
    this.sidebarToggle.addEventListener("click", () => {
      this.sidebar.classList.toggle("open");
    });
    document.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        if (
          !this.sidebar.contains(e.target) &&
          !this.sidebarToggle.contains(e.target)
        ) {
          this.sidebar.classList.remove("open");
        }
      }
    });
    this.newChatBtn.addEventListener("click", () => {
      this.createNewChat();
    });
    this.clearHistoryBtn.addEventListener("click", () => {
      this.clearHistory();
    });
    this.sendBtn.addEventListener("click", () => {
      this.sendMessage();
    });
    this.messageInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    this.messageInput.addEventListener("input", () => {
      this.autoResizeTextarea();
      this.updateCharCount();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        this.sidebar.classList.remove("open");
      }
    });
  }
  createNewChat() {
    const chatId = Date.now().toString();
    const newChat = {
      id: chatId,
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    };
    this.chats.unshift(newChat);
    this.currentChatId = chatId;
    this.updateHistoryList();
    this.displayChat(chatId);
    this.saveToLocalStorage();
  }
  displayChat(chatId) {
    const chat = this.chats.find((c) => c.id === chatId);
    if (!chat) return;
    this.currentChatId = chatId;
    this.chatMessages.innerHTML = "";
    if (chat.messages.length === 0) {
      this.addMessage(
        "ai",
        "Hello! I'm your AI assistant. How can I help you today?"
      );
    } else {
      chat.messages.forEach((message) => {
        this.addMessage(message.role, message.content, false);
      });
    }
    this.updateHistoryList();
    this.scrollToBottom();
  }
  addMessage(role, content, save = true) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${role}-message`;
    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    const icon = document.createElement("i");
    icon.className = role === "user" ? "fas fa-user" : "fas fa-robot";
    avatar.appendChild(icon);
    const messageContent = document.createElement("div");
    messageContent.className = "message-content";
    const paragraph = document.createElement("p");
    paragraph.textContent = content;
    messageContent.appendChild(paragraph);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    this.chatMessages.appendChild(messageDiv);
    if (save && this.currentChatId) {
      const chat = this.chats.find((c) => c.id === this.currentChatId);
      if (chat) {
        chat.messages.push({ role, content, timestamp: new Date() });
        if (role === "user" && chat.messages.length === 1) {
          chat.title =
            content.length > 30 ? content.substring(0, 30) + "..." : content;
          this.updateHistoryList();
        }
        this.saveToLocalStorage();
      }
    }
    this.scrollToBottom();
  }
  async sendMessage() {
    const message = this.messageInput.value.trim();
    if (!message || this.isTyping) return;
    this.addMessage("user", message);
    this.messageInput.value = "";
    this.autoResizeTextarea();
    this.updateCharCount();
    this.showTypingIndicator();
    try {
      const response = await this.callOpenAIAPI(message);
      this.hideTypingIndicator();
      this.addMessage("ai", response);
    } catch (error) {
      this.hideTypingIndicator();
      this.addMessage("ai", "Sorry, there was an error contacting the AI API.");
      console.error(error);
    }
  }
  showTypingIndicator() {
    this.isTyping = true;
    this.sendBtn.disabled = true;
    const typingDiv = document.createElement("div");
    typingDiv.className = "message ai-message typing-indicator";
    typingDiv.id = "typingIndicator";
    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    const icon = document.createElement("i");
    icon.className = "fas fa-robot";
    avatar.appendChild(icon);
    const content = document.createElement("div");
    content.className = "message-content";
    const dots = document.createElement("div");
    dots.className = "typing-indicator";
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement("div");
      dot.className = "typing-dot";
      dots.appendChild(dot);
    }
    content.appendChild(dots);
    typingDiv.appendChild(avatar);
    typingDiv.appendChild(content);
    this.chatMessages.appendChild(typingDiv);
    this.scrollToBottom();
  }
  hideTypingIndicator() {
    this.isTyping = false;
    this.sendBtn.disabled = false;
    const typingIndicator = document.getElementById("typingIndicator");
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
  generateAIResponse(userMessage) {
    const responses = [
      "That's an interesting question! Let me think about that...",
      "I understand what you're asking. Here's what I can tell you...",
      "Great question! Based on my knowledge, I would say...",
      "I appreciate you asking that. Let me provide some insights...",
      "That's a thoughtful inquiry. Here's my perspective...",
      "I'm glad you brought that up. Let me share some information...",
      "That's a complex topic. Let me break it down for you...",
      "Interesting point! Here's what I think about that...",
      "I see what you're getting at. Let me elaborate...",
      "That's a good question to explore. Here's what I know...",
    ];
    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];
    return randomResponse + " " + this.generateFollowUp(userMessage);
  }
  generateFollowUp(userMessage) {
    const followUps = [
      "Is there anything specific about this topic you'd like to know more about?",
      "Would you like me to elaborate on any particular aspect?",
      "Do you have any other questions related to this?",
      "Is there a specific angle you'd like me to focus on?",
      "Would you like to explore this topic further?",
    ];
    return followUps[Math.floor(Math.random() * followUps.length)];
  }
  updateHistoryList() {
    this.historyList.innerHTML = "";
    this.chats.forEach((chat) => {
      const historyItem = document.createElement("button");
      historyItem.className = "history-item";
      if (chat.id === this.currentChatId) {
        historyItem.classList.add("active");
      }
      const icon = document.createElement("i");
      icon.className = "fas fa-comment";
      const title = document.createElement("span");
      title.textContent = chat.title;
      title.style.overflow = "hidden";
      title.style.textOverflow = "ellipsis";
      title.style.whiteSpace = "nowrap";
      historyItem.appendChild(icon);
      historyItem.appendChild(title);
      historyItem.addEventListener("click", () => {
        this.displayChat(chat.id);
      });
      this.historyList.appendChild(historyItem);
    });
  }
  clearHistory() {
    if (
      confirm(
        "Are you sure you want to clear all chat history? This action cannot be undone."
      )
    ) {
      this.chats = [];
      this.currentChatId = null;
      this.chatMessages.innerHTML = "";
      this.historyList.innerHTML = "";
      this.createNewChat();
      this.saveToLocalStorage();
    }
  }
  autoResizeTextarea() {
    this.messageInput.style.height = "auto";
    this.messageInput.style.height =
      Math.min(this.messageInput.scrollHeight, 120) + "px";
  }
  updateCharCount() {
    const count = this.messageInput.value.length;
    this.charCount.textContent = `${count}/4000`;
    if (count > 3500) {
      this.charCount.style.color = "#ef4444";
    } else if (count > 3000) {
      this.charCount.style.color = "#f59e0b";
    } else {
      this.charCount.style.color = "#9ca3af";
    }
  }
  scrollToBottom() {
    setTimeout(() => {
      this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }, 100);
  }
  saveToLocalStorage() {
    try {
      localStorage.setItem(
        "chatApp_data",
        JSON.stringify({
          chats: this.chats,
          currentChatId: this.currentChatId,
        })
      );
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  }
  loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem("chatApp_data");
      if (saved) {
        const data = JSON.parse(saved);
        this.chats = data.chats || [];
        this.currentChatId = data.currentChatId;
        if (this.chats.length > 0) {
          this.displayChat(this.currentChatId || this.chats[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to load from localStorage:", error);
    }
  }

  async callOpenAIAPI(userMessage) {
    const API_KEY ="";
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const selectedModel = document.getElementById("modelSelect").value;
    const requestBody = {
      model: selectedModel,
      messages: [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content: userMessage },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    };
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const data = await response.json();
    return data.choices[0].message.content;
  }
}
document.addEventListener("DOMContentLoaded", () => {
  new ChatApp();
});
