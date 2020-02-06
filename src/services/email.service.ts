import nodemailer from 'nodemailer';
import pug from 'pug';
import {IUser, User} from '@app/models/user.model';
import CONFIG from '@app/config/config';
import EventsService from '@app/services/event.service';

export class EmailService {

  static async getTransporter() {
    if(CONFIG.smtp_host.length > 0) {
      return nodemailer.createTransport({
        host: CONFIG.smtp_host,
        port: parseInt(CONFIG.smtp_port),
        secure: true,
        auth: {
          user: CONFIG.smtp_user,
          pass: CONFIG.smtp_password
        }
      });
    }
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass // generated ethereal password
      }
    });
  }

  static async sendRegistration(user: IUser, subject: string = 'Webinsolut') {

    const mailOptions = {
      to: user.email,
      from: CONFIG.email_from,
      subject: `Registration in ${subject}`,
      html: pug.renderFile('templates/index.pug', {name: user.firstName && user.firstName.length ? ' ' + user.firstName : ' there', file: 'registration', subject})
    };
    const transporter = await this.getTransporter();
    transporter.sendMail(mailOptions, function (err, info) {
      console.log('Registration email sent', user.email, err);

    });
  }

  static async sendResetPassword(user: IUser, token: string, subject: string = 'Webinsolut') {

    const mailOptions = {
      to: user.email,
      from: CONFIG.email_from,
      subject: `${subject} Password Reset`,
      html: pug.renderFile('templates/index.pug', {name: user.firstName && user.firstName.length ? ' ' + user.firstName : ' there', file: 'forgot', subject, resetLink: `${CONFIG.reset_host}/reset/${escape(subject)}/${escape(token)}`})
    };
    const transporter = await this.getTransporter();
    transporter.sendMail(mailOptions, function (err) {
      console.log('Password reset email sent', user.email, err);
    });
  }

  static async sendThatPasswordIsChanged(user: IUser) {
    const mailOptions = {
      to: user.email,
      from: CONFIG.email_from,
      subject: 'Your password has been changed',
      html: pug.renderFile('templates/index.pug', {name: user.firstName && user.firstName.length ? ' ' + user.firstName : ' there', file: 'password_changed'}),
    };
    const transporter = await this.getTransporter();
    transporter.sendMail(mailOptions, function (err) {
      console.log('Password changed email sent');
    });
  }
}
