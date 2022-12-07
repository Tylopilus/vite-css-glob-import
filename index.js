const fs = require('fs');
const path = require('path');
const FastGlob = require('fast-glob');

function myPlugin() {
  return {
    name: 'vite-css-glob-import', // required, will show up in warnings and errors

    load(id) {
      if (id.endsWith('.scss')) {
        // console.log({ id });
        // read file
        let file = fs.readFileSync(id, 'utf-8');
        // console.log(file);
        // read file line by line to find all statements that start with @import and contain a glob pattern
        const lines = file.split('\n');
        const importLines = lines.filter((line) => line.startsWith('@import'));

        const toReplace = importLines.map((line) => {
          const globPattern = line.split(' ')[1];
          const res = globPattern.split("'")[1];

          let importFile = res.split('/').at(-1);
          if (!importFile?.endsWith('.scss')) {
            importFile = `_${importFile}.scss`;
          }
          const fileToImport = path.join(
            res.split('/').slice(0, -1).join('/'),
            importFile
          );
          // console.log({ fileToImport });

          const files = FastGlob.sync(
            path.resolve(path.dirname(id), fileToImport)
          );
          // console.log('here', files);
          return [line, files.map((file) => `@import "${file}";`).join('\n')];
        });

        // console.log({ toReplace });
        for (const [search, replace] of toReplace) {
          file = file.replace(search, replace);
        }
        // console.log(file);
        return file;
        // const files = FastGlob.sync([...globPatterns]);
        // console.log({ files });
        // const res = files
        //   .filter((file) => file !== id)
        //   .map((file) => `@import "${file}";`)
        //   .join('\n');
        // console.log({ res });
        // return res;
      }
    },
  };
}
module.exports = myPlugin;
