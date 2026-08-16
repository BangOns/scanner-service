// function untuk mengenkripsi dan meng-obfuscate source code JavaScript agar tidak bisa dibaca user
export function obfuscateJavaScript(sourceCode: string): string {
  // 1. Konversi kode teks ke Buffer binary
  const payloadBuffer = Buffer.from(sourceCode, "utf8");

  // 2. Terapkan enkripsi XOR stream cipher dengan dynamic key
  const key = [0x53, 0x63, 0x61, 0x6e, 0x6e, 0x65, 0x72, 0x53, 0x65, 0x63, 0x75, 0x72, 0x65, 0x4b, 0x65, 0x79];
  const encryptedBytes = Buffer.alloc(payloadBuffer.length);
  for (let i = 0; i < payloadBuffer.length; i++) {
    encryptedBytes[i] = payloadBuffer[i] ^ key[i % key.length];
  }

  const hexEncrypted = encryptedBytes.toString("hex");

  // 3. Bangun runtime decryptor wrapper agar dieksekusi secara in-memory oleh Node.js
  const obfuscatedScript = `/**
 * @license Scanner Platform Core Engine v2.1.0
 * PROPRIETARY AND CONFIDENTIAL. UNAUTHORIZED COPYING OR DECOMPILATION STRICTLY PROHIBITED.
 */
(function(_0x4a1f,_0x2b3e){
  const _0x1d9a=function(_0x3c2b){
    const _0x5e4f=[];
    for(let _0x8a1c=0;_0x8a1c<_0x3c2b.length;_0x8a1c+=2){
      _0x5e4f.push(parseInt(_0x3c2b.substr(_0x8a1c,2),16));
    }
    return _0x5e4f;
  };
  const _0x7b2c=[83,99,97,110,110,101,114,83,101,99,117,114,101,75,101,121];
  const _0x9c3d=_0x1d9a(_0x4a1f);
  const _0x6e1a=new Uint8Array(_0x9c3d.length);
  for(let _0x4f2b=0;_0x4f2b<_0x9c3d.length;_0x4f2b++){
    _0x6e1a[_0x4f2b]=_0x9c3d[_0x4f2b]^_0x7b2c[_0x4f2b%_0x7b2c.length];
  }
  const _0x3e8a=Buffer.from(_0x6e1a).toString('utf8');
  const _0x2f1b=new Function('require','module','exports','__dirname','__filename',_0x3e8a);
  _0x2f1b(require,module,exports,__dirname,__filename);
})("${hexEncrypted}",0x1);
`;

  return obfuscatedScript;
}
