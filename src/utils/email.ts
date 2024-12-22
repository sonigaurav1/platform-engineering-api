/* eslint-disable @typescript-eslint/no-explicit-any */
import { SES } from '@aws-sdk/client-ses';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import nodemailer from 'nodemailer';

import { EMAIL_CONFIG } from '../configs/server.config';

import logger from './logger';

const ses = new SES({
  apiVersion: '2010-12-01',
  region: 'us-east-1',
  credentials: defaultProvider(),
});

interface EmailArgs {
  to: string;
  subject: string;
  from?: string;
  text?: string;
  html?: any;
  attachments?: any;
}

const transporter = nodemailer.createTransport({
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  SES: { ses, aws: require('@aws-sdk/client-ses') },
});

export const sendEmail = async ({ to, subject, html, text, attachments, from = EMAIL_CONFIG.DEFAULT_SENDER }: EmailArgs): Promise<void> => {
  try {
    await transporter.sendMail({
      to,
      subject,
      from,
      text,
      html,
      attachments,
    });
  } catch (error) {
    logger.error(error);
  }
};

// transporter.verify(function (error) {
//   if (error != null) {
//     logger.error(error);
//   } else {
//     logger.info('Server is ready to take our messages');
//   }
// });
