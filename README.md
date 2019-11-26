# CompilationHashByAssets

Change the compilation hash when you change the assets list.

```
// webpack config
...
plugins: [
    new CompilationHashByAssets(),
]
```

# UnusedFilesPlugin

List all files that was not used inside of compilation.

In this example the plugin is configured to ignore any files inside of tests, storybook stories and packages

```
// webpack config
...
plugins: [
    new UnusedFilesPlugin(path.resolve('src'), /^((?!__tests__|stories|node_modules).)*\.js/),
]
```



# WatchUnusedFilesPlugin

List all files that was not used inside of compilation.

In this example the plugin is configured to ignore any files inside of tests, storybook stories and packages

```
// webpack dev config
...
plugins: [
    new WatchUnusedFilesPlugin(path.resolve('src'), /^((?!__tests__|stories|node_modules).)*\.js/),
]
```


