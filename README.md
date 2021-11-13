# struct cli
`struct` is a tool for generating trees from a user's file system as well as building structures in the file system from an existing tree

Install it with:
```
npm i -g @structure-codes/cli
```

### Configuration
By default, the cli will ignore certain directories which you are unlikely to want to include in tree output. This configuration will be stored in `.treerc` in your home directory (determined by either `$HOME` or `$USERPROFILE`). By default, the below directories are ignored:
```
.git
node_modules
```
If a `.treerc` file is not found when running the tool, you will be prompted to create one.
### Generating structure from a directory
Running `struct` will output a tree from your current directory by default. You can also specify a path to a target directory and different output options.
```
Usage: struct [options] [command] [directory]

Arguments:
  directory                       directory to build structure from (default: ".")

Options:
  -o, --output-file <outputFile>  file to put tree structure in
  -i, --ignore <ignore>           ignore these patterns (default: [])
  -c, --config-ignore             include patterns that are ignored by config
  -j, --json                      print tree in json format
  -e, --editor                    open structure in new vscode window
  -s, --silent                    do not print anything to the console

Examples:
  Output tree ignoring dist to file new.tree
  $ struct -i dist -o new.tree
```

### Building structure from a tree file
If you already have a tree that you want to mimic in your file system, you can build it with `struct build <file>`. You can specify the output path to build in with `-d`.

```
Usage: struct build [options] <file>

Arguments:
  file                         .tree file to build structure from

Options:
  -d, --directory <directory>  output directory to build structure in (default: ".")
  -h, --help                   display help for command

  Examples:    
    Build structure from src.tree in directory new-project
    $ struct build ./src.tree -o new-project
```