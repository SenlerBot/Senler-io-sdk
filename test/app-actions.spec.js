const assert = require('node:assert/strict');
const test = require('node:test');
require('reflect-metadata');

const {
  createSenlerAppActionMetadata,
  validateAppActionOpenApiDocument,
} = require('../dist/app-actions');
const { Controller, Module, Post } = require('@nestjs/common');
const { NestFactory } = require('@nestjs/core');
const { ApiProperty, SwaggerModule } = require('@nestjs/swagger');
const { AutomationStepConfigurator } = require('../dist/app-actions/nest');

function documentFor(extension, requestSchema = { type: 'object', properties: {} }) {
  return {
    openapi: '3.0.0',
    paths: {
      '/api/configurator': {
        post: {
          'x-senler-app-action': extension,
          requestBody: {
            content: { 'application/json': { schema: requestSchema } },
          },
          responses: {
            201: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      result: {
                        type: 'object',
                        properties: {
                          configuration: {
                            type: 'object',
                            properties: { campaign_id: { type: 'string' } },
                          },
                          branches: { type: 'array', items: { type: 'string' } },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
}

test('creates a versioned OpenAPI extension', () => {
  const metadata = createSenlerAppActionMetadata({
    name: 'configure_automation_step',
    context: 'automation_step',
    description: 'Build automation step configuration.',
    result: {
      kind: 'automation_step_configuration',
      configuration_path: 'result.configuration',
      branches_path: 'result.branches',
    },
  });

  assert.equal(metadata.version, 1);
  assert.equal(metadata.context, 'automation_step');
});

test('accepts a complete configurator contract', () => {
  const metadata = createSenlerAppActionMetadata({
    name: 'configure_automation_step',
    context: 'automation_step',
    description: 'Build automation step configuration.',
    result: {
      kind: 'automation_step_configuration',
      configuration_path: 'result.configuration',
      branches_path: 'result.branches',
    },
  });
  const result = validateAppActionOpenApiDocument(documentFor(metadata));

  assert.equal(result.valid, true, JSON.stringify(result.issues));
  assert.equal(result.actions.length, 1);
});

test('rejects project_id and a result path missing from the response', () => {
  const metadata = createSenlerAppActionMetadata({
    name: 'configure_tool',
    context: 'agent_tool',
    description: 'Build agent tool configuration.',
    result: {
      kind: 'agent_tool_configuration',
      configuration_path: 'result.missing',
    },
  });
  const result = validateAppActionOpenApiDocument(
    documentFor(metadata, {
      type: 'object',
      properties: { project_id: { type: 'string' } },
    }),
  );

  assert.equal(result.valid, false);
  assert.deepEqual(
    result.issues
      .filter((issue) => issue.level === 'error')
      .map((issue) => issue.code)
      .sort(),
    ['missing_result_path', 'project_id_in_action_schema'],
  );
});

test('NestJS decorator emits the universal extension and response schema', async () => {
  class ConfigurationDto {}
  ApiProperty({ type: String })(ConfigurationDto.prototype, 'campaign_id');

  class ResultDto {}
  ApiProperty({ type: ConfigurationDto })(ResultDto.prototype, 'configuration');
  ApiProperty({ type: [String] })(ResultDto.prototype, 'branches');

  class ResponseDto {}
  ApiProperty({ type: ResultDto })(ResponseDto.prototype, 'result');

  class ConfiguratorController {
    configure() {
      return undefined;
    }
  }
  const descriptor = Object.getOwnPropertyDescriptor(ConfiguratorController.prototype, 'configure');
  Post('automation-step')(ConfiguratorController.prototype, 'configure', descriptor);
  AutomationStepConfigurator({
    name: 'configure_automation_step',
    description: 'Build normalized automation-step configuration.',
    response: { status: 201, type: ResponseDto },
  })(ConfiguratorController.prototype, 'configure', descriptor);
  Controller('api/configurators')(ConfiguratorController);

  class TestModule {}
  Module({ controllers: [ConfiguratorController] })(TestModule);
  const app = await NestFactory.create(TestModule, { logger: false });
  try {
    const document = SwaggerModule.createDocument(app, {
      openapi: '3.0.0',
      info: { title: 'test', version: '1' },
    });
    const operation = document.paths['/api/configurators/automation-step'].post;
    assert.deepEqual(operation['x-senler-app-action'], {
      version: 1,
      name: 'configure_automation_step',
      context: 'automation_step',
      description: 'Build normalized automation-step configuration.',
      read_only: false,
      destructive: false,
      result: {
        kind: 'automation_step_configuration',
        configuration_path: 'result.configuration',
        branches_path: 'result.branches',
      },
    });
    assert.ok(operation.responses[201]);
    const validation = validateAppActionOpenApiDocument(document);
    assert.equal(validation.valid, true, JSON.stringify(validation.issues));
  } finally {
    await app.close();
  }
});
