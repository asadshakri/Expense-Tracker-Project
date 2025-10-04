const Sib = require("sib-api-v3-sdk");
require("dotenv").config();

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;
    console.log(apiKey.apiKey);
    const tranEmailApi = new Sib.TransactionalEmailsApi();

    const sender = {
      email: "asadshakri3127@gmail.com",
      name: "Expense Tracker",
    };

    const receivers = [
      {
        email: email,
      },
    ];

    const response = await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: "Testing transactional brevo api",
      htmlContent: `<h1>Hello {{params.role}}</h1>`,
      params: {
        role: "backend developer",
      },
    });
    console.log(response);
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = {
  resetPassword,
};
