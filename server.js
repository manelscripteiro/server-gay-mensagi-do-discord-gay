const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors()); // Libera o acesso para o seu site da CentralCart
app.use(express.json());

// =========================================================
// CONFIGURAÇÃO (Preencha com seus dados)
// =========================================================
const BOT_TOKEN = "SEU_TOKEN_DE_BOT_AQUI";
const WEBHOOK_URL = "SUA_URL_DO_WEBHOOK_AQUI";
// =========================================================

// Rota para Enviar Mensagem (Cria Thread ou envia para Thread existente)
app.post('/api/send', async (req, res) => {
    const { text, username, threadId } = req.body;
    
    try {
        const url = threadId ? `${WEBHOOK_URL}?wait=true&thread_id=${threadId}` : `${WEBHOOK_URL}?wait=true`;
        const payload = { content: text, username: username };
        
        if (!threadId) {
            payload.thread_name = `Suporte: ${username}`;
        }

        const response = await axios.post(url, payload);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao enviar mensagem' });
    }
});

// Rota para Ler Mensagens de uma Thread
app.get('/api/messages/:threadId', async (req, res) => {
    const { threadId } = req.params;
    
    try {
        const response = await axios.get(`https://discord.com/api/v10/channels/${threadId}/messages?limit=10`, {
            headers: { 'Authorization': `Bot ${BOT_TOKEN}` }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao ler mensagens' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Proxy rodando na porta ${PORT}`);
});
