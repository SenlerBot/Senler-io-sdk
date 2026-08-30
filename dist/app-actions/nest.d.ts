import { type Type } from '@nestjs/common';
import { type SenlerAppActionDefinition, type SenlerAppActionResultMetadata } from './contracts';
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
export type AppConfiguratorOptions = Omit<SenlerAppActionOptions, 'context' | 'result' | 'readOnly' | 'destructive'> & {
    configurationPath?: string;
};
export type AutomationAppConfiguratorOptions = AppConfiguratorOptions & {
    branchesPath?: string;
};
/** Marks a NestJS operation as callable through the Senler app action gateway. */
export declare function SenlerAppAction(options: SenlerAppActionOptions): MethodDecorator;
/** A regular installed-application action, including embedded settings pages. */
export declare function AppAction(options: AppActionOptions): MethodDecorator;
/** Builds normalized configuration for an installed tool in an agent. */
export declare function AgentToolConfigurator(options: AppConfiguratorOptions): MethodDecorator;
/** Builds normalized configuration for an installed step in an automation. */
export declare function AutomationStepConfigurator(options: AutomationAppConfiguratorOptions): MethodDecorator;
