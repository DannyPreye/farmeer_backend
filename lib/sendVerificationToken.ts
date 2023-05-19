import { MailtrapClient } from "mailtrap";



const Token = process.env.MAILTRAP_TOKEN;
export const mailtrap = new MailtrapClient({ token: Token as string });

export default async function (email: string, url: string, token: string, name: string)
{

    const sender = { name: "Farm meet", email: "no-reply@digitecng.com" };
    const sendMessage = await mailtrap.send({
        from: sender,
        to: [ { email: email } ],
        subject: 'Welcome to Farm meeet',
        html: html({ url, token, name }),
    });

    if (sendMessage.success) {
        console.log("Message has been sent");
        return true;

    } else console.log("message could not be sent", sendMessage);

}


const html = (params: { url: string, token: string, name: string; }) =>
{
    const { url, token, name } = params;

    const userUrl = `${url}?token=${token}`.replace(/\./g, "&#8203;.");
    const colors = {
        backgroundColor: "#038709",
        textColor: "#e1e6e1",
        buttonColor: "#04c204",

    };

    console.log(url);
    return `
    <body style="margin: 0; padding: 0; background:${colors.backgroundColor}">

     <div style=" padding:16px 2rem">
        <h1 style="font-size:24px; font-weight:bold; color:${colors.textColor}"> 
            Welcome to AgroConnect
         </h1>

         <p style="font-size:16px; color:${colors.textColor};">
            Hi ${name},
         </p>
        <p style="font-size:16px; color:${colors.textColor}; margin-top:0.8rem; padding:2px 4px;">
            Thanks for signing up to AgroConnect.
            Please click the button below to verify your email address.
        </p>
        
        <a href="${userUrl}" style="background:${colors.buttonColor}; margin:16px 0px; padding:8px 16px;
         color:${colors.textColor}; text-decoration:none;
          border-radius:4px; font-size:16px; font-weight:bold">
        
          Click here to verify your email
        </a>

        <p style="color:${colors.textColor}">
             If you did not request this email you can safely ignore it.
        </p>
     </div>

    </body>
    
    `;
};