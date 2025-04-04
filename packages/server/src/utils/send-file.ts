import { createReadStream } from "node:fs";
import { Readable } from "node:stream";

export const sendFile = (filePath: string, corrupt = false): ReadableStream<Uint8Array> => {
  let position = 0;

  return new ReadableStream({
    async start(controller) {
      try {

        // Convert Node.js stream to Web Stream
        const nodeStream = createReadStream(filePath);
        const originalStream = Readable.toWeb(nodeStream);
        const reader = originalStream.getReader();

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            return;
          }

          let chunk = new Uint8Array(value);

          if (corrupt && position < 24) {
            chunk = chunk.map((byte, index) => {
              const globalPos = position + index;
              return [8, 9, 16, 17, 20].includes(globalPos) ? byte ^ 0xFF : byte;
            });
          }

          controller.enqueue(chunk);
          position += chunk.length;
        }
      } catch (error) {
        controller.error(error);
      }
    }
  });
};
