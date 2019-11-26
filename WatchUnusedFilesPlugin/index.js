const fs = require('fs');
const path = require('path');
const chalk = require('react-dev-utils/chalk');

class WatchUnusedFilesPlugin {
  constructor(sourceDirectory, filter) {
    this.sourceDirectory = sourceDirectory;
    this.filter = filter;
  }

  apply(compiler) {
    const usedFiles = [];
    let unusedFiles = [];

    compiler.hooks.emit.tapAsync('ConfigPlugin', (compilation, callback) => {
      callback();
      compilation.chunks.forEach((chunk) => {
        chunk.getModules().forEach((module) => {
          if (module.buildInfo && module.buildInfo.fileDependencies)
            module.buildInfo.fileDependencies.forEach((fileName) => {
              if (usedFiles.indexOf(fileName) === -1) {
                usedFiles.push(fileName);
              }
            });
        });
      });

      unusedFiles = this.compareWithSourceDirectory(usedFiles);
    });

    compiler.hooks.done.tapAsync('done', (stats, callback) => {
      callback();
      console.log(chalk.bold(chalk.red(`\n\n🚨 Unused files.\n`)));
      unusedFiles.forEach((f) => console.log(chalk.yellow(`👻 ${f}`)));
    });
  }

  compareWithSourceDirectory(usedFiles) {
    const fileList = this.findInDir(this.sourceDirectory, this.filter);
    return fileList.filter((x) => !usedFiles.includes(x));
  }

  findInDir(dir, filter, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
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

module.exports = WatchUnusedFilesPlugin;
