import { Twilio } from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const phonenumber = process.env.PHONE_NUMBER;

const client = new Twilio(accountSid, authToken);

const sendTextMessage = async (body: string) => {
  return await client.messages.create({
    from: twilioNumber,
    to: phonenumber,
    body,
  });
};

export const twilio = {
  sendTextMessage,
};
