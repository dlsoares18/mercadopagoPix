import 'dotenv/config';
import express from 'express';
import { MercadoPagoConfig, Payment } from 'mercadopago';

import cors from 'cors';



const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const client = new MercadoPagoConfig({
    accessToken: process.env.accessToken,
    options: { timeout: 5000 },
});

const payment = new Payment(client);

// Endpoint POST /pagar
app.post('/pagar', async (req, res) => {
    const { transaction_amount, description, payer_email } = req.body;

    if (!transaction_amount || !description || !payer_email) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
    }

    const body = {
        transaction_amount: Number(transaction_amount),
        description,
        payment_method_id: 'pix',
        payer: {
            email: payer_email
        }
    };

    try {
        const response = await payment.create({ body });
        return res.status(201).json(response);
    } catch (error) {
        console.error('Erro ao criar pagamento:', error);
        return res.status(500).json({ error: 'Erro ao processar pagamento.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
