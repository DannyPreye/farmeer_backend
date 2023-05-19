"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sendVerificationToken_1 = require("./sendVerificationToken");
function default_1(email, url, token, name) {
    return __awaiter(this, void 0, void 0, function* () {
        const sender = { name: "Farmmeet", email: "no-reply@digitecng.com" };
        const sendMessage = yield sendVerificationToken_1.mailtrap.send({
            from: sender,
            to: [{ email: email }],
            subject: 'Reset Password',
            html: html({ url, token, name }),
        });
        if (sendMessage.success) {
            return true;
        }
    });
}
exports.default = default_1;
const html = (params) => {
    const { url, token, name } = params;
    const userUrl = `${url}/auth/reset?token=${token}`.replace(/\./g, "&#8203;.");
    const colors = {
        backgroundColor: "#038709",
        textColor: "#e1e6e1",
        buttonColor: "#04c204",
    };
    return `
    <body style="margin: 0; padding: 0; background:${colors.backgroundColor}">

     <div style="width:100%; padding:16px 2rem">
        <h1 style="font-size:24px; font-weight:bold; color:${colors.textColor}"> 
            Welcome to Farmmeet
         </h1>

         <p style="font-size:16px; color:${colors.textColor};">
            Hi ${name},
         </p>
        <p style="font-size:16px; color:${colors.textColor}; margin-top:0.8rem">
           You are receiving this because you (or someone else) have requested the reset of the password for your account.
      Please click on the following link below to complete the process
        </p>
        
        <a href="${userUrl}" style="background:${colors.buttonColor}; margin-top:1rem; padding:8px 16px; color:${colors.textColor}; text-decoration:none; border-radius:4px; font-size:16px; font-weight:bold">
        Click here to verify your email
        </a>

        <p style="color:${colors.textColor}">
              If you did not request this, please ignore this email and your password will remain unchanged.
        </p>
     </div>

    </body>
    
    `;
};
