"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SenlerAppAction = SenlerAppAction;
exports.AppAction = AppAction;
exports.AgentToolConfigurator = AgentToolConfigurator;
exports.AutomationStepConfigurator = AutomationStepConfigurator;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("./contracts");
/** Marks a NestJS operation as callable through the Senler app action gateway. */
function SenlerAppAction(options) {
    const metadata = (0, contracts_1.createSenlerAppActionMetadata)(options);
    const decorators = [(0, swagger_1.ApiExtension)(contracts_1.SENLER_APP_ACTION_EXTENSION, metadata)];
    if (options.response) {
        decorators.push((0, swagger_1.ApiResponse)({
            status: options.response.status ?? 200,
            ...(options.response.type ? { type: options.response.type } : {}),
            ...(options.response.isArray !== undefined ? { isArray: options.response.isArray } : {}),
            ...(options.response.description ? { description: options.response.description } : {}),
        }));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
/** A regular installed-application action, including embedded settings pages. */
function AppAction(options) {
    return SenlerAppAction({
        ...options,
        context: 'app',
        result: options.result ?? { kind: 'data' },
    });
}
/** Builds normalized configuration for an installed tool in an agent. */
function AgentToolConfigurator(options) {
    return SenlerAppAction({
        ...options,
        context: 'agent_tool',
        readOnly: false,
        destructive: false,
        result: {
            kind: 'agent_tool_configuration',
            configuration_path: options.configurationPath ?? 'result.configuration',
        },
    });
}
/** Builds normalized configuration for an installed step in an automation. */
function AutomationStepConfigurator(options) {
    return SenlerAppAction({
        ...options,
        context: 'automation_step',
        readOnly: false,
        destructive: false,
        result: {
            kind: 'automation_step_configuration',
            configuration_path: options.configurationPath ?? 'result.configuration',
            branches_path: options.branchesPath ?? 'result.branches',
        },
    });
}
