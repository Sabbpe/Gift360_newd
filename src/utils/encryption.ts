const SECRET_KEY_TEXT = import.meta.env.VITE_ENCRYPTION_KEY || "fallback-key-32-chars-long!!!";
const SECRET_IV_TEXT = import.meta.env.VITE_ENCRYPTION_IV || "fallback-iv-16ch";

const normalizeBase64 = (value: string): string => {
  if (!value) return "";
  const sanitized = value
    .trim()
    .replace(/ /g, "+")
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const padding = sanitized.length % 4;
  if (padding === 0) return sanitized;
  if (padding === 2) return sanitized + "==";
  if (padding === 3) return sanitized + "=";
  return sanitized;
};

// Convert string key to 32-byte array (AES-256) - Java backend expects raw UTF-8 bytes
const getKeyBytes = (): Uint8Array<ArrayBuffer> => {
  const encoder = new TextEncoder();
  const keyBytes = encoder.encode(SECRET_KEY_TEXT);
  
  // Ensure exactly 32 bytes for AES-256
  if (keyBytes.length < 32) {
    // Pad with zeros if too short
    const padded = new Uint8Array(32);
    padded.set(keyBytes);
    return padded as Uint8Array<ArrayBuffer>;
  }
  if (keyBytes.length > 32) {
    // Truncate if too long
    return keyBytes.slice(0, 32) as Uint8Array<ArrayBuffer>;
  }
  return keyBytes as Uint8Array<ArrayBuffer>;
};

// Convert string IV to 16-byte array - Java backend expects raw UTF-8 bytes
const getIvBytes = (): Uint8Array<ArrayBuffer> => {
  const encoder = new TextEncoder();
  const ivBytes = encoder.encode(SECRET_IV_TEXT);
  
  // Ensure exactly 16 bytes
  if (ivBytes.length < 16) {
    // Pad with zeros if too short
    const padded = new Uint8Array(16);
    padded.set(ivBytes);
    return padded as Uint8Array<ArrayBuffer>;
  }
  if (ivBytes.length > 16) {
    // Truncate if too long
    return ivBytes.slice(0, 16) as Uint8Array<ArrayBuffer>;
  }
  return ivBytes as Uint8Array<ArrayBuffer>;
};

// Import key for Web Crypto API
const importKey = async (): Promise<CryptoKey> => {
  const keyBytes = getKeyBytes();
  return await crypto.subtle.importKey(
    'raw',
    keyBytes.buffer as ArrayBuffer,
    { name: 'AES-CBC' },
    false,
    ['encrypt', 'decrypt']
  );
};

export const encrypt = async (text: string): Promise<string> => {
  if (!text) return '';
  
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    const key = await importKey();
    const iv = getIvBytes();
    
    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-CBC',
        iv: iv.buffer as ArrayBuffer
      },
      key,
      data.buffer as ArrayBuffer
    );
    
    const uint8Array = new Uint8Array(encrypted);
    const binaryString = Array.from(uint8Array)
      .map(byte => String.fromCharCode(byte))
      .join('');
    
    return btoa(binaryString);
  } catch (error) {
    console.error('Encryption failed:', error);
    return '';
  }
};

export const decrypt = async (encrypted: string): Promise<string> => {
  if (!encrypted) return '';
  
  try {
    const key = await importKey();
    const iv = getIvBytes();
    
    const binaryString = atob(normalizeBase64(encrypted));
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-CBC',
        iv: iv.buffer as ArrayBuffer
      },
      key,
      bytes.buffer as ArrayBuffer
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
};
