/**
 * Client-Side Zero-Knowledge Encryption Vault
 * Uses Web Crypto API (AES-GCM-256 + PBKDF2) to encrypt custom presets or sensitive exports.
 * Keys never leave the browser.
 */

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptData(
  plainText: string,
  passphrase: string
): Promise<{ cipherTextHex: string; saltHex: string; ivHex: string }> {
  if (!passphrase || passphrase.length < 8) {
    throw new Error("Passphrase must be at least 8 characters.");
  }

  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);

  const enc = new TextEncoder();
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv as BufferSource },
    key,
    enc.encode(plainText)
  );

  const toHex = (buffer: ArrayBuffer | Uint8Array) =>
    Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

  return {
    cipherTextHex: toHex(encryptedBuffer),
    saltHex: toHex(salt),
    ivHex: toHex(iv),
  };
}

export async function decryptData(
  cipherTextHex: string,
  passphrase: string,
  saltHex: string,
  ivHex: string
): Promise<string> {
  const fromHex = (hex: string) => {
    if (!hex || typeof hex !== "string" || hex.length % 2 !== 0) {
      throw new Error("Invalid hex encoded payload.");
    }
    const matches = hex.match(/.{1,2}/g);
    if (!matches) throw new Error("Failed to parse hex string.");
    return new Uint8Array(matches.map((byte) => parseInt(byte, 16)));
  };

  try {
    const salt = fromHex(saltHex);
    const iv = fromHex(ivHex);
    const cipherBytes = fromHex(cipherTextHex);

    const key = await deriveKey(passphrase, salt);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv as BufferSource },
      key,
      cipherBytes as BufferSource
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedBuffer);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "OperationError") {
      throw new Error("Decryption failed. Incorrect passphrase or corrupted payload.");
    }
    throw err;
  }
}
