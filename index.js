import fs from 'fs';
import path from 'path';
import FastGlob from 'fast-glob';

export default function myPlugin() {
  return {
    name: 'vite-css-glob-import', // required, will show up in warnings and errors

    load(id) {
      if (id.endsWith('.scss')) {
        console.log({ id });
        // read file
        const file = fs.readFileSync(id, 'utf-8');
        console.log(file);
        // read file line by line to find all statements that start with @import and contain a glob pattern
        const lines = file.split('\n');
        const importLines = lines.filter((line) => line.startsWith('@import'));

        const globPatterns = importLines.map((line) => {
          const globPattern = line.split(' ')[1];
          const res = globPattern.split("'")[1];

          return path.resolve(path.dirname(id), res);
        });

        console.log({ globPatterns });

        const currentPath = path.resolve(__dirname);
        console.log({ currentPath });
        const files = FastGlob.sync([...globPatterns]);
        console.log({ files });
        const res = files
          .filter((file) => file !== id)
          .map((file) => `@import "${file}";`)
          .join('\n');
        console.log({ res });
        return res;
      }
    },
  };
}
