"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SENLER_APP_ACTION_RESULT_KINDS = exports.SENLER_APP_ACTION_CONTEXTS = exports.SENLER_APP_ACTION_CONTRACT_VERSION = exports.SENLER_APP_ACTION_EXTENSION = void 0;
exports.createSenlerAppActionMetadata = createSenlerAppActionMetadata;
exports.SENLER_APP_ACTION_EXTENSION = 'x-senler-app-action';
exports.SENLER_APP_ACTION_CONTRACT_VERSION = 1;
exports.SENLER_APP_ACTION_CONTEXTS = ['app', 'agent_tool', 'automation_step'];
exports.SENLER_APP_ACTION_RESULT_KINDS = [
    'data',
    'agent_tool_configuration',
    'automation_step_configuration',
];
const ACTION_NAME_PATTERN = /^[a-z][a-z0-9_]{1,63}$/u;
const RESULT_PATH_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*$/u;
function createSenlerAppActionMetadata(definition) {
    const name = definition.name.trim();
    const description = definition.description.trim();
    if (!ACTION_NAME_PATTERN.test(name)) {
        throw new TypeError('App action name must start with a letter and contain 2-64 lowercase letters, digits, or underscores');
    }
    if (!exports.SENLER_APP_ACTION_CONTEXTS.includes(definition.context)) {
        throw new TypeError(`Unsupported app action context '${String(definition.context)}'`);
    }
    if (!description) {
        throw new TypeError('App action description must not be empty');
    }
    validateResultMetadata(definition.context, definition.result);
    return {
        version: exports.SENLER_APP_ACTION_CONTRACT_VERSION,
        name,
        context: definition.context,
        description,
        ...(definition.readOnly !== undefined ? { read_only: definition.readOnly } : {}),
        ...(definition.destructive !== undefined ? { destructive: definition.destructive } : {}),
        ...(definition.idempotent !== undefined ? { idempotent: definition.idempotent } : {}),
        ...(definition.result ? { result: { ...definition.result } } : {}),
    };
}
function validateResultMetadata(context, result) {
    if (!result)
        return;
    if (!exports.SENLER_APP_ACTION_RESULT_KINDS.includes(result.kind)) {
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
    ]) {
        if (value !== undefined && !RESULT_PATH_PATTERN.test(value)) {
            throw new TypeError(`App action ${name} is not a valid dotted response path`);
        }
    }
}
