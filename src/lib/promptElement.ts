import { PromptElementType } from './enum/promptElementType';
import { Color } from './enum/color';
import { displayAttribute } from './enum/ansi';

/**
 * A semantic unit of a prompt including its styling.
 */
export class PromptElement {
  /**
   * The type of the element.
   */
  type: PromptElementType;

  /**
   * The parameter values of the element.
   */
  parameters: Record<string, string>;

  /**
   * The active display attributes of the element.
   */
  attributes: Record<displayAttribute, boolean>;

  // backspaces: Record<displayBackspaces, number>;
  backspaces: number;

  /**
   * The foreground color of the element.
   */
  foregroundColor: Color | null;

  /**
   * The background color of the element.
   */
  backgroundColor: Color | null;

  /**
   * Creates a prompt element without any parameters or styling.
   *
   * @param type the type of the element
   */
  constructor(type: PromptElementType) {
    this.type = type;
    this.parameters = {};
    this.attributes = {
      bold: false,
      dim: false,
      italic: false,
      underline: false,
      blink: false,
      reverse: false,
      overline: false,
    };
    this.backspaces = 0;
    this.foregroundColor = null;
    this.backgroundColor = null;
  }
}

/**
 * Wrapper for {@link PromptElement} providing a unique id in order to distinguish elements of the same type.
 */
export type UniquePromptElement = {
  /**
   * An id for the element, unique within the prompt.
   */
  id: number;
  /**
   * The actual element and its properties.
   */
  data: PromptElement;
};
