export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
        // 🔄 CORREÇÃO 1: Usando a chave correta que está na sua Vercel
        const key = process.env.SUPABASE_ANON_KEY; 

        // 🔄 CORREÇÃO 2: Enviando para a tabela 'cadastro' em vez de 'profissionais'
        const response = await fetch(`${url}/rest/v1/cadastro`, {
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

        // Retorna uma mensagem limpa de sucesso
        return res.status(200).send("Cadastro realizado com sucesso na nuvem!");
        
    } catch (error) {
        return res.status(500).send("Erro no servidor: " + error.message);
    }
}
