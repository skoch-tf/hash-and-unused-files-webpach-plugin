const CompilationHashByAssets = require("./CompilationHashByAssets");
const UnusedFilesPlugin = require("./UnusedFilesPlugin");
const WatchUnusedFilesPlugin = require("./WatchUnusedFilesPlugin");

module.exports = {
  UnusedFilesPlugin: UnusedFilesPlugin,
  CompilationHashByAssets: CompilationHashByAssets,
  WatchUnusedFilesPlugin: WatchUnusedFilesPlugin
};
