
    const messagesContainer = document.getElementById('chatbot-messages');
    const inputMessage = document.getElementById('inputMessage');
    var md = window.markdownit()

    // Add a welcome message when the chatbot starts
    appendMessage('system', 'Hello! How can I help you?');

    function appendMessage(type, text) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${type === 'user' ? 'user-message' : 'system-message'}`;

      if (type === 'user') {
        const headerDiv = document.createElement('div');
        headerDiv.className = 'message-header';
        headerDiv.textContent = 'You:';
        messageDiv.appendChild(headerDiv);
      } else if (type === 'system') {
        const headerDiv = document.createElement('div');
        headerDiv.className = 'message-header';
        headerDiv.textContent = 'System:';
        messageDiv.appendChild(headerDiv);
      }

      const textNode = document.createTextNode(text);
      messageDiv.appendChild(textNode);

      messagesContainer.appendChild(messageDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    document.addEventListener('DOMContentLoaded', function () {
      // Add event listener for the button click
      const sendButton = document.getElementById('sendButton');
      sendButton.addEventListener('click', sendMessage);

      async function sendMessage() {
        const userMessage = inputMessage.value;
        if (userMessage.trim() === '') return;

        appendMessage('user', userMessage);

        try {
          const response = await fetch('https://gemini-extension-backend.vercel.app/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const responseData = await response.json();
          const chatbotResponse = responseData.response;

          if (chatbotResponse.includes('```')) {
            // If response contains code block
            const codeBox = document.createElement('div');
            codeBox.className = 'code-box';
            codeBox.textContent = chatbotResponse;

            messagesContainer.appendChild(codeBox);
          } else {
            // Normal text response
            appendMessage('system', chatbotResponse);
          }
        } catch (error) {
          console.error('Error making API request:', error.message);
          appendMessage('system', 'Error in API request');
        }

        inputMessage.value = '';
      }
    });