import EventEmitter, { once } from 'node:events';

import * as FileStreamRotator from 'file-stream-rotator';

interface PinoRotateFileOptions {
  folder: string;
  filename: string;
  extension: string;
}

export default async (options: PinoRotateFileOptions): Promise<EventEmitter> => {
  const stream = FileStreamRotator.getStream({
    filename: `${options.folder}/${options.filename}.%DATE%`,
    frequency: 'date',
    extension: `.${options.extension}`,
    utc: true,
    verbose: false,
    date_format: 'YYYYMM',
    audit_file: `${options.folder}/log-audit.json`
  });
  await once(stream, 'open');
  return stream;
};

export { PinoRotateFileOptions };
