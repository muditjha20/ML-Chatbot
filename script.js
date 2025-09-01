document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const chatContainer = document.getElementById('chatContainer');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const topKSelect = document.getElementById('topK');
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    const clearChatButton = document.getElementById('clearChat');
    
    // App state
    const backendUrl = 'https://pdfquery-hm07.onrender.com'; // Fixed as requested
    let topK = 4;
    let chatHistory = [];
    
    // Initialize from localStorage
    function initFromStorage() {
        const savedTopK = localStorage.getItem('topK');
        if (savedTopK) {
            topK = parseInt(savedTopK);
            topKSelect.value = savedTopK;
        }
        
        // Load chat history if needed
        const savedChat = localStorage.getItem('chatHistory');
        if (savedChat) {
            chatHistory = JSON.parse(savedChat);
            renderChatHistory();
        }
    }
    
    // Save settings to localStorage
    function saveToStorage() {
        localStorage.setItem('topK', topK.toString());
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }
    
    // Check backend health
    async function checkHealth() {
        try {
            const response = await fetch(`${backendUrl}/health`, {
                method: 'GET'
            });
            
            const data = await response.json();
            
            if (data.status === 'ok') {
                statusIndicator.style.backgroundColor = '#4ade80';
                statusText.textContent = 'Backend connected';
            } else {
                throw new Error('Health check failed');
            }
        } catch (error) {
            statusIndicator.style.backgroundColor = '#f87171';
            statusText.textContent = 'Backend unavailable';
            statusIndicator.classList.add('error');
        }
    }
    
    // Render chat history
    function renderChatHistory() {
        chatContainer.innerHTML = '';
        
        if (chatHistory.length === 0) {
            // Show welcome message if no history
            chatContainer.innerHTML = `
                <div class="welcome-message">
                    <div class="welcome-icon">
                        <i class="fas fa-robot"></i>
                    </div>
                    <h3>ML RAG Assistant</h3>
                    <p>Ask questions about machine learning topics, and I'll search through documentation to provide answers with sources.</p>
                    <p>Try asking about "LDA vs logistic regression" or "bias-variance tradeoff".</p>
                </div>
            `;
            return;
        }
        
        chatHistory.forEach((message, index) => {
            if (message.role === 'user') {
                addMessageToChat(message.content, 'user', index);
            } else {
                addMessageToChat(
                    message.content, 
                    'assistant', 
                    index, 
                    message.sources, 
                    false,
                    message.model
                );
            }
        });
        
        scrollToBottom();
    }
    
    // Add message to chat
    function addMessageToChat(message, role, id, sources = [], showSources = false, model = 'gpt-4.1-nano') {
        const messageEl = document.createElement('div');
        messageEl.classList.add('message', `${role}-message`);
        messageEl.dataset.id = id;
        
        const sender = role === 'user' ? 'You' : 'Assistant';
        const icon = role === 'user' ? 'fas fa-user' : 'fas fa-robot';
        
        let sourcesHtml = '';
        if (sources && sources.length > 0) {
            const sourcesList = sources.map(source => `
                <div class="source-item">
                    <div class="source-meta">
                        <span>${source.source_pdf || 'Unknown PDF'} ${source.page ? `(p. ${source.page})` : ''}</span>
                        <span class="source-score">
                            <i class="fas fa-star"></i>
                            ${source.score ? source.score.toFixed(3) : 'N/A'}
                        </span>
                    </div>
                    <div class="source-snippet">${truncateText(source.snippet || '', 220)}</div>
                </div>
            `).join('');
            
            sourcesHtml = `
                <div class="sources-toggle" data-id="${id}">
                    <i class="fas fa-file-alt"></i>
                    <span>Show sources</span>
                    <span class="sources-count">${sources.length}</span>
                </div>
                <div class="sources-container ${showSources ? 'visible' : ''}">
                    ${sourcesList}
                </div>
            `;
        }
        
        messageEl.innerHTML = `
            <div class="message-header">
                <span class="message-sender">
                    <i class="${icon}"></i>
                    ${sender}
                </span>
                <div class="message-actions">
                    ${role === 'assistant' ? `
                        <button class="message-action copy-button" data-content="${escapeHtml(message)}">
                            <i class="fas fa-copy"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
            <div class="message-content">${formatMessage(message)}</div>
            ${role === 'assistant' ? `
                <div class="model-chip">
                    <i class="fas fa-microchip"></i>
                    Model: ${model}
                </div>
            ` : ''}
            ${sourcesHtml}
        `;
        
        chatContainer.appendChild(messageEl);
        
        // Add event listeners for interactive elements
        if (sources && sources.length > 0) {
            const toggle = messageEl.querySelector('.sources-toggle');
            toggle.addEventListener('click', () => {
                const sourcesContainer = messageEl.querySelector('.sources-container');
                sourcesContainer.classList.toggle('visible');
                
                if (sourcesContainer.classList.contains('visible')) {
                    toggle.innerHTML = `
                        <i class="fas fa-file-alt"></i>
                        <span>Hide sources</span>
                        ${toggle.querySelector('.sources-count').outerHTML}
                    `;
                } else {
                    toggle.innerHTML = `
                        <i class="fas fa-file-alt"></i>
                        <span>Show sources</span>
                        ${toggle.querySelector('.sources-count').outerHTML}
                    `;
                }
            });
        }
        
        if (role === 'assistant') {
            const copyButton = messageEl.querySelector('.copy-button');
            copyButton.addEventListener('click', () => {
                const content = copyButton.dataset.content;
                navigator.clipboard.writeText(content).then(() => {
                    copyButton.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                    }, 2000);
                });
            });
        }
    }
    
    // Format message with line breaks
    function formatMessage(text) {
        if (!text) return '<em>No answer provided</em>';
        return text.replace(/\n/g, '<br>');
    }
    
    // Truncate text to specified length
    function truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
    
    // Escape HTML for safe insertion
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    // Scroll to bottom of chat
    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    // Send message to backend
    async function sendMessage() {
        const question = messageInput.value.trim();
        if (!question) return;
        
        // Add user message to chat
        const userMessageId = chatHistory.length;
        addMessageToChat(question, 'user', userMessageId);
        chatHistory.push({ role: 'user', content: question });
        
        // Clear input and disable send button
        messageInput.value = '';
        messageInput.style.height = 'auto';
        sendButton.disabled = true;
        
        // Add thinking message
        const assistantMessageId = chatHistory.length;
        addMessageToChat('Thinking...', 'assistant', assistantMessageId, [], false, 'gpt-4.1-nano');
        chatHistory.push({ 
            role: 'assistant', 
            content: 'Thinking...', 
            sources: [], 
            model: 'gpt-4.1-nano',
            thinking: true 
        });
        
        saveToStorage();
        scrollToBottom();
        
        // Analytics data
        const startTime = Date.now();
        let success = false;
        let latencyMs = 0;
        
        try {
            // Make API request with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);
            
            const response = await fetch(`${backendUrl}/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question, top_k: topK }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            latencyMs = Date.now() - startTime;
            success = true;
            
            // Update assistant message with response
            chatHistory[assistantMessageId] = { 
                role: 'assistant', 
                content: data.answer || "I don't know based on the indexed PDFs.", 
                sources: data.sources || [], 
                model: 'gpt-4.1-nano'
            };
            
            // Log analytics
            console.log(JSON.stringify({
                ts: new Date().toISOString(),
                questionLength: question.length,
                top_k: topK,
                latencyMs: latencyMs,
                success: success
            }));
            
        } catch (error) {
            latencyMs = Date.now() - startTime;
            success = false;
            
            // Log analytics
            console.log(JSON.stringify({
                ts: new Date().toISOString(),
                questionLength: question.length,
                top_k: topK,
                latencyMs: latencyMs,
                success: success,
                error: error.message
            }));
            
            // Update with error message
            chatHistory[assistantMessageId] = { 
                role: 'assistant', 
                content: 'error', 
                sources: [], 
                model: 'gpt-4.1-nano',
                error: error.message,
                question: question
            };
        }
        
        // Re-render chat with updated message
        renderChatHistory();
        saveToStorage();
        
        // Re-enable send button and focus input
        sendButton.disabled = false;
        messageInput.focus();
    }
    
    // Handle input changes
    messageInput.addEventListener('input', function() {
        sendButton.disabled = this.value.trim() === '';
        
        // Auto-resize textarea
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    
    // Handle keyboard shortcuts
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Update topK value
    topKSelect.addEventListener('change', function() {
        topK = parseInt(this.value);
        saveToStorage();
    });
    
    // Clear chat
    clearChatButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the chat history?')) {
            chatHistory = [];
            renderChatHistory();
            saveToStorage();
        }
    });
    
    // Initialize app
    initFromStorage();
    checkHealth();
    messageInput.focus();
});