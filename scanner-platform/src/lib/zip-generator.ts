import zlib from "zlib";

interface ZipFileEntry {
  name: string;
  content: string | Buffer;
  mode?: number;
}

// Tabel Lookup CRC-32 Standar IEEE 802.3
const crcTable: Uint32Array = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[i] = c;
}

// function untuk menghitung nilai checksum CRC32 dari buffer data
function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// function untuk membuat file ZIP archive standar secara on-the-fly tanpa dependensi external
export function createZipArchive(entries: ZipFileEntry[]): Buffer {
  const localFileChunks: Buffer[] = [];
  const centralDirChunks: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const rawContent = Buffer.isBuffer(entry.content)
      ? entry.content
      : Buffer.from(entry.content, "utf8");

    const compressedContent = zlib.deflateRawSync(rawContent);
    const useDeflate = compressedContent.length < rawContent.length;
    const dataToStore = useDeflate ? compressedContent : rawContent;
    const compressionMethod = useDeflate ? 8 : 0;
    const crc = crc32(rawContent);
    const nameBuffer = Buffer.from(entry.name.replace(/\\/g, "/"), "utf8");

    // Format tanggal dan waktu standar DOS
    const dosTime = (12 << 11) | (0 << 5) | (0 >> 1);
    const dosDate = ((2026 - 1980) << 9) | (8 << 5) | 16;

    // 1. Local file header
    const localHeader = Buffer.alloc(30 + nameBuffer.length);
    localHeader.writeUInt32LE(0x04034b50, 0); // Signature PK\x03\x04
    localHeader.writeUInt16LE(20, 4);         // Versi ZIP yang dibutuhkan (2.0)
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(compressionMethod, 8);
    localHeader.writeUInt16LE(dosTime, 10);
    localHeader.writeUInt16LE(dosDate, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(dataToStore.length, 18);
    localHeader.writeUInt32LE(rawContent.length, 22);
    localHeader.writeUInt16LE(nameBuffer.length, 26);
    localHeader.writeUInt16LE(0, 28);
    nameBuffer.copy(localHeader, 30);

    localFileChunks.push(localHeader, dataToStore);

    // 2. Central directory header
    const externalAttr = entry.mode ? (entry.mode << 16) : (0o644 << 16);
    const centralHeader = Buffer.alloc(46 + nameBuffer.length);
    centralHeader.writeUInt32LE(0x02014b50, 0); // Signature PK\x01\x02
    centralHeader.writeUInt16LE(0x0314, 4);     // Version made by (UNIX 2.0)
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(compressionMethod, 10);
    centralHeader.writeUInt16LE(dosTime, 12);
    centralHeader.writeUInt16LE(dosDate, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(dataToStore.length, 20);
    centralHeader.writeUInt32LE(rawContent.length, 24);
    centralHeader.writeUInt16LE(nameBuffer.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(externalAttr, 38); // UNIX permissions (chmod)
    centralHeader.writeUInt32LE(offset, 42);
    nameBuffer.copy(centralHeader, 46);

    centralDirChunks.push(centralHeader);

    offset += localHeader.length + dataToStore.length;
  }

  const centralDirBuffer = Buffer.concat(centralDirChunks);
  const centralDirSize = centralDirBuffer.length;
  const centralDirOffset = offset;

  // 3. End of central directory record (EOCD)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);          // Signature PK\x05\x06
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralDirSize, 12);
  eocd.writeUInt32LE(centralDirOffset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localFileChunks, centralDirBuffer, eocd]);
}
