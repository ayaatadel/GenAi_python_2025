// DALL-E 3 API constants
const API_KEY =""
const API_URL = "https://api.openai.com/v1/images/generations";

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
    this.modelSelect = document.getElementById("modelSelect");
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
        "Welcome! Enter a prompt and I’ll generate an image for you using DALL·E 3.",
        false
      );
    } else {
      chat.messages.forEach((message) => {
        this.addMessage(message.role, message.content, false, message.imageUrl);
      });
    }
    this.updateHistoryList();
    this.scrollToBottom();
  }
  addMessage(role, content, save = true, imageUrl = null) {
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
    if (imageUrl) {
      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = content;
      img.loading = "lazy";
      messageContent.appendChild(img);
    }
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    this.chatMessages.appendChild(messageDiv);
    if (save && this.currentChatId) {
      const chat = this.chats.find((c) => c.id === this.currentChatId);
      if (chat) {
        chat.messages.push({ role, content, timestamp: new Date(), imageUrl });
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
      const imageUrl = await this.callDalleAPI(message);
      this.hideTypingIndicator();
      this.addMessage("ai", "Here is your generated image:", true, imageUrl);
    } catch (error) {
      this.hideTypingIndicator();
      this.addMessage("ai", "Sorry, there was an error generating the image.");
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
  async callDalleAPI(prompt) {
    const requestBody = {
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      response_format: "url",
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
    return data.data[0].url;
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
}
document.addEventListener("DOMContentLoaded", () => {
  new ChatApp();
});
