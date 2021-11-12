# struct cli
`struct` is a tool for generating trees from a user's file system as well as building structures in the file system from an exisiting tree

Install it with:
```
npm i -g @structure-codes/cli
```

## Generating structure from a directory




```
Usage: struct [options] [command] [directory]

Arguments:
  directory                       directory to build structure from (default: ".")

Options:
  -v, --version                   output the version number
  -o, --output-file <outputFile>  file to put tree structure in
  -i, --ignore <ignore>           ignore these patterns (default: [])
  -c, --config-ignore             include patterns that are ignored by config
  -j, --json                      print tree in json format
  -e, --editor                    open structure in new vscode window
  -s, --silent                    do not print anything to the console
  -h, --help                      display help for command

Commands:
  build [options] <file>

Examples:
  Output tree ignoring dist to file new.tree
  $ struct -i dist -o new.tree
  
  Build structure from src.tree in directory new-project
  $ struct build ./src.tree -o new-project
```
