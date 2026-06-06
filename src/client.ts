import { Configuration } from './generated/runtime';
import type { FetchAPI } from './generated/runtime';
import { createAuthMiddleware } from './auth';
import type { TokenState } from './auth';
import type { AiSenlerClientConfig } from './types';

import { AccessApi } from './generated/apis/AccessApi';
import { AccessInvitationsApi } from './generated/apis/AccessInvitationsApi';
import { AgentAssignmentRulesApi } from './generated/apis/AgentAssignmentRulesApi';
import { AgentsApi } from './generated/apis/AgentsApi';
import { AgentsAvatarApi } from './generated/apis/AgentsAvatarApi';
import { AgentTrainingApi } from './generated/apis/AgentTrainingApi';
import { AnalyticsApi } from './generated/apis/AnalyticsApi';
import { AppCatalogApi } from './generated/apis/AppCatalogApi';
import { AppsApi } from './generated/apis/AppsApi';
import { AttachmentsApi } from './generated/apis/AttachmentsApi';
import { AuditApi } from './generated/apis/AuditApi';
import { BillingApi } from './generated/apis/BillingApi';
import { ChannelsApi } from './generated/apis/ChannelsApi';
import { ChannelsAvitoApi } from './generated/apis/ChannelsAvitoApi';
import { ChannelsDiscordApi } from './generated/apis/ChannelsDiscordApi';
import { ChannelsEmailApi } from './generated/apis/ChannelsEmailApi';
import { ChannelsHistoryApi } from './generated/apis/ChannelsHistoryApi';
import { ChannelsMAXApi } from './generated/apis/ChannelsMAXApi';
import { ChannelsTelegramApi } from './generated/apis/ChannelsTelegramApi';
import { ChannelsVKApi } from './generated/apis/ChannelsVKApi';
import { ChannelsWidgetApi } from './generated/apis/ChannelsWidgetApi';
import { CountriesApi } from './generated/apis/CountriesApi';
import { DataSourcesApi } from './generated/apis/DataSourcesApi';
import { DialogsApi } from './generated/apis/DialogsApi';
import { DialogsManagementApi } from './generated/apis/DialogsManagementApi';
import { DialogsMessagingApi } from './generated/apis/DialogsMessagingApi';
import { EventsApi } from './generated/apis/EventsApi';
import { FrontendVersionApi } from './generated/apis/FrontendVersionApi';
import { KnowledgeBaseApi } from './generated/apis/KnowledgeBaseApi';
import { LeadsApi } from './generated/apis/LeadsApi';
import { LeadVariableDefinitionsApi } from './generated/apis/LeadVariableDefinitionsApi';
import { LeadVariablesApi } from './generated/apis/LeadVariablesApi';
import { MCPExternalUserCredentialsApi } from './generated/apis/MCPExternalUserCredentialsApi';
import { MCPServersApi } from './generated/apis/MCPServersApi';
import { MetricsConfigApi } from './generated/apis/MetricsConfigApi';
import { MetricsDefinitionsApi } from './generated/apis/MetricsDefinitionsApi';
import { ModelsApi } from './generated/apis/ModelsApi';
import { OAuthApi } from './generated/apis/OAuthApi';
import { PlatformsApi } from './generated/apis/PlatformsApi';
import { ProcessesApi } from './generated/apis/ProcessesApi';
import { ProjectsApi } from './generated/apis/ProjectsApi';
import { ProjectsAvatarApi } from './generated/apis/ProjectsAvatarApi';
import { ProjectVariablesApi } from './generated/apis/ProjectVariablesApi';
import { ReadyMCPServersApi } from './generated/apis/ReadyMCPServersApi';
import { SpacesApi } from './generated/apis/SpacesApi';
import { StorageApi } from './generated/apis/StorageApi';
import { TariffsApi } from './generated/apis/TariffsApi';

const DEFAULT_BASE_URL = 'https://api.senler.io';

export class AiSenlerClient {
  private readonly tokenState: TokenState;

  readonly access: AccessApi;
  readonly accessInvitations: AccessInvitationsApi;
  readonly agentAssignmentRules: AgentAssignmentRulesApi;
  readonly agents: AgentsApi;
  readonly agentsAvatar: AgentsAvatarApi;
  readonly agentTraining: AgentTrainingApi;
  readonly analytics: AnalyticsApi;
  readonly appCatalog: AppCatalogApi;
  readonly apps: AppsApi;
  readonly attachments: AttachmentsApi;
  readonly audit: AuditApi;
  readonly billing: BillingApi;
  readonly channels: ChannelsApi;
  readonly channelsAvito: ChannelsAvitoApi;
  readonly channelsDiscord: ChannelsDiscordApi;
  readonly channelsEmail: ChannelsEmailApi;
  readonly channelsHistory: ChannelsHistoryApi;
  readonly channelsMAX: ChannelsMAXApi;
  readonly channelsTelegram: ChannelsTelegramApi;
  readonly channelsVK: ChannelsVKApi;
  readonly channelsWidget: ChannelsWidgetApi;
  readonly countries: CountriesApi;
  readonly dataSources: DataSourcesApi;
  readonly dialogs: DialogsApi;
  readonly dialogsManagement: DialogsManagementApi;
  readonly dialogsMessaging: DialogsMessagingApi;
  readonly events: EventsApi;
  readonly frontendVersion: FrontendVersionApi;
  readonly knowledgeBase: KnowledgeBaseApi;
  readonly leads: LeadsApi;
  readonly leadVariableDefinitions: LeadVariableDefinitionsApi;
  readonly leadVariables: LeadVariablesApi;
  readonly mcpExternalUserCredentials: MCPExternalUserCredentialsApi;
  readonly mcpServers: MCPServersApi;
  readonly metricsConfig: MetricsConfigApi;
  readonly metricsDefinitions: MetricsDefinitionsApi;
  readonly models: ModelsApi;
  readonly oAuth: OAuthApi;
  readonly platforms: PlatformsApi;
  readonly processes: ProcessesApi;
  readonly projects: ProjectsApi;
  readonly projectsAvatar: ProjectsAvatarApi;
  readonly projectVariables: ProjectVariablesApi;
  readonly readyMCPServers: ReadyMCPServersApi;
  readonly spaces: SpacesApi;
  readonly storage: StorageApi;
  readonly tariffs: TariffsApi;

  constructor(config: AiSenlerClientConfig & { fetchApi?: FetchAPI }) {
    this.tokenState = {
      accessToken: config.accessToken,
      refreshToken: config.refreshToken,
      clientId: config.clientId,
    };

    const basePath = (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, '');

    const configuration = new Configuration({
      basePath,
      fetchApi: config.fetchApi,
      middleware: [
        createAuthMiddleware({
          tokenState: this.tokenState,
          basePath,
          fetchApi: config.fetchApi,
          onTokenRefreshed: config.onTokenRefreshed,
        }),
      ],
    });

    this.access = new AccessApi(configuration);
    this.accessInvitations = new AccessInvitationsApi(configuration);
    this.agentAssignmentRules = new AgentAssignmentRulesApi(configuration);
    this.agents = new AgentsApi(configuration);
    this.agentsAvatar = new AgentsAvatarApi(configuration);
    this.agentTraining = new AgentTrainingApi(configuration);
    this.analytics = new AnalyticsApi(configuration);
    this.appCatalog = new AppCatalogApi(configuration);
    this.apps = new AppsApi(configuration);
    this.attachments = new AttachmentsApi(configuration);
    this.audit = new AuditApi(configuration);
    this.billing = new BillingApi(configuration);
    this.channels = new ChannelsApi(configuration);
    this.channelsAvito = new ChannelsAvitoApi(configuration);
    this.channelsDiscord = new ChannelsDiscordApi(configuration);
    this.channelsEmail = new ChannelsEmailApi(configuration);
    this.channelsHistory = new ChannelsHistoryApi(configuration);
    this.channelsMAX = new ChannelsMAXApi(configuration);
    this.channelsTelegram = new ChannelsTelegramApi(configuration);
    this.channelsVK = new ChannelsVKApi(configuration);
    this.channelsWidget = new ChannelsWidgetApi(configuration);
    this.countries = new CountriesApi(configuration);
    this.dataSources = new DataSourcesApi(configuration);
    this.dialogs = new DialogsApi(configuration);
    this.dialogsManagement = new DialogsManagementApi(configuration);
    this.dialogsMessaging = new DialogsMessagingApi(configuration);
    this.events = new EventsApi(configuration);
    this.frontendVersion = new FrontendVersionApi(configuration);
    this.knowledgeBase = new KnowledgeBaseApi(configuration);
    this.leads = new LeadsApi(configuration);
    this.leadVariableDefinitions = new LeadVariableDefinitionsApi(configuration);
    this.leadVariables = new LeadVariablesApi(configuration);
    this.mcpExternalUserCredentials = new MCPExternalUserCredentialsApi(configuration);
    this.mcpServers = new MCPServersApi(configuration);
    this.metricsConfig = new MetricsConfigApi(configuration);
    this.metricsDefinitions = new MetricsDefinitionsApi(configuration);
    this.models = new ModelsApi(configuration);
    this.oAuth = new OAuthApi(configuration);
    this.platforms = new PlatformsApi(configuration);
    this.processes = new ProcessesApi(configuration);
    this.projects = new ProjectsApi(configuration);
    this.projectsAvatar = new ProjectsAvatarApi(configuration);
    this.projectVariables = new ProjectVariablesApi(configuration);
    this.readyMCPServers = new ReadyMCPServersApi(configuration);
    this.spaces = new SpacesApi(configuration);
    this.storage = new StorageApi(configuration);
    this.tariffs = new TariffsApi(configuration);
  }

  /** Update the access token for all subsequent requests. */
  set accessToken(token: string) {
    this.tokenState.accessToken = token;
  }

  get accessToken(): string {
    return this.tokenState.accessToken;
  }

  /** Update the refresh token. */
  set refreshToken(token: string | undefined) {
    this.tokenState.refreshToken = token;
  }

  get refreshToken(): string | undefined {
    return this.tokenState.refreshToken;
  }
}
