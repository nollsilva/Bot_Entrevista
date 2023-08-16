const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const axios = require('axios');

console.log('chamou arquivo');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const accountSid = 'ACaa5489df2f37afc8dc414c76294fe2b4';
const authToken = '850949d8ca214c28cd6b77b5a4c53603';
const client = twilio(accountSid, authToken);

const session = {};

app.post('/whatsapp', async (req, res) => {
  const incomingMsg = req.body.Body.toLowerCase();
  const phoneNumber = req.body.From;

  let responseMsg = '';

  if (!session[phoneNumber]) {
    responseMsg = 'Olá! Obrigado Por entrar em contato.por favor, insira seu nome:';
    session[phoneNumber] = 'name';
  } else if (session[phoneNumber] === 'name') {
    responseMsg = 'Ótimo! Agora, insira seu CPF:';
    session[phoneNumber] = 'cpf';
  } else if (session[phoneNumber] === 'cpf') {
    responseMsg = 'Quase lá! Agora, insira seu CEP:';
    session[phoneNumber] = 'cep';
  } else if (session[phoneNumber] === 'cep') {
    const address = await getAddressFromCep(incomingMsg);
    responseMsg = `Seu endereço completo é: ${address}`;
    delete session[phoneNumber];
  }

  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message(responseMsg);

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

app.get('/obter', async (req, res) => {
  return "Ola mundo"
} )

async function getAddressFromCep(cep) {
  try {
    // aqui vai a url da api de endereço.
    const response = await axios.get(`https://h-apigateway.conectagov.estaleiro.serpro.gov.br/api-cep/v1/consulta/cep/${cep}`);
    return response.data.address || 'Endereço não encontrado.';
  } catch (error) {
    console.error('Erro ao buscar endereço:', error);
    return 'Erro ao buscar endereço.';
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});