import { applyDecorators, type Type } from '@nestjs/common';
import { ApiExtension, ApiResponse } from '@nestjs/swagger';
import {
  SENLER_APP_ACTION_EXTENSION,
  createSenlerAppActionMetadata,
  type SenlerAppActionDefinition,
  type SenlerAppActionResultMetadata,
} from './contracts';

export interface AppActionResponseDefinition {
  status?: number;
  type?: Type<unknown> | Function;
  isArray?: boolean;
  description?: string;
}

export interface SenlerAppActionOptions extends SenlerAppActionDefinition {
  response?: AppActionResponseDefinition;
}

export type AppActionOptions = Omit<SenlerAppActionOptions, 'context' | 'result'> & {
  result?: SenlerAppActionResultMetadata;
};

export type AppConfiguratorOptions = Omit<
  SenlerAppActionOptions,
  'context' | 'result' | 'readOnly' | 'destructive'
> & {
  configurationPath?: string;
};

export type AutomationAppConfiguratorOptions = AppConfiguratorOptions & {
  branchesPath?: string;
};

/** Marks a NestJS operation as callable through the Senler app action gateway. */
export function SenlerAppAction(options: SenlerAppActionOptions): MethodDecorator {
  const metadata = createSenlerAppActionMetadata(options);
  const decorators: MethodDecorator[] = [ApiExtension(SENLER_APP_ACTION_EXTENSION, metadata)];
  if (options.response) {
    decorators.push(
      ApiResponse({
        status: options.response.status ?? 200,
        ...(options.response.type ? { type: options.response.type as Type<unknown> } : {}),
        ...(options.response.isArray !== undefined ? { isArray: options.response.isArray } : {}),
        ...(options.response.description ? { description: options.response.description } : {}),
      }),
    );
  }
  return applyDecorators(...decorators);
}

/** A regular installed-application action, including embedded settings pages. */
export function AppAction(options: AppActionOptions): MethodDecorator {
  return SenlerAppAction({
    ...options,
    context: 'app',
    result: options.result ?? { kind: 'data' },
  });
}

/** Builds normalized configuration for an installed tool in an agent. */
export function AgentToolConfigurator(options: AppConfiguratorOptions): MethodDecorator {
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
export function AutomationStepConfigurator(
  options: AutomationAppConfiguratorOptions,
): MethodDecorator {
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
