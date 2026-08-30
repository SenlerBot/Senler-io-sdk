export declare const SENLER_APP_ACTION_EXTENSION: "x-senler-app-action";
export declare const SENLER_APP_ACTION_CONTRACT_VERSION: 1;
export declare const SENLER_APP_ACTION_CONTEXTS: readonly ["app", "agent_tool", "automation_step"];
export type SenlerAppActionContext = (typeof SENLER_APP_ACTION_CONTEXTS)[number];
export declare const SENLER_APP_ACTION_RESULT_KINDS: readonly ["data", "agent_tool_configuration", "automation_step_configuration"];
export type SenlerAppActionResultKind = (typeof SENLER_APP_ACTION_RESULT_KINDS)[number];
export interface SenlerAppActionResultMetadata {
    kind: SenlerAppActionResultKind;
    configuration_path?: string;
    branches_path?: string;
}
/**
 * Framework-neutral value written to an OpenAPI operation under
 * `x-senler-app-action`.
 */
export interface SenlerAppActionMetadata {
    version: typeof SENLER_APP_ACTION_CONTRACT_VERSION;
    name: string;
    context: SenlerAppActionContext;
    description: string;
    read_only?: boolean;
    destructive?: boolean;
    idempotent?: boolean;
    result?: SenlerAppActionResultMetadata;
}
export interface SenlerAppActionDefinition {
    name: string;
    context: SenlerAppActionContext;
    description: string;
    readOnly?: boolean;
    destructive?: boolean;
    idempotent?: boolean;
    result?: SenlerAppActionResultMetadata;
}
export declare function createSenlerAppActionMetadata(definition: SenlerAppActionDefinition): SenlerAppActionMetadata;
