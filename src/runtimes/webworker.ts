import {
  InitializeParams,
  TextDocumentSyncKind,
  TextDocuments,
} from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
  BrowserMessageReader,
  BrowserMessageWriter,
  createConnection,
} from "vscode-languageserver/browser";
import { Logging, Lsp, Telemetry, Workspace } from "../features";
import { inlineCompletionRequestType } from "../features/lsp/inline-completions/futureProtocol";
import { Server } from "./server";
import { Auth } from "../features/auth/auth";
import { handleVersionArgument } from "../features/versioning";
import { RuntimeProps } from "./runtime";

declare const self: WindowOrWorkerGlobalScope;

// TODO: testing rig for runtimes
export const webworker = (props: RuntimeProps) => {
  handleVersionArgument(props.version);

  const lspConnection = createConnection(
    new BrowserMessageReader(self),
    new BrowserMessageWriter(self),
  );

  const documents = new TextDocuments(TextDocument);

  // Initialize the LSP connection based on the supported LSP capabilities
  // TODO: make this dependent on the actual requirements of the
  // servers parameter.
  lspConnection.onInitialize((params: InitializeParams) => {
    return {
      serverInfo: {
        // TODO: make this configurable
        name: "AWS LSP Web Worker",
        // This indicates the webworker server version and is updated
        // every time the runtime or any of the servers update.
        // Major version updates only happen for backwards incompatible changes.
        version: props.version,
      },
      capabilities: {
        textDocumentSync: {
          openClose: true,
          change: TextDocumentSyncKind.Incremental,
        },
        completionProvider: {
          resolveProvider: true,
          completionItem: {
            labelDetailsSupport: true,
          },
        },
      },
    };
  });

  // Set up logigng over LSP
  const logging: Logging = {
    log: (message) =>
      lspConnection.console.info(`[${new Date().toISOString()}] ${message}`),
  };

  // Set up telemetry over LSP
  const telemetry: Telemetry = {
    emit: (metric) => lspConnection.telemetry.logEvent(metric),
  };

  // Set up the workspace to use the LSP Text Documents component
  const workspace: Workspace = {
    getTextDocument: async (uri) => documents.get(uri),
  };

  // Map the LSP client to the LSP feature.
  const lsp: Lsp = {
    onCompletion: (handler) => lspConnection.onCompletion(handler),
    onInlineCompletion: (handler) =>
      lspConnection.onRequest(inlineCompletionRequestType, handler),
  };

  // Set up auth without encryption
  const auth = new Auth(lspConnection);
  const credentialsProvider = auth.getCredentialsProvider();

  // Initialize every Server
  const disposables = props.servers.map((s) =>
    s({ credentialsProvider, lsp, workspace, telemetry, logging }),
  );

  // Free up any resources or threads used by Servers
  lspConnection.onExit(() => {
    disposables.forEach((d) => d());
  });

  // Initialize the documents listener and start the LSP connection
  documents.listen(lspConnection);
  lspConnection.listen();
};
