import { ProtocolRequestType, RequestHandler } from "vscode-languageserver";
import {
  ChatItemAction,
  ChatPrompt,
  ReferenceTrackerInformation,
  SourceLink,
} from "./constants";

export interface ChatRequestParams {
  tabId: string;
  prompt: ChatPrompt;
  conversationId?: string;
}
export interface ChatRequestResult {
  body?: string;
  messageId?: string;
  canBeVoted?: boolean; // requires messageId to be filled to show vote thumbs
  relatedContent?: {
    title?: string;
    content: SourceLink[];
  };
  followUp?: {
    text?: string;
    options?: ChatItemAction[];
  };
  codeReference?: ReferenceTrackerInformation[];
}
export const chatRequestType = new ProtocolRequestType<
  ChatRequestParams,
  ChatRequestResult,
  ChatRequestResult,
  void,
  void
>("aws/sendChatPrompt");

export type EndChatSessionParams = { tabId: string; conversationId?: string };
export type EndChatSessionResult = boolean;
export const endChatRequestType = new ProtocolRequestType<
  EndChatSessionParams,
  EndChatSessionResult,
  never,
  void,
  void
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
  ) => void; // send result as partials and then send complete message
  onEndChatSession: (
    handler: RequestHandler<EndChatSessionParams, EndChatSessionResult, void>,
  ) => void;
  // TODO
  onShowMoreWebResultsClick?: any;
  onReady?: any;
  onVote?: any;
  onStopChatResponse?: any;
  onResetStore?: any;
  onFollowUpClicked?: any;
  onInBodyButtonClicked?: any;
  onTabChange?: any;
  onTabAdd?: any;
  onBeforeTabRemove?: any;
  onTabRemove?: any;
  onChatItemEngagement?: any;
  onCopyCodeToClipboard?: any;
  onCodeInsertToCursorPosition?: any;
  onSourceLinkClick?: any;
  onLinkClick?: any;
  onInfoLinkClick?: any;
  onSendFeedback?: any;
  onCustomFormAction?: any;
  onOpenDiff?: any;
  onFileActionClick?: any;
};
