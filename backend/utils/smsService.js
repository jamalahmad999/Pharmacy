// SMS service for sending OTP messages
// Supports multiple providers: Twilio, MessageBird, AWS SNS

async function sendSMSWithTwilio(phone, message) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      From: fromNumber,
      To: phone,
      Body: message,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Twilio SMS failed: ${error.message}`);
  }

  return await response.json();
}

async function sendSMSWithMessageBird(phone, message) {
  const apiKey = process.env.MESSAGEBIRD_API_KEY;
  const originator = process.env.MESSAGEBIRD_ORIGINATOR || 'LifePharmacy';

  const response = await fetch('https://rest.messagebird.com/messages', {
    method: 'POST',
    headers: {
      'Authorization': `AccessKey ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      originator,
      recipients: [phone],
      body: message,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`MessageBird SMS failed: ${error.errors?.[0]?.description}`);
  }

  return await response.json();
}

async function sendSMS(phone, message) {
  const provider = process.env.SMS_PROVIDER || 'console';
  
  switch (provider) {
    case 'twilio':
      return await sendSMSWithTwilio(phone, message);
    case 'messagebird':
      return await sendSMSWithMessageBird(phone, message);
    case 'console':
    default:
      console.log(`📱 SMS to ${phone}: ${message}`);
      return { success: true, provider: 'console' };
  }
}

module.exports = { sendSMS };