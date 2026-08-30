import { type SenlerAppActionMetadata } from './contracts';
export interface AppActionOpenApiAction {
    name: string;
    context: string;
    method: string;
    path: string;
    metadata: SenlerAppActionMetadata;
}
export interface AppActionOpenApiValidationIssue {
    level: 'error' | 'warning';
    code: string;
    message: string;
    location: string;
}
export interface AppActionOpenApiValidationResult {
    valid: boolean;
    actions: AppActionOpenApiAction[];
    issues: AppActionOpenApiValidationIssue[];
}
export declare function validateAppActionOpenApiDocument(document: unknown): AppActionOpenApiValidationResult;
export declare function assertValidAppActionOpenApiDocument(document: unknown): AppActionOpenApiAction[];
