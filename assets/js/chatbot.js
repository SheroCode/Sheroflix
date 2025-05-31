/********* Chatbot Logic ***********/
export function initializeChatbot(){
const togglerBtn = document.querySelector(".chatbot-toggler");
if (togglerBtn) {
  const chatbotWindow = document.querySelector(".chatbot");
  const sendChatbtn = document.querySelector(".chat-input i");
  const chatInput = document.querySelector(".chat-input textarea");
  const chatbox = document.querySelector(".chatbox");
  let userMessage;
  togglerBtn.addEventListener("click", function () {
    chatbotWindow.classList.toggle("hidden");
  });

  const API_KEY = "AIzaSyBrF5-C-hbe8xeLQAK-09S1Sy3wugS0mqg";
  const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent =
      className === "outgoing"
        ? `<p>${message}</p>`
        : `<i class="fa-brands fa-rocketchat fa-lg"></i>
            <p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
  };
  const generateResponse = (incomingChatLi) => {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: userMessage }],
          },
        ],
      }),
    };
    //send POST request to API,get response
    fetch(API_URL, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        messageElement.textContent =
          data.candidates?.[0]?.content?.parts?.[0]?.text ||
          "No response received.";
      })
      .catch(() => {
        messageElement.textContent =
          "Oops! Something went wrong.please try again.";
      })
      .finally(() => {
        chatbox.scrollTo(0, chatbox.scrollHeight);
      });
  };
  const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
      const incomingChatLi = createChatLi("Thinking....", "incoming");
      chatbox.appendChild(incomingChatLi);
      chatbox.scrollTo(0, chatbox.scrollHeight);

      generateResponse(incomingChatLi);
      chatbox.scrollTo(0, chatbox.scrollHeight);
      chatInput.value = "";
    }, 600);
  };

  sendChatbtn.addEventListener("click", handleChat);
}
}