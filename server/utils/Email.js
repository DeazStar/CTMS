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

  async send(subject, template, optionOne, optionTwo = null) {
    let html;
    if (!optionTwo) {
      html = pug.renderFile(`${process.cwd()}/views/emails/${template}.pug`, {
        subject: subject,
        to: this.to,
        url: this.url,
        task: optionOne,
      });
    } else {
      console.log('am here');
      html = pug.renderFile(`${process.cwd()}/views/emails/${template}.pug`, {
        subject: subject,
        to: this.to,
        url: this.url,
        inviter: optionOne,
        project: optionTwo,
      });
    }

    const text = convert(html);

    const mailOption = {
      from: this.from,
      to: this.to,
      subject: subject,
      text: text,
      html: html,
    };

    try {
      await this.createTransporter().sendMail(mailOption);

      console.log('Done sending email');
    } catch (err) {
      console.log(err);
    }
  }

  async sendInvetation(inviter, project) {
    const subject = 'Project Invetation';
    await this.send(subject, 'invetationEmail', inviter, project);
  }

  async sendReminder(task) {
    const subject = `Reminder for ${task}`;
    await this.send(subject, 'reminderEmail', task);
  }
}
