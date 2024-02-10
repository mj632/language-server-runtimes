import {
  FollowupPrompt,
  Reference,
  SupplementaryWebLink,
  UserInputMessageContext,
  UserIntent,
} from "./constants";
import { ProtocolRequestType, RequestHandler } from "vscode-languageserver";

// sendChatPrompt
export type ChatRequestParams = {
  tabId: string;
  content: string;
  conversationId?: string;
  userIntent?: UserIntent;
  context?: UserInputMessageContext;
};

export type ChatRequestResult = AsyncIterable<
  string | FollowupPrompt | Reference[] | SupplementaryWebLink[]
>;

export const chatRequestType = new ProtocolRequestType<
  ChatRequestParams,
  ChatRequestResult,
  never, // No special error type,
  void, // No special error handler
  void // No special registration options
>("aws/sendChatPrompt");

// endChatSession
export type EndChatSessionParams = { tabId: string; conversationId?: string };

export type EndChatSessionResult = boolean;

export const endChatRequestType = new ProtocolRequestType<
  EndChatSessionParams,
  EndChatSessionResult,
  never, // Error type
  void, // Error handler
  void // Registration options
>("aws/endChatSession");

/**
 * The Chat feature interface. Provides access to chat features
 */
export type Chat = {
  onChatPrompt: (
    handler: RequestHandler<
      ChatRequestParams,
      ChatRequestResult | undefined | null,
      void
    >,
  ) => void;
  onEndChatSession: (
    handler: RequestHandler<EndChatSessionParams, EndChatSessionResult, void>,
  ) => void;
};
