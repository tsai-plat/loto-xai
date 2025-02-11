// tsconfig type contains node
import type { ReadableStreamDefaultReadResult } from 'node:stream/web';

// @see https://github.com/Azure/fetch-event-source/blob/main/src/parse.ts
export enum SSEContolChars {
  NewLine = 10,
  CarriageReturn = 13,
  Space = 32,
  Colon = 58,
}

/**
 * parser SSE chunk raw data
 * @param stream
 * @param onChunk
 */
export async function getBytes(
  stream: ReadableStream<Uint8Array>,
  onChunk: (arr: Uint8Array) => void,
) {
  const reader = stream.getReader();

  let result: ReadableStreamDefaultReadResult<Uint8Array>;

  while (
    !(result =
      (await reader.read()) as unknown as ReadableStreamDefaultReadResult<Uint8Array>)
      .done
  ) {
    onChunk(result.value);
  }
}

export function getLines(
  onLine: (line: Uint8Array, fieldLength: number) => void,
) {
  let buffer: Uint8Array | undefined;
  let position: number;
  let fieldLength: number; // length of the `field` portion of the line
  let discardTrailingNewline = false;

  // return a function that can process each incoming byte chunk:
  return function onChunk(arr: Uint8Array) {
    if (buffer === undefined) {
      buffer = arr;
      position = 0;
      fieldLength = -1;
    } else {
      // we're still parsing the old line. Append the new bytes into buffer:
      buffer = concatBuffer(buffer, arr);
    }

    const bufLength = buffer.length;

    // index where the current line starts
    let lineStart = 0;
    while (position < bufLength) {
      if (discardTrailingNewline) {
        if (buffer[position] === SSEContolChars.NewLine) {
          lineStart = ++position; // skip to next char
        }

        discardTrailingNewline = false;
      }

      // start looking forward till end of line
      let lineEnd = -1; // index of the \r or \n char
      for (; position < bufLength && lineEnd === -1; ++position) {
        switch (buffer[position]) {
          case SSEContolChars.Colon:
            if (fieldLength === -1) {
              // first colon in line
              fieldLength = position - lineStart;
            }
            break;

          //  \r case below should fallthrough to \n:
          case SSEContolChars.CarriageReturn:
            discardTrailingNewline = true;

          // eslint-disable-next-line no-fallthrough
          case SSEContolChars.NewLine:
            lineEnd = position;
            break;

          default:
            break;
        }
      }

      if (lineEnd === -1) {
        // We reached the end of the buffer but the line hasn't ended.
        // Wait for the next arr and then continue parsing:
        break;
      }

      // we've reached the line end, send it out:
      onLine(buffer.subarray(lineStart, lineEnd), fieldLength);

      lineStart = position; // we're now on the next line
      fieldLength = -1;
    }

    if (lineStart === bufLength) {
      buffer = undefined; // we've finished reading it
    } else if (lineStart !== 0) {
      // Create a new view into buffer beginning at lineStart so we don't
      // need to copy over the previous lines when we get the new arr:
      buffer = buffer.subarray(lineStart);
      position -= lineStart;
    }
  };
}

function concatBuffer(a: Uint8Array, b: Uint8Array): Uint8Array {
  const res = new Uint8Array(a.length + b.length);
  res.set(a);
  res.set(b, a.length);

  return res;
}
