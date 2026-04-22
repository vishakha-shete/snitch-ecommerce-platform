import ImageKit, { toFile } from '@imagekit/nodejs';
import { config } from '../config/config.js';

const client = new ImageKit({
  privateKey: config.ImageKit_private_key,
});

export async function uploadFile(buffer, fileName, folder="snitch-e-commerce") {
    const result = await client.files.upload({
        file: await toFile(buffer, fileName),
        fileName,
        folder
    });
    return result;
}