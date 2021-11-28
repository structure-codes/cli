import inquirer from "inquirer";
import fs from "fs";
import { execSync } from "child_process";
import { defaults } from "../constants/defaults";
import { SettingsType } from "../types/settingsType";
import { getConfigPath, validatePath } from "./utils";

const defaultSettingsPrompt = {
  type: "list",
  name: "useDefaultSettings",
  message: "Use default settings?",
  choices: ["Yes", "No"],
};
const editSettingsPrompt = {
  type: "list",
  name: "editSettings",
  message: "Edit settings now?",
  choices: ["Yes", "No"],
};
const overwritePrompt = {
  type: "list",
  name: "overwriteFile",
  message: ".treerc already exists, overwrite it?",
  choices: ["Yes", "No"],
};

const configExists = (): boolean => {
  const configPath = getConfigPath();
  return validatePath(configPath, "file");
};

const createConfig = async (settings: SettingsType): Promise<string | null> => {
  const configPath = getConfigPath();
  try {
    console.info("Writing config file to:", configPath);
    const exists = fs.existsSync(configPath);
    if (exists) {
      const { overwriteFile } = await inquirer.prompt(overwritePrompt);
      if (overwriteFile === "No") {
        return;
      }
    }
    // If file does not exist OR user select to overwrite it, create the file
    fs.writeFileSync(configPath, JSON.stringify(settings, null, 2));
    return configPath;
  } catch (err) {
    console.error("Error creating config file:", configPath);
    console.error(err);
    return;
  }
};

const getEditor = () => {
  // As first option see if vscode binary is available
  try {
    execSync("code --help");
    return "code";
  } catch {
    const { VISUAL, EDITOR } = process.env;
    if (VISUAL || EDITOR) return VISUAL || EDITOR;
    if (process.platform === "win32") return "C:\\Windows\\System32\\notepad.exe";
    else return "vim";
  }
};

export const checkConfig = async () => {
  if (configExists()) return;
  try {
    console.log("Building a tree from certain directories may have slow performance.");
    console.log(`By default, ignore these directories:\n${defaults.ignored.join("\n")}\n`);
  
    const { useDefaultSettings } = await inquirer.prompt([defaultSettingsPrompt]);
    if (useDefaultSettings === "Yes") return createConfig(defaults);
  
    const { editSettings } = await inquirer.prompt([editSettingsPrompt]);
    if (editSettings === "Yes") {
      const configPath = await createConfig(defaults);
      const editor = getEditor();
      execSync(`${editor} ${configPath}`);
    } else {
      // If not using defaults or editing now, do not create a .treerc file
      return;
    }
  } catch (error) {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
      return console.error(error);
    } else {
      // Something else went wrong
      return console.error(error);
    }
  }
};
