import { createClient } from '@supabase/supabase-js';

// Conecta de forma oculta e segura ao banco de dados Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
// Rejeita qualquer acesso que não seja um envio de dados (POST)
if (req.method !== 'POST') {
return res.status(405).json({ error: 'Método não permitido' });
}

// Recebe a nota, o comentário e os IDs enviados pela página feedbacks.html
const { transacaoId, profissionalId, estrelas, comentario } = req.body;

try {
// 1. CHECAGEM ANTIFRAUDE: Busca se esse link/transação existe no banco
const { data: transacao, error: erroTransacao } = await supabase
.from('transacoes')
.select('avaliada')
.eq('id', transacaoId)
.single();

if (erroTransacao || !transacao) {
return res.status(400).json({ error: 'Link de avaliação inválido ou inexistente.' });
}

// 2. CHECAGEM ANTIFRAUDE: Bloqueia se o link já tiver sido usado antes
if (transacao.avaliada === true) {
return res.status(400).json({ error: 'Este link já foi utilizado para enviar uma avaliação.' });
}

// 3. Grava a avaliação (estrelas e texto) na tabela correspondente
const { error: erroAvaliacao } = await supabase
.from('avaliacoes')
.insert([{
transacao_id: transacaoId,
profissional_id: profissionalId,
estrelas: parseInt(estrelas),
comentario: comentario
}]);

if (erroAvaliacao) throw erroAvaliacao;

// 4. Atualiza o status da transação para TRUE (marcando-a como já avaliada)
await supabase
.from('transacoes')
.update({ avaliada: true })
.eq('id', transacaoId);

return res.status(200).json({ success: true, message: 'Avaliação registrada com sucesso!' });
} catch (error) {
return res.status(500).json({ error: error.message });
}
}
