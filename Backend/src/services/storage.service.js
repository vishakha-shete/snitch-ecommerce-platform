import ImageKit from '@imagekit/nodejs';
import { config } from '../config/config.js';

const client = new ImageKit({
  privateKey: config.ImageKit_private_key, // This is the default and can be omitted
});


export async function uploadfile(buffer, filename, folder="snitch-e-commerce") {
    const result = await client.upload({
        file: await ImageKit.toFile(buffer),
        fileName,
        folder
    });
    return result;
}