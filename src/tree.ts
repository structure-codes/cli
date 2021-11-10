const TRUNK = "│";
const BRANCH = "├──";
const LAST_BRANCH = "└──";

export const getNumberOfTabs = (line: string) => {
  return (line.match(/\t/g) || []).length;
};

export const treeStringToJson = (tree: string) => {
  type Element = Record<string, any>;
  const elements: { [key: string]: Element } = {};
  let prevLine = "";
  const path: Array<string> = [];

  // look for line breaks that works on all platforms
  tree.split(/\r|\r\n|\n/).forEach((line, index) => {
    if (line.startsWith("#")) return;
    const prevPrefix = prevLine.split(" ")[0];
    const prevNumTabs = getNumberOfTabs(prevPrefix);
    const prefix = line.split(" ")[0];
    const numTabs = getNumberOfTabs(prefix);
    const filename: string = line.substr(prefix.length).trim();
    // Pop a certain number of elements from path
    const popCount = numTabs <= prevNumTabs ? prevNumTabs - numTabs + 1 : 0;
    Array(popCount)
      .fill("pop")
      .forEach(() => path.pop());

    /* 
      EXAMPLE OF REDUCER FUNCTION
        For each element in path, return elements[pathItem]
        The result is the branch in elements for the current path
        path = [ "src/", "Home/"]
        elements = { 
          "src/": { 
            "Home/": {} 
          }
        }
        iter1 = elements["src/"]
        iter2 = elements["src/"]["Home/"]
        curr = {}
    */
    const current: any = path.reduce(
      (branch: { [key: string]: Element }, filename: string) => branch[filename],
      elements
    );

    current[filename] = {};
    prevLine = line;
    path.push(filename);
  });
  return elements;
};

// not sure we need this but maybe
export const isValidTreeString = (tree: string) => {
  const isValidTreeRegex = /^(│?(\t+)?(│|├──|└──|\t)+.+)|#.+|^\s+$/;
  const lines = tree.split(/\r?\n/);
  const invalidLine = lines.find(line => !line.match(isValidTreeRegex));
  if (invalidLine) {
    console.error("Found invalid line in file:" + invalidLine);
    return false;
  }
  return true;
};

const getBranchPrefix = (depth: boolean[], isLastBranch: boolean) => {
  let base = "";
  const tab = "  ";
  depth.forEach(isLastBranch => (base = base.concat(isLastBranch ? tab : `${TRUNK}${tab}`)));
  if (isLastBranch) return base + LAST_BRANCH + " ";
  else return base + BRANCH + " ";
};

export const treeJsonToString = (tree: any) => {
  let treeString = "";
  const parseBranches = (tree: any, depth: boolean[]) => {
    const branches = Object.entries(tree);
    branches.forEach(([key, values], index) => {
      const isLastBranch = index === branches.length - 1;
      const prefix = getBranchPrefix(depth, isLastBranch);
      const branchString = prefix + key + "\n";
      treeString = treeString.concat(branchString);
      parseBranches(values, [...depth, isLastBranch]);
    });
  };
  parseBranches(tree, []);
  treeString = treeString.replace(/\n$/, "");

  return treeString;
};