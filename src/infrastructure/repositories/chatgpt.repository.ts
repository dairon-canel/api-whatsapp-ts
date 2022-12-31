import process from 'process';
import { Client } from 'whatsapp-web.js';
import { ChatGPTAPI, getOpenAIAuth } from 'chatgpt';

// Environment variables
require('dotenv').config();

// Prefix check
const prefixEnabled = process.env.PREFIX_ENABLED == 'true';
const prefix = '!gpt';

// Whatsapp Client
const client = new Client({});

// ChatGPT Client
const openAIAuth = await getOpenAIAuth({
  email: process.env.EMAIL,
  password: process.env.PASSWORD,
  isGoogleLogin: true,
});

const api = new ChatGPTAPI({ ...openAIAuth });

// Entrypoint
const start = async () => {
  // Ensure the API is properly authenticated
  try {
    await api.initSession();
  } catch (error: any) {
    console.error(
      '[Whatsapp ChatGPT] Failed to authenticate with the ChatGPT API: ' +
        error.message,
    );
    process.exit(1);
  }
};

const handleMessage = async (msg: any, prompt: any) => {
  try {
    const start = Date.now();

    // Send the prompt to the API
    console.log(
      '[Whatsapp ChatGPT] Received prompt from ' + msg.from + ': ' + prompt,
    );
    const response = await api.sendMessage(prompt);

    console.log(
      `[Whatsapp ChatGPT] Answer to ${msg.from}: ${response.response}`,
    );

    const end = Date.now() - start;

    console.log('[Whatsapp ChatGPT] ChatGPT took ' + end + 'ms');

    // Send the response to the chat
    msg.reply(response.response);
  } catch (error: any) {
    msg.reply(
      'An error occured, please contact the administrator. (' +
        error.message +
        ')',
    );
  }
};
