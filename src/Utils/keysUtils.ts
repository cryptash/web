import { encodeBase64 } from 'tweetnacl-util'
import { box } from 'tweetnacl'
import { decode } from '@stablelib/base64'
export const formatKey = (key: any): Uint8Array => {
  // @ts-ignore
  // eslint-disable-next-line valid-typeof
  return typeof key === 'Uint8Array' ? key : decode(key)
}

export const generateKeyPair = () => {
  const { publicKey, secretKey } = box.keyPair()
  return {
    public_key: encodeBase64(publicKey),
    private_key: encodeBase64(secretKey)
  }
}
