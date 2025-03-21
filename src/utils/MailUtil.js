//to,from,subject,text
const nodemailer = require("nodemailer");

///function

const sendingMail = async(to,subject,text) => {
    try{
        const transporter = mailer.createTransport({
            service: 'gmail',
            auth:{
                user:"ektasendhav5304@gmail.com",
                pass:"upbt ohbu qsiu owog"
            }
        });
    
        const mailOptions = {
            from: 'ektasendhav5304@gmail.com',
            to: to,
            subject: subject,
            text: text
        };
    
        const mailresponse = await transporter.sendMail(mailOptions);
        console.log(mailresponse);
        return mailresponse;
    }catch (error) {
        console.error("🔥 Email Sending Error:", error);
        throw error;
    }
    

};

module.exports ={
    sendingMail
};
//sendingMail("samir.vithlani83955@gmail.com","Test Mail","this is test mail")