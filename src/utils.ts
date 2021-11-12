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