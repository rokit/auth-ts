import fetch from 'node-fetch';

const sendGridKey = process.env.SG_SEND_GRID_KEY;

if (!sendGridKey) {
  throw "Cannot get SendGrid key";
}

export const sendForgotEmail = async (
  to: string,
  token: string,
  username: string,
) => {
  let href = `http://localhost:3000/reset-password?token=${token}`;
  let htmlMsg = `
  <div style="display: flex;">
  <table style="font-family: sans-serif; color: #555; padding: 20px; margin: auto; border: 3px solid #ccc; border-radius: 20px;">
      <tr>
      <td>Hi ${username}, please use the following link to reset your password:</td>
      </tr>
      <tr>
      <td><a href="${href}"><h3>${href}</h3></a></td>
      </tr>
      <tr>
      <td style="padding-bottom: 20px;">If you did not initiate this request, you can safely ignore this email.</td>
      </tr>
      <tr>
      <td>Regards,</td>
      </tr>
      <tr>
      <td>Auth App Support</td>
      </tr>
  </table>
  </div>
  `;

  let data = {
    "personalizations": [
      {
        "to": [
          {
            "email": to
          }
        ],
        "subject": "Auth App: Password Reset"
      }
    ],
    "from": {
      "email": "support@authapp.com"
    },
    "content": [
      {
        "type": "text/html",
        "value": htmlMsg
      }
    ]
  };

  fetch(`https://api.sendgrid.com/v3/mail/send`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sendGridKey}`
    }
  });
}
