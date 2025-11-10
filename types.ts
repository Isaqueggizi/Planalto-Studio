export interface ColorPalette {
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

export interface Screen {
  name: string;
  description: string;
  components: string[];
  icon: string;
}

export interface AppConfig {
  appName: string;
  description: string;
  colorPalette: ColorPalette;
  screens: Screen[];
}

export type ProjectFiles = {
  [filePath: string]: string;
};

export interface Project {
  config: AppConfig;
  files: ProjectFiles;
  deploymentUrl: string;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  isLoading?: boolean;
}