import fs from "fs";

export const getConfigPath = (): string | null => {
  const { HOME, USERPROFILE } = process.env;
  const homeDir = process.platform === "win32" ? USERPROFILE : HOME;
  if (!homeDir) {
    console.error("Unable to determine user's home directory. Checked env for HOME and USERPROFILE");
    return null;
  }
  const configFilename = ".treerc";
  const configPath = `${homeDir}/${configFilename}`;
  return configPath;
};

export const pathExists = (filepath: string) => {
  try {
    fs.accessSync(filepath);
    return true;
  } catch {
    return false;
  }
};

export const validatePath = (path: string, pathType: "file" | "dir"): boolean => {
  if (!pathExists(path)) return false;
  const lstat = fs.lstatSync(path);
  const isFile = lstat.isFile();
  if (pathType === "file" && !isFile) {
    console.error("Expected a file but got a directory:", path);
    return false;
  } else if (pathType === "dir" && isFile) {
    console.error("Expected a directory but got a file:", path);
    return false;
  } else {
    return true;
  }
};