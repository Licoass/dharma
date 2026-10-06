import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Simple PNG encoder in pure Node.js
function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (-(crc & 1) & 0xedb88320);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const crcVal = crc32(Buffer.concat([typeBuf, data]));
  crcBuf.writeUInt32BE(crcVal, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function generateDharmaPng(size, outputPath) {
  const width = size;
  const height = size;

  // Raw RGBA scanlines: 1 filter byte (0) + 4 bytes per pixel
  const rawData = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;

  const cx = width / 2;
  const cy = height / 2;
  const rBg = width * 0.45;
  const rOuter = width * 0.28;
  const rMid = width * 0.22;
  const rCore = width * 0.11;
  const rDot = width * 0.05;

  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let r = 250, g = 248, b = 245, a = 0; // Transparent outside

      if (dist <= rBg) {
        // Teal background gradient (#14B8A6 to #0F766E)
        const t = (x + y) / (width * 2);
        r = Math.round(20 * (1 - t) + 15 * t);
        g = Math.round(184 * (1 - t) + 118 * t);
        b = Math.round(166 * (1 - t) + 110 * t);
        a = 255;

        // Outer glow circle
        if (Math.abs(dist - rOuter) < width * 0.015) {
          r = 94; g = 234; b = 212; a = 180;
        }

        // Cream white disc (#F0FDFA)
        if (dist <= rMid) {
          r = 240; g = 253; b = 250; a = 255;
        }

        // Inner teal circle (#0D9488)
        if (dist <= rCore) {
          r = 13; g = 148; b = 136; a = 255;
        }

        // Center dot (#F0FDFA)
        if (dist <= rDot) {
          r = 240; g = 253; b = 250; a = 255;
        }

        // Sparkle dot at top right
        const sDist = Math.hypot(x - (cx + width * 0.14), y - (cy - height * 0.14));
        if (sDist <= width * 0.035) {
          r = 94; g = 234; b = 212; a = 255;
        }
      }

      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits per channel
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // Deflate
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // No interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // IDAT
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);

  // IEND
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  const png = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
  fs.writeFileSync(outputPath, png);
  console.log(`Generated ${outputPath} (${width}x${height}, ${png.length} bytes)`);
}

const iconsDir = path.resolve('public/icons');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

generateDharmaPng(192, path.join(iconsDir, 'icon-192.png'));
generateDharmaPng(512, path.join(iconsDir, 'icon-512.png'));
generateDharmaPng(512, path.join(iconsDir, 'icon-maskable.png'));
