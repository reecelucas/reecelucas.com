const AWS = require('aws-sdk');
const ses = new AWS.SES();
const { EMAIL, DOMAIN } = process.env;

const isBot = ({ captcha }) => !!captcha;

const generateResponse = (statusCode, data) => ({
  statusCode,
  headers: {
    'Access-Control-Allow-Origin': `${DOMAIN}`,
    'Access-Control-Allow-Headers': 'x-requested-with',
    'Access-Control-Allow-Credentials': true
  },
  body: JSON.stringify(data)
});

const generateEmailParams = body => {
  const { name, organisation, email, message } = body;

  return {
    Source: EMAIL,
    Destination: {
      ToAddresses: [EMAIL]
    },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `
            Name: ${name}
            Email: ${email}
            Organisation: ${organisation}
            Message: ${message}
          `
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Portfolio Contact Submission'
      }
    }
  };
};

module.exports.send = async event => {
  try {
    const body = JSON.parse(event.body);

    if (isBot(body)) {
      return;
    }

    const emailParams = generateEmailParams(body);
    const data = await ses.sendEmail(emailParams).promise();
    return generateResponse(200, data);
  } catch (error) {
    return generateResponse(500, error.message);
  }
};
