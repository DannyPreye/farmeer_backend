import * as crypto from 'crypto';

import * as fs from "fs";
import * as path from "path";

export function genKeyPair()
{
    const publicKeyPath = path.join(__dirname, '/id_rsa_pub.pem');
    const privateKeyPath = path.join(__dirname, '/id_rsa_priv.pem');

    // Generates an object where the keys are stored in properties `privateKey` and `publicKey`
    const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096, // bits - standard for RSA keys
        publicKeyEncoding: {
            type: 'pkcs1', // "Public Key Cryptography Standards 1" 
            format: 'pem' // Most common formatting choice
        },
        privateKeyEncoding: {
            type: 'pkcs1', // "Public Key Cryptography Standards 1"
            format: 'pem' // Most common formatting choice
        }
    });

    if (fs.existsSync(publicKeyPath) && fs.existsSync(privateKeyPath)) {
        console.log('Key pair already exists.');
        return;
    }

    // Create the public key file
    fs.writeFileSync(publicKeyPath, keyPair.publicKey);

    // Create the private key file
    fs.writeFileSync(privateKeyPath, keyPair.privateKey);

}


genKeyPair();