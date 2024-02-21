import nodemailer from 'nodemailer';
import { convert } from 'html-to-text';
import pug from 'pug';

export default class Email {
  constructor(obj) {
    this.from = process.env.EMAIL;
    this.to = obj.to;

    if (obj.url) {
      this.url = obj.url;
    }
  }

  createTransporter() {
    if (process.env.NODE_ENV === 'dev') {
      return nodemailer.createTransport({
        host: process.env.DEV_HOST,
        port: process.env.DEV_PORT,
        secure: false,
        auth: {
          user: process.env.DEV_USER,
          pass: process.env.DEV_PASS,
        },
      });
    } else {
      return nodemailer.createTransport({
        host: process.env.PROD_HOST,
        port: process.env.PROD_PORT,
        secure: true,
        auth: {
          user: process.env.PROD_USER,
          pass: process.env.PROD_PASS,
        },
      });
    }
  }

  async sendInvetation(inviter, project) {
    const html = pug.renderFile(
      `${process.cwd()}/views/emails/invetationEmail.pug`,
      {
        subject: 'Invetation to CTMS project',
        to: this.to,
        url: this.url,
        inviter: inviter,
        project: project,
      },
    );

    const text = convert(html);

    const mailOption = {
      from: this.from,
      to: this.to,
      subject: 'Invetation to CTMS project',
      text: text,
      html: html,
    };

    await this.createTransporter().sendMail(mailOption);
  }
}
