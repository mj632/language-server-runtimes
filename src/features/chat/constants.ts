/**
 * @public
 * Represents an additional reference link retured with the Chat message
 */
export interface SupplementaryWebLink {
  /**
   * @public
   * URL of the web reference link
   */
  url: string | undefined;

  /**
   * @public
   * Title of the web reference link
   */
  title: string | undefined;

  /**
   * @public
   * Relevant text snippet from the link
   */
  snippet?: string;
}

/**
 * @public
 * Represents span in a text
 */
export interface Span {
  start?: number;
  end?: number;
}

/**
 * @public
 * Code Reference / Repository details
 */
export interface Reference {
  /**
   * @public
   * License name
   */
  licenseName?: string;

  /**
   * @public
   * Code Repsitory for the associated reference
   */
  repository?: string;

  /**
   * @public
   * Respository URL
   */
  url?: string;

  /**
   * @public
   * Span / Range for the Reference
   */
  recommendationContentSpan?: Span;
}

export interface FollowupPrompt {
  /**
   * @public
   * The content of the text message in markdown format.
   */
  content: string | undefined;

  /**
   * @public
   * User Intent
   */
  userIntent?: UserIntent | string;
}

/**
 * @public
 * Indicates Cursor postion in a Text Document
 */
export interface Position {
  /**
   * @public
   * Line position in a document.
   */
  line: number | undefined;

  /**
   * @public
   * Character offset on a line in a document (zero-based)
   */
  character: number | undefined;
}

/**
 * @public
 * Represents the state of the Cursor in an Editor
 */
export type CursorState =
  | CursorState.PositionMember
  | CursorState.RangeMember
  | CursorState.$UnknownMember;

/**
 * @public
 */
export namespace CursorState {
  /**
   * @public
   * Represents a cursor position in a Text Document
   */
  export interface PositionMember {
    position: Position;
    range?: never;
    $unknown?: never;
  }

  /**
   * @public
   * Represents a text selection in a Text Document
   */
  export interface RangeMember {
    position?: never;
    range: Range;
    $unknown?: never;
  }

  /**
   * @public
   */
  export interface $UnknownMember {
    position?: never;
    range?: never;
    $unknown: [string, any];
  }

  export interface Visitor<T> {
    position: (value: Position) => T;
    range: (value: Range) => T;
    _: (name: string, value: any) => T;
  }

  export const visit = <T>(value: CursorState, visitor: Visitor<T>): T => {
    if (value.position !== undefined) return visitor.position(value.position);
    if (value.range !== undefined) return visitor.range(value.range);
    return visitor._(value.$unknown[0], value.$unknown[1]);
  };
}

/**
 * @public
 * @enum
 */
export const SymbolType = {
  DECLARATION: "DECLARATION",
  USAGE: "USAGE",
} as const;
/**
 * @public
 */
export type SymbolType = (typeof SymbolType)[keyof typeof SymbolType];

/**
 * @public
 */
export interface DocumentSymbol {
  /**
   * @public
   * Name of the Document Symbol
   */
  name: string | undefined;

  /**
   * @public
   * Symbol type - DECLARATION / USAGE
   */
  type: SymbolType | string | undefined;

  /**
   * @public
   * Symbol package / source for FullyQualified names
   */
  source?: string;
}

/**
 * @public
 * Programming Languages supported by CodeWhisperer
 */
export interface ProgrammingLanguage {
  languageName: string | undefined;
}

/**
 * @public
 * @enum
 */
export const DiagnosticSeverity = {
  ERROR: "ERROR",
  HINT: "HINT",
  INFORMATION: "INFORMATION",
  WARNING: "WARNING",
} as const;
/**
 * @public
 */
export type DiagnosticSeverity =
  (typeof DiagnosticSeverity)[keyof typeof DiagnosticSeverity];

/**
 * @public
 * Structure to represent metadata about a Runtime Diagnostics
 */
export interface RuntimeDiagnostic {
  /**
   * @public
   * A human-readable string describing the source of the diagnostic
   */
  source: string | undefined;

  /**
   * @public
   * Diagnostic Error type
   */
  severity: DiagnosticSeverity | string | undefined;

  /**
   * @public
   * The diagnostic's message.
   */
  message: string | undefined;
}

/**
 * @public
 * Represents a Text Document / File
 */
export interface TextDocument {
  /**
   * @public
   * Filepath relative to the root of the workspace
   */
  relativeFilePath: string | undefined;

  /**
   * @public
   * The text document's language identifier.
   */
  programmingLanguage?: ProgrammingLanguage;

  /**
   * @public
   * Content of the text document
   */
  text?: string;

  /**
   * @public
   * DocumentSymbols parsed from a text document
   */
  documentSymbols?: DocumentSymbol[];
}

/**
 * @public
 * Structure to represent metadata about a TextDocument Diagnostic
 */
export interface TextDocumentDiagnostic {
  /**
   * @public
   * Represents a Text Document associated with Diagnostic
   */
  document: TextDocument | undefined;

  /**
   * @public
   * The range at which the message applies.
   */
  range: Range | undefined;

  /**
   * @public
   * A human-readable string describing the source of the diagnostic
   */
  source: string | undefined;

  /**
   * @public
   * Diagnostic Error type
   */
  severity: DiagnosticSeverity | string | undefined;

  /**
   * @public
   * The diagnostic's message.
   */
  message: string | undefined;
}

/**
 * @public
 * Represents a Diagnostic message
 */
export type Diagnostic =
  | Diagnostic.RuntimeDiagnosticMember
  | Diagnostic.TextDocumentDiagnosticMember
  | Diagnostic.$UnknownMember;

/**
 * @public
 */
export namespace Diagnostic {
  /**
   * @public
   * Diagnostics originating from a TextDocument
   */
  export interface TextDocumentDiagnosticMember {
    textDocumentDiagnostic: TextDocumentDiagnostic;
    runtimeDiagnostic?: never;
    $unknown?: never;
  }

  /**
   * @public
   * Diagnostics originating from a Runtime
   */
  export interface RuntimeDiagnosticMember {
    textDocumentDiagnostic?: never;
    runtimeDiagnostic: RuntimeDiagnostic;
    $unknown?: never;
  }

  /**
   * @public
   */
  export interface $UnknownMember {
    textDocumentDiagnostic?: never;
    runtimeDiagnostic?: never;
    $unknown: [string, any];
  }

  export interface Visitor<T> {
    textDocumentDiagnostic: (value: TextDocumentDiagnostic) => T;
    runtimeDiagnostic: (value: RuntimeDiagnostic) => T;
    _: (name: string, value: any) => T;
  }

  export const visit = <T>(value: Diagnostic, visitor: Visitor<T>): T => {
    if (value.textDocumentDiagnostic !== undefined)
      return visitor.textDocumentDiagnostic(value.textDocumentDiagnostic);
    if (value.runtimeDiagnostic !== undefined)
      return visitor.runtimeDiagnostic(value.runtimeDiagnostic);
    return visitor._(value.$unknown[0], value.$unknown[1]);
  };
}

/**
 * @public
 * Represents the state of an Editor
 */
export interface EditorState {
  /**
   * @public
   * Represents currently edited file
   */
  document?: TextDocument;

  /**
   * @public
   * Position of the cursor
   */
  cursorState?: CursorState;
}

/**
 * @public
 * Additional Chat message context associated with the Chat Message
 */
export interface UserInputMessageContext {
  /**
   * @public
   * Editor state chat message context.
   */
  editorState?: EditorState;

  /**
   * @public
   * Diagnostic chat message context.
   */
  diagnostic?: Diagnostic;
}

/**
 * @public
 * @enum
 */
export const UserIntent = {
  /**
   * Apply Common Best Practices
   */
  APPLY_COMMON_BEST_PRACTICES: "APPLY_COMMON_BEST_PRACTICES",
  /**
   * Cite Sources
   */
  CITE_SOURCES: "CITE_SOURCES",
  /**
   * Explain Code Selection
   */
  EXPLAIN_CODE_SELECTION: "EXPLAIN_CODE_SELECTION",
  /**
   * Explain Code Line By Line
   */
  EXPLAIN_LINE_BY_LINE: "EXPLAIN_LINE_BY_LINE",
  /**
   * Improve Code
   */
  IMPROVE_CODE: "IMPROVE_CODE",
  /**
   * Show More Examples
   */
  SHOW_EXAMPLES: "SHOW_EXAMPLES",
  /**
   * Suggest Alternative Implementation
   */
  SUGGEST_ALTERNATE_IMPLEMENTATION: "SUGGEST_ALTERNATE_IMPLEMENTATION",
} as const;
/**
 * @public
 */
export type UserIntent = (typeof UserIntent)[keyof typeof UserIntent];
