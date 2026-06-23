"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiSenlerClient = void 0;
const runtime_1 = require("./generated/runtime");
const auth_1 = require("./auth");
const AccessApi_1 = require("./generated/apis/AccessApi");
const AccessInvitationsApi_1 = require("./generated/apis/AccessInvitationsApi");
const AgentAssignmentRulesApi_1 = require("./generated/apis/AgentAssignmentRulesApi");
const AgentsApi_1 = require("./generated/apis/AgentsApi");
const AgentsAvatarApi_1 = require("./generated/apis/AgentsAvatarApi");
const AgentTrainingApi_1 = require("./generated/apis/AgentTrainingApi");
const AnalyticsApi_1 = require("./generated/apis/AnalyticsApi");
const AppCatalogApi_1 = require("./generated/apis/AppCatalogApi");
const AppsApi_1 = require("./generated/apis/AppsApi");
const AttachmentsApi_1 = require("./generated/apis/AttachmentsApi");
const AuditApi_1 = require("./generated/apis/AuditApi");
const BillingApi_1 = require("./generated/apis/BillingApi");
const ChannelsApi_1 = require("./generated/apis/ChannelsApi");
const ChannelsAvitoApi_1 = require("./generated/apis/ChannelsAvitoApi");
const ChannelsDiscordApi_1 = require("./generated/apis/ChannelsDiscordApi");
const ChannelsEmailApi_1 = require("./generated/apis/ChannelsEmailApi");
const ChannelsHistoryApi_1 = require("./generated/apis/ChannelsHistoryApi");
const ChannelsMAXApi_1 = require("./generated/apis/ChannelsMAXApi");
const ChannelsTelegramApi_1 = require("./generated/apis/ChannelsTelegramApi");
const ChannelsVKApi_1 = require("./generated/apis/ChannelsVKApi");
const ChannelsWidgetApi_1 = require("./generated/apis/ChannelsWidgetApi");
const CountriesApi_1 = require("./generated/apis/CountriesApi");
const DataSourcesApi_1 = require("./generated/apis/DataSourcesApi");
const DeliveriesApi_1 = require("./generated/apis/DeliveriesApi");
const DialogsApi_1 = require("./generated/apis/DialogsApi");
const DialogsManagementApi_1 = require("./generated/apis/DialogsManagementApi");
const DialogsMessagingApi_1 = require("./generated/apis/DialogsMessagingApi");
const EventsApi_1 = require("./generated/apis/EventsApi");
const FrontendVersionApi_1 = require("./generated/apis/FrontendVersionApi");
const KnowledgeBaseApi_1 = require("./generated/apis/KnowledgeBaseApi");
const LeadGroupsApi_1 = require("./generated/apis/LeadGroupsApi");
const LeadGroupsPublicApi_1 = require("./generated/apis/LeadGroupsPublicApi");
const LeadsApi_1 = require("./generated/apis/LeadsApi");
const LeadVariableDefinitionsApi_1 = require("./generated/apis/LeadVariableDefinitionsApi");
const LeadVariablesApi_1 = require("./generated/apis/LeadVariablesApi");
const MCPExternalUserCredentialsApi_1 = require("./generated/apis/MCPExternalUserCredentialsApi");
const MCPServersApi_1 = require("./generated/apis/MCPServersApi");
const MetricsConfigApi_1 = require("./generated/apis/MetricsConfigApi");
const MetricsDefinitionsApi_1 = require("./generated/apis/MetricsDefinitionsApi");
const ModelsApi_1 = require("./generated/apis/ModelsApi");
const OAuthApi_1 = require("./generated/apis/OAuthApi");
const PlatformsApi_1 = require("./generated/apis/PlatformsApi");
const ProcessesApi_1 = require("./generated/apis/ProcessesApi");
const ProjectsApi_1 = require("./generated/apis/ProjectsApi");
const ProjectsAvatarApi_1 = require("./generated/apis/ProjectsAvatarApi");
const ProjectVariablesApi_1 = require("./generated/apis/ProjectVariablesApi");
const ReadyMCPServersApi_1 = require("./generated/apis/ReadyMCPServersApi");
const SpacesApi_1 = require("./generated/apis/SpacesApi");
const StatisticsApi_1 = require("./generated/apis/StatisticsApi");
const StorageApi_1 = require("./generated/apis/StorageApi");
const TariffsApi_1 = require("./generated/apis/TariffsApi");
const DEFAULT_BASE_URL = 'https://api.senler.io';
class AiSenlerClient {
    constructor(config) {
        this.tokenState = {
            accessToken: config.accessToken,
            refreshToken: config.refreshToken,
            clientId: config.clientId,
        };
        const basePath = (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
        const configuration = new runtime_1.Configuration({
            basePath,
            fetchApi: config.fetchApi,
            middleware: [
                (0, auth_1.createAuthMiddleware)({
                    tokenState: this.tokenState,
                    basePath,
                    fetchApi: config.fetchApi,
                    onTokenRefreshed: config.onTokenRefreshed,
                }),
            ],
        });
        this.access = new AccessApi_1.AccessApi(configuration);
        this.accessInvitations = new AccessInvitationsApi_1.AccessInvitationsApi(configuration);
        this.agentAssignmentRules = new AgentAssignmentRulesApi_1.AgentAssignmentRulesApi(configuration);
        this.agents = new AgentsApi_1.AgentsApi(configuration);
        this.agentsAvatar = new AgentsAvatarApi_1.AgentsAvatarApi(configuration);
        this.agentTraining = new AgentTrainingApi_1.AgentTrainingApi(configuration);
        this.analytics = new AnalyticsApi_1.AnalyticsApi(configuration);
        this.appCatalog = new AppCatalogApi_1.AppCatalogApi(configuration);
        this.apps = new AppsApi_1.AppsApi(configuration);
        this.attachments = new AttachmentsApi_1.AttachmentsApi(configuration);
        this.audit = new AuditApi_1.AuditApi(configuration);
        this.billing = new BillingApi_1.BillingApi(configuration);
        this.channels = new ChannelsApi_1.ChannelsApi(configuration);
        this.channelsAvito = new ChannelsAvitoApi_1.ChannelsAvitoApi(configuration);
        this.channelsDiscord = new ChannelsDiscordApi_1.ChannelsDiscordApi(configuration);
        this.channelsEmail = new ChannelsEmailApi_1.ChannelsEmailApi(configuration);
        this.channelsHistory = new ChannelsHistoryApi_1.ChannelsHistoryApi(configuration);
        this.channelsMAX = new ChannelsMAXApi_1.ChannelsMAXApi(configuration);
        this.channelsTelegram = new ChannelsTelegramApi_1.ChannelsTelegramApi(configuration);
        this.channelsVK = new ChannelsVKApi_1.ChannelsVKApi(configuration);
        this.channelsWidget = new ChannelsWidgetApi_1.ChannelsWidgetApi(configuration);
        this.countries = new CountriesApi_1.CountriesApi(configuration);
        this.dataSources = new DataSourcesApi_1.DataSourcesApi(configuration);
        this.deliveries = new DeliveriesApi_1.DeliveriesApi(configuration);
        this.dialogs = new DialogsApi_1.DialogsApi(configuration);
        this.dialogsManagement = new DialogsManagementApi_1.DialogsManagementApi(configuration);
        this.dialogsMessaging = new DialogsMessagingApi_1.DialogsMessagingApi(configuration);
        this.events = new EventsApi_1.EventsApi(configuration);
        this.frontendVersion = new FrontendVersionApi_1.FrontendVersionApi(configuration);
        this.knowledgeBase = new KnowledgeBaseApi_1.KnowledgeBaseApi(configuration);
        this.leadGroups = new LeadGroupsApi_1.LeadGroupsApi(configuration);
        this.leadGroupsPublic = new LeadGroupsPublicApi_1.LeadGroupsPublicApi(configuration);
        this.leads = new LeadsApi_1.LeadsApi(configuration);
        this.leadVariableDefinitions = new LeadVariableDefinitionsApi_1.LeadVariableDefinitionsApi(configuration);
        this.leadVariables = new LeadVariablesApi_1.LeadVariablesApi(configuration);
        this.mcpExternalUserCredentials = new MCPExternalUserCredentialsApi_1.MCPExternalUserCredentialsApi(configuration);
        this.mcpServers = new MCPServersApi_1.MCPServersApi(configuration);
        this.metricsConfig = new MetricsConfigApi_1.MetricsConfigApi(configuration);
        this.metricsDefinitions = new MetricsDefinitionsApi_1.MetricsDefinitionsApi(configuration);
        this.models = new ModelsApi_1.ModelsApi(configuration);
        this.oAuth = new OAuthApi_1.OAuthApi(configuration);
        this.platforms = new PlatformsApi_1.PlatformsApi(configuration);
        this.processes = new ProcessesApi_1.ProcessesApi(configuration);
        this.projects = new ProjectsApi_1.ProjectsApi(configuration);
        this.projectsAvatar = new ProjectsAvatarApi_1.ProjectsAvatarApi(configuration);
        this.projectVariables = new ProjectVariablesApi_1.ProjectVariablesApi(configuration);
        this.readyMCPServers = new ReadyMCPServersApi_1.ReadyMCPServersApi(configuration);
        this.spaces = new SpacesApi_1.SpacesApi(configuration);
        this.statistics = new StatisticsApi_1.StatisticsApi(configuration);
        this.storage = new StorageApi_1.StorageApi(configuration);
        this.tariffs = new TariffsApi_1.TariffsApi(configuration);
    }
    /** Update the access token for all subsequent requests. */
    set accessToken(token) {
        this.tokenState.accessToken = token;
    }
    get accessToken() {
        return this.tokenState.accessToken;
    }
    /** Update the refresh token. */
    set refreshToken(token) {
        this.tokenState.refreshToken = token;
    }
    get refreshToken() {
        return this.tokenState.refreshToken;
    }
}
exports.AiSenlerClient = AiSenlerClient;
