export type AssistantInstallResult = {
  assistantId: string;
  installed: boolean;
  createdPaths: string[];
  message?: string;
};

export type AssistantSyncScope = "all" | "skills";

export type AssistantSyncOptions = {
  scope?: AssistantSyncScope;
};

export interface AssistantStrategy {
  readonly id: string;
  install(targetDir: string, overwrite?: boolean): Promise<AssistantInstallResult>;
  sync(
    targetDir: string,
    options?: AssistantSyncOptions,
  ): Promise<AssistantInstallResult>;
}
