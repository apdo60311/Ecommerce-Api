const nodemailer = require('nodemailer')

class EmailService {

    constructor() {}
    logger = Logger.getInstance()
    static _instance;
    static getInstance() {
        if(!this._instance) {
            this._instance = new EmailService();
        }
        return this._instance;
    }

    async initService() {
        let testAccount = await nodemailer.createTestAccount();
        
        this.transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: testAccount.user, // generated ethereal user
              pass: testAccount.pass, // generated ethereal password
            },
        });
    }

    async sendEmail(senderName , senderMail , receiverMails , subject , body , html) {
        await this.initService();
        const emailOptions = {
            from: `"${senderName}" <${senderMail}>`, // sender address
            to: `${receiverMails}`, // list of receivers
            subject: `${subject}`, // Subject line
            text: `${body}`, // plain text body
            html: `${html}`, // html body
        };
        
        let info = await this.transporter.sendMail(emailOptions , (error) => {
            this.logger.log({prefix:'EmailService' , message:error})
        });
        this.logger.log({prefix:'EmailService' , message:info})
    }
}

module.exports = {
    EmailService
}
