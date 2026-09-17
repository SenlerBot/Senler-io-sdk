import { Configuration } from './generated/runtime';
  import type { FetchAPI } from './generated/runtime';
  import { createAuthMiddleware } from './auth';
  import type { TokenState } from './auth';
  import type { AiSenlerClientConfig } from './types';
  
  import { AccessApi } from './generated/apis/AccessApi';
import { AccessInvitationsApi } from './generated/apis/AccessInvitationsApi';
import { AgentAssignmentRulesApi } from './generated/apis/AgentAssignmentRulesApi';
import { AgentAuthoringApi } from './generated/apis/AgentAuthoringApi';
import { AgentInstalledAppToolsApi } from './generated/apis/AgentInstalledAppToolsApi';
import { AgentLandingBlocksApi } from './generated/apis/AgentLandingBlocksApi';
import { AgentsApi } from './generated/apis/AgentsApi';
import { AgentsAcquisitionApi } from './generated/apis/AgentsAcquisitionApi';
import { AgentsAvatarApi } from './generated/apis/AgentsAvatarApi';
import { AgentsLandingApi } from './generated/apis/AgentsLandingApi';
import { AgentTrainingApi } from './generated/apis/AgentTrainingApi';
import { AIProviderAccountsApi } from './generated/apis/AIProviderAccountsApi';
import { AnalyticsApi } from './generated/apis/AnalyticsApi';
import { AppAccessGrantsApi } from './generated/apis/AppAccessGrantsApi';
import { AppAgentEventsApi } from './generated/apis/AppAgentEventsApi';
import { AppAnalyticsApi } from './generated/apis/AppAnalyticsApi';
import { AppAutomationEventsApi } from './generated/apis/AppAutomationEventsApi';
import { AppCatalogApi } from './generated/apis/AppCatalogApi';
import { AppDocumentationApi } from './generated/apis/AppDocumentationApi';
import { AppsApi } from './generated/apis/AppsApi';
import { AppsCoverApi } from './generated/apis/AppsCoverApi';
import { AppsIconApi } from './generated/apis/AppsIconApi';
import { AppsMembersApi } from './generated/apis/AppsMembersApi';
import { AppsWebhooksApi } from './generated/apis/AppsWebhooksApi';
import { AppVariablesApi } from './generated/apis/AppVariablesApi';
import { AppVersionsApi } from './generated/apis/AppVersionsApi';
import { AppVersionStepsApi } from './generated/apis/AppVersionStepsApi';
import { AttachmentsApi } from './generated/apis/AttachmentsApi';
import { AuditApi } from './generated/apis/AuditApi';
import { AutomationPerformanceApi } from './generated/apis/AutomationPerformanceApi';
import { AutomationsApi } from './generated/apis/AutomationsApi';
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
import { DeliveriesApi } from './generated/apis/DeliveriesApi';
import { DialogsApi } from './generated/apis/DialogsApi';
import { DialogsManagementApi } from './generated/apis/DialogsManagementApi';
import { DialogsMessagingApi } from './generated/apis/DialogsMessagingApi';
import { DialogVariableDefinitionsApi } from './generated/apis/DialogVariableDefinitionsApi';
import { DialogVariablesApi } from './generated/apis/DialogVariablesApi';
import { EventsApi } from './generated/apis/EventsApi';
import { FrontendVersionApi } from './generated/apis/FrontendVersionApi';
import { FunnelsApi } from './generated/apis/FunnelsApi';
import { KnowledgeBaseApi } from './generated/apis/KnowledgeBaseApi';
import { LandingBlocksApi } from './generated/apis/LandingBlocksApi';
import { LandingPlatformSettingsApi } from './generated/apis/LandingPlatformSettingsApi';
import { LandingsApi } from './generated/apis/LandingsApi';
import { LandingsPublicApi } from './generated/apis/LandingsPublicApi';
import { LandingsPublicPlatformApi } from './generated/apis/LandingsPublicPlatformApi';
import { LeadsApi } from './generated/apis/LeadsApi';
import { LeadVariableDefinitionsApi } from './generated/apis/LeadVariableDefinitionsApi';
import { LeadVariablesApi } from './generated/apis/LeadVariablesApi';
import { MCPExternalUserCredentialsApi } from './generated/apis/MCPExternalUserCredentialsApi';
import { MCPServersApi } from './generated/apis/MCPServersApi';
import { MetricsConfigApi } from './generated/apis/MetricsConfigApi';
import { MetricsDefinitionsApi } from './generated/apis/MetricsDefinitionsApi';
import { MobileAppReleasesApi } from './generated/apis/MobileAppReleasesApi';
import { ModelsApi } from './generated/apis/ModelsApi';
import { OAuthApi } from './generated/apis/OAuthApi';
import { PlatformsApi } from './generated/apis/PlatformsApi';
import { ProcessesApi } from './generated/apis/ProcessesApi';
import { ProjectAppsApi } from './generated/apis/ProjectAppsApi';
import { ProjectsApi } from './generated/apis/ProjectsApi';
import { ProjectsAvatarApi } from './generated/apis/ProjectsAvatarApi';
import { ProjectsLeadCreditLimitsApi } from './generated/apis/ProjectsLeadCreditLimitsApi';
import { ProjectVariablesApi } from './generated/apis/ProjectVariablesApi';
import { PublicDocumentationApi } from './generated/apis/PublicDocumentationApi';
import { PublicStatusApi } from './generated/apis/PublicStatusApi';
import { ReadyMCPServersApi } from './generated/apis/ReadyMCPServersApi';
import { ResourcePackagesApi } from './generated/apis/ResourcePackagesApi';
import { SegmentConsentDocumentsPublicApi } from './generated/apis/SegmentConsentDocumentsPublicApi';
import { SegmentsApi } from './generated/apis/SegmentsApi';
import { SegmentsPublicApi } from './generated/apis/SegmentsPublicApi';
import { SpacesApi } from './generated/apis/SpacesApi';
import { StatisticsApi } from './generated/apis/StatisticsApi';
import { StorageApi } from './generated/apis/StorageApi';
import { SupportSchedulesApi } from './generated/apis/SupportSchedulesApi';
import { TariffsApi } from './generated/apis/TariffsApi';
import { TrafficMarksApi } from './generated/apis/TrafficMarksApi';
  
  const DEFAULT_BASE_URL = 'https://api.senler.io';
  
  export class AiSenlerClient {
    private readonly tokenState: TokenState;
  
    readonly access: AccessApi;
  readonly accessInvitations: AccessInvitationsApi;
  readonly agentAssignmentRules: AgentAssignmentRulesApi;
  readonly agentAuthoring: AgentAuthoringApi;
  readonly agentInstalledAppTools: AgentInstalledAppToolsApi;
  readonly agentLandingBlocks: AgentLandingBlocksApi;
  readonly agents: AgentsApi;
  readonly agentsAcquisition: AgentsAcquisitionApi;
  readonly agentsAvatar: AgentsAvatarApi;
  readonly agentsLanding: AgentsLandingApi;
  readonly agentTraining: AgentTrainingApi;
  readonly aiProviderAccounts: AIProviderAccountsApi;
  readonly analytics: AnalyticsApi;
  readonly appAccessGrants: AppAccessGrantsApi;
  readonly appAgentEvents: AppAgentEventsApi;
  readonly appAnalytics: AppAnalyticsApi;
  readonly appAutomationEvents: AppAutomationEventsApi;
  readonly appCatalog: AppCatalogApi;
  readonly appDocumentation: AppDocumentationApi;
  readonly apps: AppsApi;
  readonly appsCover: AppsCoverApi;
  readonly appsIcon: AppsIconApi;
  readonly appsMembers: AppsMembersApi;
  readonly appsWebhooks: AppsWebhooksApi;
  readonly appVariables: AppVariablesApi;
  readonly appVersions: AppVersionsApi;
  readonly appVersionSteps: AppVersionStepsApi;
  readonly attachments: AttachmentsApi;
  readonly audit: AuditApi;
  readonly automationPerformance: AutomationPerformanceApi;
  readonly automations: AutomationsApi;
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
  readonly deliveries: DeliveriesApi;
  readonly dialogs: DialogsApi;
  readonly dialogsManagement: DialogsManagementApi;
  readonly dialogsMessaging: DialogsMessagingApi;
  readonly dialogVariableDefinitions: DialogVariableDefinitionsApi;
  readonly dialogVariables: DialogVariablesApi;
  readonly events: EventsApi;
  readonly frontendVersion: FrontendVersionApi;
  readonly funnels: FunnelsApi;
  readonly knowledgeBase: KnowledgeBaseApi;
  readonly landingBlocks: LandingBlocksApi;
  readonly landingPlatformSettings: LandingPlatformSettingsApi;
  readonly landings: LandingsApi;
  readonly landingsPublic: LandingsPublicApi;
  readonly landingsPublicPlatform: LandingsPublicPlatformApi;
  readonly leads: LeadsApi;
  readonly leadVariableDefinitions: LeadVariableDefinitionsApi;
  readonly leadVariables: LeadVariablesApi;
  readonly mcpExternalUserCredentials: MCPExternalUserCredentialsApi;
  readonly mcpServers: MCPServersApi;
  readonly metricsConfig: MetricsConfigApi;
  readonly metricsDefinitions: MetricsDefinitionsApi;
  readonly mobileAppReleases: MobileAppReleasesApi;
  readonly models: ModelsApi;
  readonly oAuth: OAuthApi;
  readonly platforms: PlatformsApi;
  readonly processes: ProcessesApi;
  readonly projectApps: ProjectAppsApi;
  readonly projects: ProjectsApi;
  readonly projectsAvatar: ProjectsAvatarApi;
  readonly projectsLeadCreditLimits: ProjectsLeadCreditLimitsApi;
  readonly projectVariables: ProjectVariablesApi;
  readonly publicDocumentation: PublicDocumentationApi;
  readonly publicStatus: PublicStatusApi;
  readonly readyMCPServers: ReadyMCPServersApi;
  readonly resourcePackages: ResourcePackagesApi;
  readonly segmentConsentDocumentsPublic: SegmentConsentDocumentsPublicApi;
  readonly segments: SegmentsApi;
  readonly segmentsPublic: SegmentsPublicApi;
  readonly spaces: SpacesApi;
  readonly statistics: StatisticsApi;
  readonly storage: StorageApi;
  readonly supportSchedules: SupportSchedulesApi;
  readonly tariffs: TariffsApi;
  readonly trafficMarks: TrafficMarksApi;
  
    constructor(config: AiSenlerClientConfig & { fetchApi?: FetchAPI }) {
      this.tokenState = {
        accessToken: config.accessToken,
        refreshToken: config.refreshToken,
        clientId: config.clientId,
        clientSecret: config.clientSecret,
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
    this.agentAuthoring = new AgentAuthoringApi(configuration);
    this.agentInstalledAppTools = new AgentInstalledAppToolsApi(configuration);
    this.agentLandingBlocks = new AgentLandingBlocksApi(configuration);
    this.agents = new AgentsApi(configuration);
    this.agentsAcquisition = new AgentsAcquisitionApi(configuration);
    this.agentsAvatar = new AgentsAvatarApi(configuration);
    this.agentsLanding = new AgentsLandingApi(configuration);
    this.agentTraining = new AgentTrainingApi(configuration);
    this.aiProviderAccounts = new AIProviderAccountsApi(configuration);
    this.analytics = new AnalyticsApi(configuration);
    this.appAccessGrants = new AppAccessGrantsApi(configuration);
    this.appAgentEvents = new AppAgentEventsApi(configuration);
    this.appAnalytics = new AppAnalyticsApi(configuration);
    this.appAutomationEvents = new AppAutomationEventsApi(configuration);
    this.appCatalog = new AppCatalogApi(configuration);
    this.appDocumentation = new AppDocumentationApi(configuration);
    this.apps = new AppsApi(configuration);
    this.appsCover = new AppsCoverApi(configuration);
    this.appsIcon = new AppsIconApi(configuration);
    this.appsMembers = new AppsMembersApi(configuration);
    this.appsWebhooks = new AppsWebhooksApi(configuration);
    this.appVariables = new AppVariablesApi(configuration);
    this.appVersions = new AppVersionsApi(configuration);
    this.appVersionSteps = new AppVersionStepsApi(configuration);
    this.attachments = new AttachmentsApi(configuration);
    this.audit = new AuditApi(configuration);
    this.automationPerformance = new AutomationPerformanceApi(configuration);
    this.automations = new AutomationsApi(configuration);
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
    this.deliveries = new DeliveriesApi(configuration);
    this.dialogs = new DialogsApi(configuration);
    this.dialogsManagement = new DialogsManagementApi(configuration);
    this.dialogsMessaging = new DialogsMessagingApi(configuration);
    this.dialogVariableDefinitions = new DialogVariableDefinitionsApi(configuration);
    this.dialogVariables = new DialogVariablesApi(configuration);
    this.events = new EventsApi(configuration);
    this.frontendVersion = new FrontendVersionApi(configuration);
    this.funnels = new FunnelsApi(configuration);
    this.knowledgeBase = new KnowledgeBaseApi(configuration);
    this.landingBlocks = new LandingBlocksApi(configuration);
    this.landingPlatformSettings = new LandingPlatformSettingsApi(configuration);
    this.landings = new LandingsApi(configuration);
    this.landingsPublic = new LandingsPublicApi(configuration);
    this.landingsPublicPlatform = new LandingsPublicPlatformApi(configuration);
    this.leads = new LeadsApi(configuration);
    this.leadVariableDefinitions = new LeadVariableDefinitionsApi(configuration);
    this.leadVariables = new LeadVariablesApi(configuration);
    this.mcpExternalUserCredentials = new MCPExternalUserCredentialsApi(configuration);
    this.mcpServers = new MCPServersApi(configuration);
    this.metricsConfig = new MetricsConfigApi(configuration);
    this.metricsDefinitions = new MetricsDefinitionsApi(configuration);
    this.mobileAppReleases = new MobileAppReleasesApi(configuration);
    this.models = new ModelsApi(configuration);
    this.oAuth = new OAuthApi(configuration);
    this.platforms = new PlatformsApi(configuration);
    this.processes = new ProcessesApi(configuration);
    this.projectApps = new ProjectAppsApi(configuration);
    this.projects = new ProjectsApi(configuration);
    this.projectsAvatar = new ProjectsAvatarApi(configuration);
    this.projectsLeadCreditLimits = new ProjectsLeadCreditLimitsApi(configuration);
    this.projectVariables = new ProjectVariablesApi(configuration);
    this.publicDocumentation = new PublicDocumentationApi(configuration);
    this.publicStatus = new PublicStatusApi(configuration);
    this.readyMCPServers = new ReadyMCPServersApi(configuration);
    this.resourcePackages = new ResourcePackagesApi(configuration);
    this.segmentConsentDocumentsPublic = new SegmentConsentDocumentsPublicApi(configuration);
    this.segments = new SegmentsApi(configuration);
    this.segmentsPublic = new SegmentsPublicApi(configuration);
    this.spaces = new SpacesApi(configuration);
    this.statistics = new StatisticsApi(configuration);
    this.storage = new StorageApi(configuration);
    this.supportSchedules = new SupportSchedulesApi(configuration);
    this.tariffs = new TariffsApi(configuration);
    this.trafficMarks = new TrafficMarksApi(configuration);
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
  