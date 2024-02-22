import { ProtocolRequestType, RequestHandler } from "vscode-languageserver";
import {
  ChatItemAction,
  ChatPrompt,
  ReferenceTrackerInformation,
  SourceLink,
} from "./constants";

export interface ChatParams {
  tabId: string;
  prompt: ChatPrompt;
}
export interface ChatResult {
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
  ChatParams,
  ChatResult,
  ChatResult,
  void,
  void
>("aws/sendChatPrompt");

export type EndChatSessionParams = { tabId: string };
export type EndChatSessionResult = boolean;
export const endChatRequestType = new ProtocolRequestType<
  EndChatSessionParams,
  EndChatSessionResult,
  never,
  void,
  void
>("aws/endChatSession");

export interface QuickActionParams {
  tabId: string;
  quickAction: string;
  prompt?: string;
}
export const quickActionRequestType = new ProtocolRequestType<
  QuickActionParams,
  ChatResult,
  ChatResult,
  void,
  void
>("aws/sendChatQuickAction");

/**
 * The Chat feature interface. Provides access to chat features
 */
export type Chat = {
  onChatPrompt: (
    handler: RequestHandler<ChatParams, ChatResult | undefined | null, void>,
  ) => void; // send result as partials and then send complete message
  onEndChatSession: (
    handler: RequestHandler<EndChatSessionParams, EndChatSessionResult, void>,
  ) => void;
  onQuickAction: (
    handler: RequestHandler<QuickActionParams, ChatResult, void>,
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
