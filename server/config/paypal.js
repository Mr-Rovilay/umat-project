// config/paypal.js
import paypal from '@paypal/checkout-server-sdk';

export const paypalClient = () => {
  const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, NODE_ENV } = process.env;

  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('Missing PayPal credentials in environment variables.');
  }

  const environment =
    NODE_ENV === 'production'
      ? new paypal.core.LiveEnvironment(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET)
      : new paypal.core.SandboxEnvironment(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET);

  return new paypal.core.PayPalHttpClient(environment);
};

export { paypal };
