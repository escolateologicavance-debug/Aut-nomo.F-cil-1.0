export default async function handler(req, res) {
    // 🚨 ESTA LINHA CONSERTA O ERRO DE FETCH (Libera o acesso CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Responde rapidamente a requisições de teste do navegador
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Metodo nao permitido' });
    }

    const { nome, profissao, cidade, whatsapp, status, criado_em } = req.body;

    if (!nome || !profissao || !cidade || !whatsapp) {
        return res.status(400).json({ error: 'Todos os campos sao obrigatorios.' });
    }

    try {
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

        const response = await fetch(`${url}/rest/v1/profissionais`, {
            method: 'POST',
            headers: {
                'apikey': key,
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                nome,
                profissao,
                cidade,
                whatsapp,
                status: status || "Disponivel",
                criado_em: criado_em || new Date().toISOString()
            })
        });

        if (!response.ok) {
            const txtErro = await response.text();
            throw new Error(txtErro || 'Erro interno no Supabase');
        }

        return res.status(200).json({ success: true });
        
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
