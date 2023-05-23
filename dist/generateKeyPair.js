"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genKeyPair = void 0;
const crypto = __importStar(require("crypto"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function genKeyPair() {
    const publicKeyPath = path.join(__dirname, '/id_rsa_pub.pem');
    const privateKeyPath = path.join(__dirname, '/id_rsa_priv.pem');
    // Generates an object where the keys are stored in properties `privateKey` and `publicKey`
    const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem' // Most common formatting choice
        },
        privateKeyEncoding: {
            type: 'pkcs1',
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
exports.genKeyPair = genKeyPair;
genKeyPair();
