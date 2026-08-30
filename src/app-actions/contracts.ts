export const SENLER_APP_ACTION_EXTENSION = 'x-senler-app-action' as const;
export const SENLER_APP_ACTION_CONTRACT_VERSION = 1 as const;

export const SENLER_APP_ACTION_CONTEXTS = ['app', 'agent_tool', 'automation_step'] as const;
export type SenlerAppActionContext = (typeof SENLER_APP_ACTION_CONTEXTS)[number];

export const SENLER_APP_ACTION_RESULT_KINDS = [
  'data',
  'agent_tool_configuration',
  'automation_step_configuration',
] as const;
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

const ACTION_NAME_PATTERN = /^[a-z][a-z0-9_]{1,63}$/u;
const RESULT_PATH_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*$/u;

export function createSenlerAppActionMetadata(
  definition: SenlerAppActionDefinition,
): SenlerAppActionMetadata {
  const name = definition.name.trim();
  const description = definition.description.trim();
  if (!ACTION_NAME_PATTERN.test(name)) {
    throw new TypeError(
      'App action name must start with a letter and contain 2-64 lowercase letters, digits, or underscores',
    );
  }
  if (!SENLER_APP_ACTION_CONTEXTS.includes(definition.context)) {
    throw new TypeError(`Unsupported app action context '${String(definition.context)}'`);
  }
  if (!description) {
    throw new TypeError('App action description must not be empty');
  }
  validateResultMetadata(definition.context, definition.result);

  return {
    version: SENLER_APP_ACTION_CONTRACT_VERSION,
    name,
    context: definition.context,
    description,
    ...(definition.readOnly !== undefined ? { read_only: definition.readOnly } : {}),
    ...(definition.destructive !== undefined ? { destructive: definition.destructive } : {}),
    ...(definition.idempotent !== undefined ? { idempotent: definition.idempotent } : {}),
    ...(definition.result ? { result: { ...definition.result } } : {}),
  };
}

function validateResultMetadata(
  context: SenlerAppActionContext,
  result: SenlerAppActionResultMetadata | undefined,
): void {
  if (!result) return;
  if (!SENLER_APP_ACTION_RESULT_KINDS.includes(result.kind)) {
    throw new TypeError(`Unsupported app action result kind '${String(result.kind)}'`);
  }
  if (context === 'agent_tool' && result.kind !== 'agent_tool_configuration') {
    throw new TypeError('An agent_tool action must return agent_tool_configuration');
  }
  if (context === 'automation_step' && result.kind !== 'automation_step_configuration') {
    throw new TypeError('An automation_step action must return automation_step_configuration');
  }
  for (const [name, value] of [
    ['configuration_path', result.configuration_path],
    ['branches_path', result.branches_path],
  ] as const) {
    if (value !== undefined && !RESULT_PATH_PATTERN.test(value)) {
      throw new TypeError(`App action ${name} is not a valid dotted response path`);
    }
  }
}
