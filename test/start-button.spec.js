const assert = require('node:assert/strict');
const test = require('node:test');
const { AiSenlerClient, AutomationNodeConfigDtoFromJSON } = require('../dist');

const automationId = '507f1f77bcf86cd799439011';
const nodeId = '550e8400-e29b-41d4-a716-446655440001';
const channelId = '550e8400-e29b-41d4-a716-446655440002';

function recordingClient(requests) {
  return new AiSenlerClient({
    accessToken: 'test-token',
    baseUrl: 'https://api.senler.example',
    fetchApi: async (url, init) => {
      requests.push({ url, method: init.method, body: JSON.parse(init.body) });
      return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } });
    },
  });
}

for (const [mode, value, caseSensitive] of [
  ['equals', 'rfc_campaign', true],
  ['starts_with', 'rfc_campaign_', true],
  ['contains', 'Campaign', false],
]) {
  test(`batch requests preserve Start filters: ${mode}`, async () => {
    const requests = [];
    const client = recordingClient(requests);

    await client.automations.batchRaw({
      automationId,
      applyAutomationBatchDto: {
        operationId: '550e8400-e29b-41d4-a716-446655440003',
        expectedDraftRevision: 1,
        operations: [{
          kind: 'add_node',
          nodeId,
          nodeType: 'trigger.start_button',
          config: {
            startButtonMatchMode: mode,
            startButtonValues: [value],
            caseSensitive,
            channelIds: [channelId],
            dialogScope: 'all',
            runReentryMode: 'parallel',
          },
        }],
      },
    });

    assert.equal(requests.length, 1);
    assert.equal(requests[0].url, `https://api.senler.example/api/automations/${automationId}/batch`);
    assert.deepEqual(requests[0].body.operations[0], {
      kind: 'add_node',
      node_id: nodeId,
      node_type: 'trigger.start_button',
      config: {
        start_button_match_mode: mode,
        start_button_values: [value],
        case_sensitive: caseSensitive,
        channel_ids: [channelId],
        dialog_scope: 'all',
        run_reentry_mode: 'parallel',
      },
    });
  });
}

test('reading a Start configuration preserves filters and case sensitivity', () => {
  const config = AutomationNodeConfigDtoFromJSON({
    start_button_match_mode: 'starts_with',
    start_button_values: ['rfc_campaign_'],
    case_sensitive: false,
  });

  assert.equal(config.startButtonMatchMode, 'starts_with');
  assert.deepEqual(config.startButtonValues, ['rfc_campaign_']);
  assert.equal(config.caseSensitive, false);
});

test('trigger test requests preserve the Start parameter', async () => {
  const requests = [];
  const client = recordingClient(requests);

  await client.automations.testTriggerSessionsEventsRaw({
    automationId,
    sessionId: '507f1f77bcf86cd799439012',
    simulateAutomationTriggerTestEventDto: {
      eventType: 'bot_started',
      payload: { startPayload: 'rfc_campaign_123' },
    },
  });

  assert.equal(requests.length, 1);
  assert.deepEqual(requests[0].body, {
    event_type: 'bot_started',
    payload: { start_payload: 'rfc_campaign_123' },
  });
});
