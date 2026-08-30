"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAppActionOpenApiDocument = validateAppActionOpenApiDocument;
exports.assertValidAppActionOpenApiDocument = assertValidAppActionOpenApiDocument;
const contracts_1 = require("./contracts");
const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete'];
const ACTION_NAME_PATTERN = /^[a-z][a-z0-9_]{1,63}$/u;
function isRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function readString(value) {
    return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}
function validateAppActionOpenApiDocument(document) {
    const issues = [];
    const actions = [];
    if (!isRecord(document) || !isRecord(document.paths)) {
        issues.push({
            level: 'error',
            code: 'invalid_openapi_document',
            message: 'The value is not an OpenAPI document with a paths object',
            location: '$',
        });
        return { valid: false, actions, issues };
    }
    const names = new Map();
    for (const [path, pathItemValue] of Object.entries(document.paths)) {
        if (!isRecord(pathItemValue))
            continue;
        for (const method of HTTP_METHODS) {
            const operation = pathItemValue[method];
            if (!isRecord(operation) || operation[contracts_1.SENLER_APP_ACTION_EXTENSION] === undefined)
                continue;
            const location = `paths.${path}.${method}`;
            const metadata = readMetadata(operation[contracts_1.SENLER_APP_ACTION_EXTENSION], location, issues);
            if (!metadata)
                continue;
            const previousLocation = names.get(metadata.name);
            if (previousLocation) {
                issues.push({
                    level: 'error',
                    code: 'duplicate_action_name',
                    message: `Action '${metadata.name}' is already declared at ${previousLocation}`,
                    location,
                });
            }
            else {
                names.set(metadata.name, location);
            }
            validateParameters(document, pathItemValue, operation, location, issues);
            validateRequestBody(document, operation, location, issues);
            const responseSchema = validateResponse(document, operation, location, issues);
            validateResultPaths(document, responseSchema, metadata, location, issues);
            actions.push({ name: metadata.name, context: metadata.context, method, path, metadata });
        }
    }
    if (actions.length === 0) {
        issues.push({
            level: 'warning',
            code: 'no_app_actions',
            message: `No operations contain ${contracts_1.SENLER_APP_ACTION_EXTENSION}`,
            location: 'paths',
        });
    }
    return { valid: !issues.some((issue) => issue.level === 'error'), actions, issues };
}
function assertValidAppActionOpenApiDocument(document) {
    const result = validateAppActionOpenApiDocument(document);
    if (!result.valid) {
        const message = result.issues
            .filter((issue) => issue.level === 'error')
            .map((issue) => `${issue.location}: ${issue.message}`)
            .join('\n');
        throw new Error(`Invalid Senler app action OpenAPI contract:\n${message}`);
    }
    return result.actions;
}
function readMetadata(value, location, issues) {
    if (!isRecord(value)) {
        issues.push({
            level: 'error',
            code: 'invalid_extension',
            message: `${contracts_1.SENLER_APP_ACTION_EXTENSION} must be an object`,
            location,
        });
        return null;
    }
    const name = readString(value.name);
    const context = readString(value.context);
    const description = readString(value.description);
    if (!name || !ACTION_NAME_PATTERN.test(name)) {
        issues.push({
            level: 'error',
            code: 'invalid_action_name',
            message: 'Action name must contain 2-64 lowercase letters, digits, or underscores',
            location,
        });
    }
    if (!context || !contracts_1.SENLER_APP_ACTION_CONTEXTS.includes(context)) {
        issues.push({
            level: 'error',
            code: 'invalid_context',
            message: `Context must be one of: ${contracts_1.SENLER_APP_ACTION_CONTEXTS.join(', ')}`,
            location,
        });
    }
    if (!description) {
        issues.push({
            level: 'error',
            code: 'missing_description',
            message: 'Action description is required for method discovery',
            location,
        });
    }
    if (value.version !== contracts_1.SENLER_APP_ACTION_CONTRACT_VERSION) {
        issues.push({
            level: 'error',
            code: 'unsupported_contract_version',
            message: `Only contract version ${contracts_1.SENLER_APP_ACTION_CONTRACT_VERSION} is supported`,
            location,
        });
    }
    const result = readResultMetadata(value.result, context, location, issues);
    if ((context === 'agent_tool' || context === 'automation_step') && !result) {
        issues.push({
            level: 'error',
            code: 'missing_configurator_result',
            message: `${context} actions must declare their normalized result contract`,
            location,
        });
    }
    if (!name || !context || !description)
        return null;
    return {
        version: contracts_1.SENLER_APP_ACTION_CONTRACT_VERSION,
        name,
        context: context,
        description,
        ...(typeof value.read_only === 'boolean' ? { read_only: value.read_only } : {}),
        ...(typeof value.destructive === 'boolean' ? { destructive: value.destructive } : {}),
        ...(typeof value.idempotent === 'boolean' ? { idempotent: value.idempotent } : {}),
        ...(result ? { result } : {}),
    };
}
function readResultMetadata(value, context, location, issues) {
    if (value === undefined)
        return undefined;
    if (!isRecord(value) || !contracts_1.SENLER_APP_ACTION_RESULT_KINDS.includes(value.kind)) {
        issues.push({
            level: 'error',
            code: 'invalid_result_metadata',
            message: `Result kind must be one of: ${contracts_1.SENLER_APP_ACTION_RESULT_KINDS.join(', ')}`,
            location,
        });
        return undefined;
    }
    const kind = value.kind;
    if (context === 'agent_tool' && kind !== 'agent_tool_configuration') {
        issues.push({
            level: 'error',
            code: 'invalid_agent_tool_result',
            message: 'agent_tool actions must declare agent_tool_configuration results',
            location,
        });
    }
    if (context === 'automation_step' && kind !== 'automation_step_configuration') {
        issues.push({
            level: 'error',
            code: 'invalid_automation_step_result',
            message: 'automation_step actions must declare automation_step_configuration results',
            location,
        });
    }
    return {
        kind,
        ...(readString(value.configuration_path)
            ? { configuration_path: readString(value.configuration_path) }
            : {}),
        ...(readString(value.branches_path) ? { branches_path: readString(value.branches_path) } : {}),
    };
}
function validateParameters(document, pathItem, operation, location, issues) {
    const parameters = [pathItem.parameters, operation.parameters].flatMap((entry) => Array.isArray(entry) ? entry : []);
    for (const rawParameter of parameters) {
        const parameter = resolveRecord(document, rawParameter);
        const parameterName = readString(parameter.name);
        if (parameterName === 'project_id') {
            issues.push({
                level: 'error',
                code: 'project_id_in_action_schema',
                message: 'project_id is MCP invocation context and must not be an application parameter',
                location,
            });
        }
        if (parameter.in !== 'path' && parameter.in !== 'query') {
            issues.push({
                level: 'error',
                code: 'unsupported_parameter_location',
                message: `Only path and query parameters are supported; found '${String(parameter.in)}'`,
                location,
            });
        }
    }
}
function validateRequestBody(document, operation, location, issues) {
    if (operation.requestBody === undefined)
        return;
    const requestBody = resolveRecord(document, operation.requestBody);
    const content = isRecord(requestBody.content) ? requestBody.content : {};
    const jsonContent = isRecord(content['application/json']) ? content['application/json'] : null;
    if (!jsonContent) {
        issues.push({
            level: 'error',
            code: 'unsupported_request_body',
            message: 'App actions currently require application/json request bodies',
            location,
        });
        return;
    }
    const schema = resolveSchema(document, jsonContent.schema);
    if (schema.type !== 'object' && !isRecord(schema.properties)) {
        issues.push({
            level: 'error',
            code: 'non_object_request_body',
            message: 'App action request body must be an object schema',
            location,
        });
    }
    if (isRecord(schema.properties) &&
        Object.prototype.hasOwnProperty.call(schema.properties, 'project_id')) {
        issues.push({
            level: 'error',
            code: 'project_id_in_action_schema',
            message: 'project_id is MCP invocation context and must not be an application body field',
            location,
        });
    }
}
function validateResponse(document, operation, location, issues) {
    if (!isRecord(operation.responses)) {
        pushMissingResponse(location, issues);
        return null;
    }
    const responses = Object.entries(operation.responses)
        .filter(([status]) => /^2\d\d$/u.test(status))
        .sort(([left], [right]) => Number(left) - Number(right));
    for (const [, rawResponse] of responses) {
        const response = resolveRecord(document, rawResponse);
        const content = isRecord(response.content) ? response.content : {};
        const jsonMedia = Object.entries(content).find(([mediaType, media]) => mediaType.toLowerCase().includes('json') && isRecord(media))?.[1];
        if (!isRecord(jsonMedia))
            continue;
        const schema = resolveSchema(document, jsonMedia.schema);
        if (!schemaHasShape(document, schema)) {
            issues.push({
                level: 'error',
                code: 'empty_response_schema',
                message: 'Successful JSON response schema must describe its fields or value type',
                location,
            });
        }
        return schema;
    }
    pushMissingResponse(location, issues);
    return null;
}
function pushMissingResponse(location, issues) {
    issues.push({
        level: 'error',
        code: 'missing_success_response',
        message: 'App action must declare a successful JSON response schema',
        location,
    });
}
function validateResultPaths(document, responseSchema, metadata, location, issues) {
    if (!responseSchema || !metadata.result)
        return;
    for (const [field, path] of [
        ['configuration_path', metadata.result.configuration_path],
        ['branches_path', metadata.result.branches_path],
    ]) {
        if (path && !schemaContainsPath(document, responseSchema, path)) {
            issues.push({
                level: 'error',
                code: 'missing_result_path',
                message: `${field} '${path}' is absent from the successful response schema`,
                location,
            });
        }
    }
}
function schemaContainsPath(document, schema, path) {
    let current = resolveSchema(document, schema);
    for (const segment of path.split('.')) {
        const properties = isRecord(current.properties) ? current.properties : {};
        if (!(segment in properties))
            return false;
        current = resolveSchema(document, properties[segment]);
    }
    return true;
}
function schemaHasShape(document, schema) {
    const resolved = resolveSchema(document, schema);
    if (typeof resolved.type === 'string' &&
        resolved.type !== 'object' &&
        resolved.type !== 'array') {
        return true;
    }
    if (resolved.type === 'array' || resolved.items !== undefined) {
        return schemaHasShape(document, resolveSchema(document, resolved.items));
    }
    return isRecord(resolved.properties) && Object.keys(resolved.properties).length > 0;
}
function resolveSchema(document, value, seen = new Set()) {
    const schema = resolveRecord(document, value, seen);
    if (Array.isArray(schema.allOf)) {
        const parts = schema.allOf.map((part) => resolveSchema(document, part, new Set(seen)));
        return {
            ...schema,
            type: 'object',
            properties: Object.assign({}, ...parts.map((part) => (isRecord(part.properties) ? part.properties : {}))),
        };
    }
    return schema;
}
function resolveRecord(document, value, seen = new Set()) {
    if (!isRecord(value))
        return {};
    const reference = readString(value.$ref);
    if (!reference || !reference.startsWith('#/') || seen.has(reference))
        return value;
    seen.add(reference);
    const resolved = reference
        .slice(2)
        .split('/')
        .reduce((current, segment) => {
        if (!isRecord(current))
            return undefined;
        return current[segment.replace(/~1/gu, '/').replace(/~0/gu, '~')];
    }, document);
    return resolveRecord(document, resolved, seen);
}
