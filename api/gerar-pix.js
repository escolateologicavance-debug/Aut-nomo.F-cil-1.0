export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    
    const { whatsapp } = req.body;
    const MP_ACCESS_TOKEN = "APP_USR-5566486977720830-111319-2a921774301cae014946b495bf439bc9-436233346";
    const refExclusiva = `recarga_${whatsapp.replace(/\D/g, '')}`;

    const response = await fetch("https://api.mercadopago.com/v1/payments", {
        method: "POST",
        headers: { "Authorization": `Bearer ${MP_ACCESS_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({
            transaction_amount: 59.00,
            description: "Ativação Anual - AutônomoFácil",
            payment_method_id: "pix",
            external_reference: refExclusiva,
            payer: { email: "sistema@autonomofacil.com" }
        })
    });
    
    const data = await response.json();
    res.status(200).json(data);
}
