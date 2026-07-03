export type AssistantInstallResult = {
  assistantId: string;
  installed: boolean;
  createdPaths: string[];
  message?: string;
};

export interface AssistantStrategy {
  readonly id: string;
  install(targetDir: string, overwrite?: boolean): Promise<AssistantInstallResult>;
}
