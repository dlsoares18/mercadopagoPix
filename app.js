import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { MercadoPagoConfig, Payment } from 'mercadopago';

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())


const client = new MercadoPagoConfig({
    accessToken: process.env.accessToken,
    options: {
        timeout: 5000
    }
});

const payment = new Payment(client);

app.post('/pagamento', async (req, res) => {
	const dados = req.body

	try {
		const resposta = await payment.create({ body: dados })
		res.status(200).json(resposta)
	} catch (error) {
		console.error('Erro ao criar pagamento: ', error)
		res.status(500).json({ error: 'Erro ao processar pagamento.'})
	}

})

app.listen(port, () => {
	console.log(`Servidor rodando em http://localhost:${port}`)
})
// const body = {
// 	transaction_amount: 30.50,
// 	description: 'Teste api pix V2',
// 	payment_method_id: 'pix',
// 	payer: {
// 		email: 'seu_email@seu_email.com'
// 	},
// };

// payment.create({ body }).then(console.log).catch(console.log);