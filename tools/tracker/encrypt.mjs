// Encrypts the plaintext tracker JSON for docs/tracker. Needs only the public key, never the passphrase.
// Usage: node tools/tracker/encrypt.mjs <plaintext.json> [repoRoot]
import { webcrypto as c } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [src, root = "."] = process.argv.slice(2);
const s = c.subtle, b64 = (b) => Buffer.from(b).toString("base64");
const plain = readFileSync(src);
JSON.parse(plain); // refuse to publish malformed data

const pub = await s.importKey("jwk", JSON.parse(readFileSync(join(root, "docs/tracker/pubkey.json"))), { name: "RSA-OAEP", hash: "SHA-256" }, false, ["encrypt"]);
const dek = c.getRandomValues(new Uint8Array(32));
const iv = c.getRandomValues(new Uint8Array(12));
const aes = await s.importKey("raw", dek, "AES-GCM", false, ["encrypt"]);
const ct = await s.encrypt({ name: "AES-GCM", iv }, aes, plain);
const wrapped = await s.encrypt({ name: "RSA-OAEP" }, pub, dek);

writeFileSync(join(root, "docs/tracker/data.enc.json"), JSON.stringify({ v: 1, key: b64(wrapped), iv: b64(iv), ct: b64(ct) }));
console.log(`encrypted ${plain.length} bytes`);
