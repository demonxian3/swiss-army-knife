import CryptoJS from 'crypto-js';

// AES 加密函数
function encrypt(text, key, iv, mode, padding, encoding) {
    const encrypted = CryptoJS.AES.encrypt(
        text,
        CryptoJS.enc.Hex.parse(key), // key as Hex
        {
            iv: CryptoJS.enc.Hex.parse(iv), // iv as Hex
            mode: CryptoJS.mode[mode],
            padding: CryptoJS.pad[padding],
        }
    );

    return encoding === 'Base64' ? encrypted.toString() : encrypted.ciphertext.toString(CryptoJS.enc.Hex);
}

// AES 解密函数
function decrypt(ciphertext, key, iv, mode, padding, encoding) {
    const decrypted = CryptoJS.AES.decrypt(
        encoding === 'Base64' ? ciphertext : CryptoJS.enc.Hex.parse(ciphertext),
        CryptoJS.enc.Hex.parse(key), // key as Hex
        {
            iv: CryptoJS.enc.Hex.parse(iv), // iv as Hex
            mode: CryptoJS.mode[mode],
            padding: CryptoJS.pad[padding],
        }
    );

    return CryptoJS.enc.Utf8.stringify(decrypted);
}

// 示例参数
const key = '2b7e151628aed2a6abf7158809cf4f3c';
const iv = '000102030405060708090a0b0c0d0e0f';
const mode = 'CFB'; // Use CFB mode
const padding = 'NoPadding'; // Use NoPadding
const encoding = 'Hex';

// 待加密的文本
const plaintext = '真的吗Hello, World!';

// 加密
const ciphertext = encrypt(plaintext, key, iv, mode, padding, encoding);
console.log('Encrypted Text:', ciphertext);

// 解密
const decryptedText = decrypt(ciphertext, key, iv, mode, padding, encoding);
console.log('Decrypted Text:', decryptedText);

