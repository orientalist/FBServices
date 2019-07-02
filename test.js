var enc=require('./models/Encryption/EncryptionCenter')

var test=enc.Encrypt_AES192('welcome')
enc.Decrypt_AES192(test)