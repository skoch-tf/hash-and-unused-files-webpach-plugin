/* eslint no-param-reassign: ["error", { "props": false }] */
const crypto = require('crypto');

class CompilationHashByAssets {
  apply(compiler) {
    compiler.hooks.compilation.tap('CompilationHashByAssets', (compilation) => {
      const { outputOptions, hooks } = compilation;
      const { hashFunction, hashDigest, hashDigestLength } = outputOptions;

      hooks.beforeHash.tap('CompilationHashByAssets', () => {
        const compilationAssets = JSON.stringify(Object.keys(compilation.assets));

        const newHash = crypto
          .createHash(hashFunction)
          .update(compilationAssets)
          .update(`${compilation.outputOptions.hashSalt}`)
          .digest(hashDigest)
          .substr(0, hashDigestLength);

        compilation.outputOptions.hashSalt = newHash;
      });
    });
  }
}

module.exports = CompilationHashByAssets;
