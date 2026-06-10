// Este código roda no servidor da Vercel, o usuário NUNCA vê isso
export default async function handler(req, res) {
  const { whatsapp } = req.body;
  const token = "SEU_TOKEN_AQUI"; // O token fica escondido aqui

  const response = await fetch("https://api.mercadopago.com/v1/payments", {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
        transaction_amount: 59.00,
        description: "Assinatura Anual",
        payment_method_id: "pix",
        external_reference: `recarga_${whatsapp}`
    })
  });
  
  const data = await response.json();
  res.status(200).json(data);
}
