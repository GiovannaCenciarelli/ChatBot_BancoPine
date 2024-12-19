// Dados de usuários simulando o CSV no frontend
const users = {
    'giovanna@email.com': { senha: 'senha123', saldo: 2500 },
    'lucas@email.com': { senha: 'password321', saldo: 1800 },
    'osvaldo@email.com': { senha: 'password321', saldo: 1800 },
    'creusa@email.com': { senha: 'password321', saldo: 1800 },
    'gilberto@email.com': { senha: 'password321', saldo: 1800 }
};

// Estado do usuário
let currentUser = {
    email: '',
    isAuthenticated: false
};

// Central de mensagens padrão do bot
const botMessages = {
    initial: 'Sou o assistente virtual do Banco Pine. Comece me falando o que procura.',
    askPassword: 'Por favor, digite sua senha:',
    invalidEmail: '⚠️ Email não encontrado no sistema. Tente novamente.',
    invalidFormat: '⚠️ Informe um email válido.',
    invalidCredentials: '⚠️ Credenciais inválidas. Tente novamente.',
    saldo: saldo => `✅ Saldo: R$ ${saldo}`,
    notUnderstood: 'Desculpe, não entendi sua mensagem. Pode reformular?'
};

// Função para criar uma nova mensagem no chat
function createMessage(message, sender) {
    const chatBox = document.querySelector('.chat-box');

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', sender);

    const textDiv = document.createElement('div');
    textDiv.classList.add('chat-message-text');
    textDiv.textContent = message;

    if (sender === 'bot-message') {
        const botIcon = document.createElement('img');
        botIcon.src = 'bot-icon.png';
        botIcon.alt = 'Bot';
        botIcon.classList.add('bot-icon');

        messageDiv.appendChild(botIcon);
        messageDiv.appendChild(textDiv);
    } else {
        messageDiv.appendChild(textDiv);
    }

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Função principal de resposta do bot
function botResponse(userMessage) {
    setTimeout(() => {
        if (!currentUser.email) {
            // Verificar email
            if (validateEmail(userMessage)) {
                if (users[userMessage]) {
                    currentUser.email = userMessage;
                    createMessage(botMessages.askPassword, 'bot-message');
                } else {
                    createMessage(botMessages.invalidEmail, 'bot-message');
                }
            } else {
                createMessage(botMessages.invalidFormat, 'bot-message');
            }
        } else if (!currentUser.isAuthenticated) {
            // Verificar senha
            const passwordInput = userMessage.trim();
            if (users[currentUser.email].senha === passwordInput) {
                currentUser.isAuthenticated = true;
                createMessage(botMessages.saldo(users[currentUser.email].saldo), 'bot-message');
            } else {
                createMessage(botMessages.invalidCredentials, 'bot-message');
                currentUser.email = ''; // Reinicia o login
            }
        } else {
            // Respostas comuns
            handleCommonMessages(userMessage);
        }
    }, 1000);
}

// Validação de email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Respostas comuns do chatbot
function handleCommonMessages(userMessage) {
    const lowerCaseMessage = userMessage.toLowerCase();

    if (lowerCaseMessage.includes('olá')) {
        createMessage('Olá! Como posso ajudar você?', 'bot-message');
    } else if (lowerCaseMessage.includes('ajudar')) {
        createMessage('Claro! Estou aqui para ajudar. Como posso assisti-lo?', 'bot-message');
    } else if (lowerCaseMessage.includes('quem é você')) {
        createMessage('Sou o assistente virtual do Banco Pine, pronto para ajudar com suas dúvidas!', 'bot-message');
    } else if (lowerCaseMessage.includes('banco pine')) {
        createMessage('O Banco Pine é uma instituição financeira focada em soluções personalizadas e inovadoras. Como posso ajudar?', 'bot-message');
    } else {
        createMessage(botMessages.notUnderstood, 'bot-message');
    }
}

// Eventos de clique nos botões
document.querySelector('.button-container').addEventListener('click', event => {
    if (event.target.classList.contains('button-19')) {
        const buttonText = event.target.textContent.trim();

        if (buttonText === 'Conheça o banco') {
            createMessage('O Banco Pine é uma instituição financeira dedicada a oferecer serviços personalizados, focados em soluções inovadoras para atender as necessidades de seus clientes.', 'bot-message');
        } else if (buttonText === 'Quem somos') {
            createMessage('Somos uma equipe comprometida em entregar excelência no mercado financeiro, com anos de experiência e foco em inovação e sustentabilidade.', 'bot-message');
        } else if (buttonText === 'Consulte seu saldo') {
            createMessage('Por favor, informe seu email para iniciar o processo de consulta de saldo.', 'bot-message');
        }
    }
});

// Envio de mensagem pelo input
document.querySelector('.chat-input button').addEventListener('click', sendMessage);
document.querySelector('.chat-input input').addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        sendMessage();
        e.preventDefault();
    }
});

// Função de envio de mensagem
function sendMessage() {
    const inputField = document.querySelector('.chat-input input');
    const inputValue = inputField.value.trim();

    if (inputValue) {
        createMessage(inputValue, 'user-message');
        inputField.value = '';
        botResponse(inputValue);
    }
}

// Mensagem inicial do bot
window.onload = () => createMessage(botMessages.initial, 'bot-message');
