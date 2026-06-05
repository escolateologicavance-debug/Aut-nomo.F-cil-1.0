import { createClient } from '@supabase/supabase-js';

// Conecta ao Supabase usando as chaves seguras da Vercel
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
    // Rejeita qualquer método que não seja POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    // Recebe os dados vindos do formulário HTML
    const { nome, profissao, cidade, whatsapp, status, criado_em } = req.body;

    // Validação básica para garantir que o celular enviou tudo correto
    if (!nome || !profissao || !cidade || !whatsapp) {
        return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    try {
        // Insere os dados diretamente na tabela 'profissionais'
        const { error: erroInserção } = await supabase
            .from('profissionais')
            .insert([{
                nome: nome,
                profissao: profissao,
                cidade: cidade,
                whatsapp: whatsapp,
                status: status || "Disponível",
                criado_em: criado_em || new Date().toISOString()
            }]);

        if (erroInserção) throw erroInserção;

        return res.status(200).json({ success: true, message: 'Profissional cadastrado com sucesso!' });
        
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
