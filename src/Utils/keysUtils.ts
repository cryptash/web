import { decodeBase64, encodeBase64 } from 'tweetnacl-util'
import { box } from 'tweetnacl'
export const formatKey = (key: any) => {
  // @ts-ignore
  // eslint-disable-next-line valid-typeof
  return typeof key === 'Uint8Array' ? key : decodeBase64(key)
}

export const generateKeyPair = () => {
  const { publicKey, secretKey } = box.keyPair()
  return {
    public_key: encodeBase64(publicKey),
    private_key: encodeBase64(secretKey)
  }
}
