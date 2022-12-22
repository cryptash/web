import { decodeBase64, encodeUTF8 } from 'tweetnacl-util'
import { box } from 'tweetnacl'
import { formatKey } from './keysUtils'

export const decryptMessage = (
  secretOrSharedKey: any,
  messageWithNonce: string,
  key: any
) => {
  const private_key = formatKey(secretOrSharedKey)
  const public_key = formatKey(key)
  const messageWithNonceAsUint8Array = decodeBase64(messageWithNonce)
  const nonce = messageWithNonceAsUint8Array.slice(0, box.nonceLength)
  const message = messageWithNonceAsUint8Array.slice(
    box.nonceLength,
    messageWithNonce.length
  )
  const decrypted = key
    ? box.open(message, nonce, public_key, private_key)
    : box.open.after(message, nonce, private_key)

  if (!decrypted) {
    console.error("Couldn't decrypt:")
    console.error({ messageWithNonce, key, secretOrSharedKey })
  }
  if (decrypted) {
    const base64DecryptedMessage = encodeUTF8(decrypted)
    return JSON.parse(base64DecryptedMessage)
  }
  return {
    text: ''
  }
}
