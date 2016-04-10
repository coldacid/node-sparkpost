declare module "sparkpost" {
  export interface ISparkPostOptions {
    origin?: string;
    endpoint?: string;
    apiVersion?: string;
    headers?: any;
  }

  export interface IRequestOptions {
    uri: string;
    headers?: any;
    gzip?: boolean;
  }
  export interface ICustomRequestOptions extends IRequestOptions {
    method: string;
  }

  export interface Response<T> {
    body: T;

    statusCode: number;
    headers: { [header: string]: string; };
    request: ICustomRequestOptions;
  }

  export interface Callback<T> {
    (err: SparkPostError, data: Response<T>): void;
  }

  export interface ErrorMessage {
    message: string;
    code?: number;
    description?: string;
    part?: string;
    line?: number;
  }

  export interface SparkPostError extends Error {
    name: string;
    message: string;
    errors: ErrorMessage[];
    statusCode: number;
  }

  export class SparkPost {
    constructor(options: ISparkPostOptions);
    constructor(apiKey: string, options?: ISparkPostOptions);

    request<T>(options: IRequestOptions, callback: Callback<T>);
    get<T>(options: IRequestOptions, callback: Callback<T>);
    post<T>(options: IRequestOptions, callback: Callback<T>);
    put<T>(options: IRequestOptions, callback: Callback<T>);
    delete<T>(options: IRequestOptions, callback: Callback<T>);

    inboundDomains: IInboundDomainsApi;
    messageEvents: IMessageEventsApi;
    recipientLists: IRecipientListsApi;
    relayWebhooks: IRelayWebhooksApi;
    sendingDomains: ISendingDomainsApi;
    subaccounts: ISubaccountsApi;
    suppressionList: ISuppressionListApi;
    templates: ITemplatesApi;
    transmissions: ITransmissionsApi;
    webhooks: IWebhooksApi;
  }

  export interface Domain {
    domain: string;
  }

  export interface IInboundDomainsApi {
    all(callback: Callback<Domain[]>);
    find(domain: string, callback: Callback<Domain>);
    create(domain: string, callback: Callback<void>);
    delete(domain: string, callback: Callback<void>);
  }

  export interface MessageEvent {
    type: string;
    bounce_class: number;
    campaign_id: string;
    customer_id: number;
    delv_method: string;
    device_token: string;
    error_code: number;
    ip_address: string;
    message_id: string;
    msg_from: string;
    msg_size: number;
    num_retries: number;
    rcpt_meta: { [key: string]: string; };
    rcpt_tags: string[];
    rcpt_to: string;
    rcpt_type: string;
    raw_reason: string;
    reason: string;
    routing_domain: string;
    subject: string;
    template_id: string;
    template_version: number;
    timestamp: number;
    transmission_id: string;
  }

  export interface IMessageEventsSearchParams {
    bounce_classes?: number[];
    campaign_ids?: string[];
    events?: string[];
    friendly_froms?: string[];
    from?: string;
    message_ids?: string[];
    page?: number;
    per_page?: number;
    reason?: string;
    recipients?: string[];
    template_ids?: string[];
    timezone?: string;
    to?: string;
    transmission_ids?: string[];
  }

  export interface IMessageEventsApi {
    search(params: IMessageEventsSearchParams, callback: Callback<MessageEvent[]>);
  }

  export interface Recipient {
    address: string | { email: string; name?: string; header_to?: string; };
    return_path?: string;
    tags: string[];
    metadata: { [key: string]: string; };
    substitution_data: { [key: string]: string; };
  }

  export interface RecipientList {
    id?: string;
    name?: string;
    description?: string;
    attributes?: { [key: string]: string; };
    recipients: Recipient[];
  }

  export interface IRecipientListsFindOptions {
    id: string;
    show_recipients?: boolean;
  }

  export interface IRecipientListsCreateOptions extends RecipientList {
    num_rcpt_errors?: number;
  }
  export interface IRecipientListsUpdateOptions extends IRecipientListsCreateOptions {
    id: string;
  }
  export interface IRecipientListsCreateOrUpdateResponse {
    id: string;
    name: string;
    total_rejected_recipients: number;
    total_accepted_recipients: number;
  }

  export interface IRecipientListsApi {
    all(callback: Callback<RecipientList[]>);
    find(options: IRecipientListsFindOptions, callback: Callback<RecipientList>);
    create(options: IRecipientListsCreateOptions, callback: Callback<IRecipientListsCreateOrUpdateResponse>);
    update(options: IRecipientListsUpdateOptions, callback: Callback<IRecipientListsCreateOrUpdateResponse>);
    delete(id: string, callback: Callback<void>);
  }

  export interface RelayWebhook {
    id?: string;
    name?: string;
    target: string;
    auth_token?: string;
    match: { protocol?: string; domain: string; };
  }

  export interface IRelayWebhooksCreateOptions {
    target: string;
    domain: string;
    name?: string;
    authToken?: string;
    protocol: string;
  }
  export interface IRelayWebhooksUpdateOptions {
    webhookId: string;
    target?: string;
    domain?: string;
    name?: string;
    authToken?: string;
    protocol?: string;
  }

  export interface IRelayWebhooksApi {
    all(callback: Callback<RelayWebhook[]>);
    find(webhookId: string, callback: Callback<RelayWebhook>);
    create(options: IRelayWebhooksCreateOptions, callback: Callback<{ id: string; }>);
    update(options: IRelayWebhooksCreateOptions, callback: Callback<{ id: string; }>);
    delete(webhookId: string, callback: Callback<void>);
  }

  export interface SendingDomainStatus {
    ownership_verified: boolean;
    dkim_status: string;
    spf_status: string;
    abuse_at_status: string;
    postmaster_at_status: string;
    compliance_status: string;
  }
  export interface DKIM {
    signing_domain?: string;
    private: string;
    public: string;
    selector: string;
    headers?: string;
  }
  export interface SendingDomain {
    domain: string;
    tracking_domain?: string;
    status?: SendingDomainStatus;
    dkim?: DKIM;
  }

  export interface ISendingDomainsCreateOptions extends SendingDomain {
    generate_dkim?: boolean;
  }
  export interface ISendingDomainsCreateOrUpdateResponse extends SendingDomain {
    message: string;
  }
  export interface ISendingDomainsVerifyOptions {
    domain: string;
    dkim_verify?: boolean;
    spf_verify?: boolean;
    postmaster_at_verify?: boolean;
    abuse_at_verify?: boolean;
    postmaster_at_token?: boolean;
    abuse_at_token?: boolean;
  }

  export interface ISendingDomainsApi {
    all(callback: Callback<SendingDomain[]>);
    find(domain: string, callback: Callback<SendingDomain>);
    create(domainBody: ISendingDomainsCreateOptions, callback: Callback<ISendingDomainsCreateOrUpdateResponse>);
    update(domainBody: SendingDomain, callback: Callback<ISendingDomainsCreateOrUpdateResponse>);
    verify(options: ISendingDomainsVerifyOptions, callback: Callback<SendingDomainStatus>);
    delete(domain: string, callback: Callback<void>);
  }

  export interface Subaccount {
    id: number;
    name: string;
    status: string;
    ip_pool?: string;
    compliance_status: string;
  }

  export interface ISubaccountsCreateOptions {
    name: string;
    key_label: string;
    key_grants: string[];
    key_valid_ips?: string[];
    ip_pool?: string;
  }
  export interface ISubaccountCreateResponse {
    subaccount_id: number;
    key: string;
    label: string;
    short_key: string;
  }

  export interface ISubaccountsUpdateOptions {
    subaccountId: number;
    name?: string;
    status?: string;
    ip_pool?: string;
  }

  export interface ISubaccountsApi {
    all(callback: Callback<Subaccount[]>);
    find(subaccountId: number, callback: Callback<Subaccount>);
    create(options: ISubaccountsCreateOptions, callback: Callback<ISubaccountCreateResponse>);
    update(options: ISubaccountsUpdateOptions, callback: Callback<{ message: string; }>);
  }

  export interface SuppressionListEntry {
    recipient: string;
    transactional: boolean;
    non_transactional: boolean;
    source: string;
    description: string;
  }

  export interface ISuppressionListSearchOptions {
    to: string;
    from: string;
    types: string[];
    limit: number;
  }

  export interface ISuppressionListApi {
    search(parameters: ISuppressionListSearchOptions, callback: Callback<SuppressionListEntry[]>);
    checkStatus(email: string, callback: Callback<SuppressionListEntry[]>);
    removeStatus(email: string, callback: Callback<void>);
    upsert(recipient: { email: string; }, callback: Callback<void>);
  }

  export interface TemplateContent {
    html?: string;
    text?: string;
    subject: string;
    from: string | { email: string; name?: string; header_to?: string; };
    headers?: { [header: string]: string; };
  }

  export interface Template {
    id?: string;
    content: TemplateContent | Rfc822Content;
    published?: boolean;
    name?: string;
    description?: string;
    options?: {
      open_tracking?: boolean;
      click_tracking?: boolean;
      transactional?: boolean;
    };
  }

  export interface ITemplateFindOptions {
    id: string;
    draft?: boolean;
  }

  export interface ITemplateCreateOptions {
    template: Template;
  }
  export interface ITemplateUpdateOptions {
    id: string;
    update_published?: boolean;
    template: Template | { published: boolean; };
  }

  export interface ITemplatePreviewOptions {
    id: string;
    draft?: boolean;
    data: { [key: string]: string; };
  }
  export interface ITemplatePreviewResult {
    from: {
      email: string;
      name: string;
    };
    subject: string;
    reply_to: string;
    text: string;
    html: string;
    headers: { [header: string]: string; };
  }

  export interface ITemplatesApi {
    all(callback: Callback<Template[]>);
    find(options: ITemplateFindOptions, callback: Callback<Template>);
    create(options: ITemplateCreateOptions, callback: Callback<{ id: string; }>);
    update(options: ITemplateUpdateOptions, callback: Callback<void>);
    preview(options: ITemplateFindOptions, callback: Callback<ITemplatePreviewResult>);
    delete(id: string, callback: Callback<void>);
  }

  export interface Attachment {
    type: string;
    name: string;
    data: string;
  }

  export interface Rfc822Content {
    email_rfc822: string;
  }

  export interface StoredTemplateContent {
    template_id: string;
    use_draft_template?: boolean;
  }

  export interface TransmissionContent {
    html?: string;
    text?: string;
    subject: string;
    from: string | { email: string; name: string; };
    reply_to?: string;
    headers?: { [header: string]: string; };
    attachments?: Attachment[];
    inline_images?: Attachment[];
  }

  export interface Transmission {
    id?: string;
    state?: string;
    options?: {
      start_time?: string;
      open_tracking?: boolean;
      click_tracking?: boolean;
      transactional?: boolean;
      sandbox?: boolean;
      skip_suppression?: boolean;
      ip_pool?: string;
      inline_css?: boolean;
    };
    recipients: Recipient[] | { list_id: string; };
    campaign_id?: string;
    description?: string;
    metadata?: { [key: string]: string; };
    substitution_data?: { [key: string]: string };
    return_path: string;
    content: TransmissionContent | StoredTemplateContent | Rfc822Content;
    total_recipients?: number;
    num_generated?: number;
    num_failed_generation?: number;
    num_invalid_recipients?: number;
  }

  export interface ITransmissionsSendOptions {
    transmissionBody: Transmission;
    num_rcpt_errors?: number;
  }
  export interface ITransmissionsSendResult {
    total_rejected_recipients: number;
    total_accepted_recipients: number;
    id: string;

    rcpt_to_errors?: ErrorMessage[];
  }

  export interface ITransmissionsSearchParams {
    campaign_id?: string;
    template_id?: string;
  }

  export interface ITransmissionsApi {
    send(options: ITransmissionsSendOptions, callback: Callback<ITransmissionsSendResult>);
    all(callback: Callback<Transmission[]>);
    all(options: ITransmissionsSearchParams, callback: Callback<Transmission[]>);
    find(transmissionID: string, callback: Callback<Transmission>);
  }

  export interface Webhook {
    name: string;
    target: string;
    events: string[];
    auth_type?: string;
    auth_request_details?: {};
    auth_credentials?: {};
    auth_token?: string;
  }
  export interface WebhookResult {
    id: string;
    links: {
      href: string;
      rel: string;
      method: string[];
    }[];
  }
  export interface WebhookDetails extends Webhook, WebhookResult {
    last_successful?: string;
    last_failure?: string;
  }

  export interface IWebhooksUpdateOptions {
    id: string;
    name?: string;
    target?: string;
    events?: string[];
    auth_type?: string;
    auth_request_details?: {};
    auth_credentials?: {};
    auth_token?: string;
  }

  export interface IWebhooksValidateOptions {
    id: string;
    message: {};
  }
  export interface IWebhooksValidateResult {
    msg: string;
    response: {
      status: number;
      headers: { [header: string]: string };
      body: string;
    };
  }

  export interface IWebhooksBatchStatusOptions {
    id: string;
    limit?: number;
  }
  export interface IWebhooksBatchStatusResult {
    batch_id: string;
    ts: string;
    attempts: number;
    response_code: number;
  }

  export interface IWebhooksDocumentation {
    message_event: {
      description: string;
      display_name: string;
      events: {
        [event: string]: {
          description: string;
          display_name: string;
          event: {
            [key: string]: {
              description: string;
              sampleValue: any;
            }
          }
        }
      }
    };
  }
  export interface IWebhooksSample {
    msys: MessageEvent;
  }

  export interface IWebhooksApi {
    all(callback: Callback<WebhookDetails[]>);
    all(options: { timezone: string; }, callback: Callback<WebhookDetails[]>);
    describe(options: { id: string; timezone?: string; }, callback: Callback<WebhookResult>);
    create(webhook: Webhook, callback: Callback<WebhookResult>);
    update(webhook: IWebhooksUpdateOptions, callback: Callback<WebhookResult>);
    validate(options: IWebhooksUpdateOptions, callback: Callback<IWebhooksValidateResult>);
    getBatchStatus(options: IWebhooksBatchStatusOptions, callback: Callback<IWebhooksBatchStatusResult[]>);
    delete(id: string, callback: Callback<void>);

    getDocumentation(callback: Callback<IWebhooksDocumentation>);
    getSamples(callback: Callback<IWebhooksSample[]>);
    getSamples(options: { events: string; }, callback: Callback<IWebhooksSample[]>);
  }
}
