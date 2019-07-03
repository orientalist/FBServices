var salt=require('./salt')
let crypto=require('crypto')

exports.Encrypt_AES192=(str)=>{
    var cipher=crypto.createCipher('aes192',salt.PSID_KEY)
    var crypted=cipher.update(str,'utf8','hex')
    crypted+=cipher.final('hex')    

    return crypted
}

exports.Decrypt_AES192=(str)=>{
    var decipher=crypto.createDecipher('aes192',salt.PSID_KEY)
    var decrypted=decipher.update(str,'hex','utf8')
    decrypted+=decipher.final('utf8')        
    return decrypted
}