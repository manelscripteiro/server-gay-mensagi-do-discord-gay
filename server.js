const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// =========================================================
// CONFIGURAÇÃO
// ======================================================
rapariga
// =========================================================

app.post('/api/send', async (req, res) => {
    const { text, username, threadId } = req.body;
    try {
        const url = threadId ? `${WEBHOOK_URL}?wait=true&thread_id=${threadId}` : `${WEBHOOK_URL}?wait=true`;
        const payload = { content: text, username: username };
        if (!threadId) payload.thread_name = `Suporte: ${username}`;

        const response = await axios.post(url, payload);
        res.json(response.data);
    } catch (error) {
        console.error("Erro ao enviar:", error.response?.data || error.message);
        res.status(500).json({ error: 'Erro ao enviar' });
    }
});

app.get('/api/messages/:threadId', async (req, res) => {
    const { threadId } = req.params;
    try {
        // Busca as mensagens da thread (tópico do fórum)
        const response = await axios.get(`https://discord.com/api/v10/channels/${threadId}/messages?limit=10`, {
            headers: { 'Authorization': `Bot ${BOT_TOKEN}` }
        });
        
        // Filtra para remover mensagens de sistema e mensagens do próprio webhook/cliente
        const filtered = response.data.filter(msg => {
            // Ignora se for mensagem de sistema (tipo 0 é mensagem normal)
            if (msg.type !== 0) return false;
            // Ignora se for o próprio bot/webhook que enviou
            if (msg.author.bot) return false;
            return true;
        });

        res.json(filtered);
    } catch (error) {
        console.error("Erro ao ler:", error.response?.data || error.message);
        res.status(500).json({ error: 'Erro ao ler mensagens' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Proxy Ativo na porta ${PORT}`);
});
