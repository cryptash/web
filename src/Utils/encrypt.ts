
import nacl, {box} from 'tweetnacl'
import {decodeUTF8, encodeBase64} from 'tweetnacl-util'
import {formatKey} from './keysUtils'

export const encryptMessage = (secretOrSharedKey: any, json: any, key: any) => {
  const private_key = formatKey(secretOrSharedKey)
  const public_key = formatKey(key)
  const nonce = nacl.randomBytes(box.nonceLength)
  const messageUint8 = decodeUTF8(JSON.stringify(json))
  const encrypted = public_key ?
      box(messageUint8, nonce, public_key, private_key) :
      box.after(messageUint8, nonce, private_key)

  const fullMessage = new Uint8Array(nonce.length + encrypted.length)
  fullMessage.set(nonce)
  fullMessage.set(encrypted, nonce.length)
  return encodeBase64(fullMessage)
}
