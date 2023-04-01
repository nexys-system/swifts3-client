import fs from 'fs';

export function readFileToBuffer(filePath: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(filePath);
    const chunks: Buffer[] = [];

    readStream.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    readStream.on('end', () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer);
    });

    readStream.on('error', err => {
      reject(err);
    });
  });
}
