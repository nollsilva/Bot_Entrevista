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

  [
    {
      call1:{
      "BoasVindas": "essas sao as boas vindas",
      "nome": "nome completo"
        },
      call2:{
        "cpf": "000.000.000-00"
      },
      call3:{
        "cep": "00.000.000"
      },
      call4:{
        "finalizou": "Obrg por entrar em contato \n ajudo em algo mais???"
      }
    }
  ]

  // if (!session[phoneNumber]) {
  //   responseMsg = 'Olá! Obrigado Por entrar em contato.por favor, insira seu nome:';
  //   session[phoneNumber] = 'name';
  // } else if (session[phoneNumber] === 'name') {
  //   responseMsg = 'Ótimo! Agora, insira seu CPF:';
  //   session[phoneNumber] = 'cpf';
  // } else if (session[phoneNumber] === 'cpf') {
  //   responseMsg = 'Quase lá! Agora, insira seu CEP:';
  //   session[phoneNumber] = 'cep';
  // } else if (session[phoneNumber] === 'cep') {
  //   const address = await getAddressFromCep(incomingMsg);
  //   responseMsg = `Seu endereço completo é: ${address}`;
  //   delete session[phoneNumber];
  // }

  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message(responseMsg);

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

app.get('/obter', async (req, res) => {
  const retornoConsulta = {
    mensagem: "Olá Mundo"
  };  
return res.json(retornoConsulta).status(200);
} );


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

const PORT = process.env.PORT || 10000;
app.listen({
  host: '0.0.0.0',
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
}).then(() => {
  console.log('HTTP Server Running')
})
// app.listen(PORT, () => {
//   console.log(`Server is listening on port ${PORT}`);
// });