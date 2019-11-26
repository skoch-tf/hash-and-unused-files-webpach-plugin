const fs = require("fs");
const path = require("path");

class UnusedFilesPlugin {
  constructor({ sourceDirectory, filter, killCompiler }) {
    this.sourceDirectory = sourceDirectory;
    this.filter = filter;
  }

  apply(compiler) {
    const usedFiles = [];

    compiler.hooks.emit.tap("ConfigPlugin", compilation => {
      compilation.chunks.forEach(chunk => {
        chunk.getModules().forEach(module => {
          module.buildInfo &&
            module.buildInfo.fileDependencies &&
            module.buildInfo.fileDependencies.forEach(fileName => {
              if (usedFiles.indexOf(fileName) === -1) {
                usedFiles.push(fileName);
              }
            });
        });
      });

      const compared = this.compareWithSourceDirectory(usedFiles);

      process.stdout.write(
        `=== UNUSED FILES ${compared.totalUnusedFiles}/${compared.totalFiles}===\n`
      );
      compared.unusedFiles.forEach(unusedFilename => {
        process.stdout.write(` - ${unusedFilename}\n`);
      });
    });
  }

  compareWithSourceDirectory(usedFiles) {
    const fileList = this.findInDir(this.sourceDirectory, this.filter);
    const unusedFiles = fileList.filter(x => !usedFiles.includes(x));
    return {
      unusedFiles,
      totalFiles: fileList.length,
      totalUnusedFiles: unusedFiles.length
    };
  }

  findInDir(dir, filter, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const fileStat = fs.lstatSync(filePath);

      if (fileStat.isDirectory()) {
        this.findInDir(filePath, filter, fileList);
      } else if (filter.test(filePath)) {
        fileList.push(filePath);
      }
    });

    return fileList;
  }
}

module.exports = UnusedFilesPlugin;
