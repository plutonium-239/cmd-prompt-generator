import { timeFormat } from 'd3-time-format';

/**
 * A parameter for a {@link PromptElementType}, e.g. a date format. Parameters are specified by the user in the UI.
 *
 * Use this in combination with {@link ParameterizedString}.
 */
type Parameter = {
  /**
   * The unique id of the parameter to refer to in the {@link PromptElementType.char} and
   * {@link PromptElementType.preview} functions.
   */
  id: string;
  /**
   * The label of the parameter that will be displayed in the UI for the according input field.
   */
  label: string;
};

/**
 * A string that depends on string {@link Parameter | parameters}.
 */
type ParameterizedString = (args: Record<string, string>) => string;

/**
 * @property name the name
 */
export class PromptElementType {
  /**
   * The name of the prompt element that will be displayed in the UI.
   */
  name: string;

  /**
   * The character string that will be generated in the prompt string for this element.
   *
   * The string is a function of the {@link parameters}' values.
   */
  char: ParameterizedString;

  /**
   * A (possibly empty) list of parameters that influence the behavior of the prompt element, e.g. a date format.
   */
  parameters: Parameter[];

  /**
   * Whether the prompt element is visible.
   *
   * This is used in order to decide whether a prompt element's display attributes, such as color, can be configured.
   * Whitespace elements are not considered printable in this regard.
   */
  printable: boolean;

  /**
   * A description of the prompt element that will be used as a tooltip in the UI.
   */
  description: string;

  /**
   * A string that is used for the prompt preview in the UI.
   *
   * The string is a function of the {@link parameters}' values.
   */
  preview: ParameterizedString;

  /**
   * @param char can be a constant string if it does not depend on parameters
   * @param preview can be a constant string if it does not depend on parameters
   */
  constructor(
    name: string,
    char: string | ParameterizedString,
    parameters: Parameter[],
    printable: boolean,
    description: string,
    preview: string | ParameterizedString,
  ) {
    this.name = name;
    this.char = typeof char === 'string' ? () => char : char;
    this.parameters = parameters;
    this.printable = printable;
    this.description = description;
    this.preview = typeof preview === 'string' ? () => preview : preview;
  }
}

export function RemoveBackspaces(str: string)
{
  // let newstr = str 
  while (str.indexOf('\b') !== -1)
  {
    // eslint-disable-next-line
    str = str.replace(/.?\x08/, ''); // 0x08 is the ASCII code for \b
  }
  return str;
}

/**
 * {@linkcode PROMPT_ELEMENT_TYPES} is a complete list of special characters for prompts supported by Bash according to
 * section
 * {@link https://www.gnu.org/software/bash/manual/html_node/Controlling-the-Prompt.html | 6.9 Controlling the Prompt }
 * of the *Bash Reference Manual*.
 * Description strings are taken from the manual and will be used as tooltips in the UI.
 *
 * The list contains further useful elements, such as several characters, custom text or certain commands.
 */
export const PROMPT_ELEMENT_TYPES = [
  new PromptElementType('Current Date', '$d', [], true, 'The date, in your local format (as displayed in taskbar).', 
    () => timeFormat('%x')(new Date()),
  ),
  // new PromptElementType(
  //   'Date (formatted)',
  //   (args) => `\\D{${args.dateformat ?? ''}}`,
  //   [
  //     {
  //       id: 'dateformat',
  //       label: 'Date Format',
  //     },
  //   ],
  //   true,
  //   'The format is passed to strftime(3) and the result is inserted into the prompt string; ' +
  //     'an empty format results in a locale-specific time representation.',
  //   (args) => timeFormat(args.dateformat ?? '')(new Date()),
  // ),
  new PromptElementType('Time with 100th-seconds', '$t', [], true, 
    'The time, in 24-hour format HH:MM:SS.ss with 100-th second precision (`echo %time%`).', () =>
    RemoveBackspaces(`${timeFormat('%_H:%M:%S.%L')(new Date())}\b`),
  ),
  new PromptElementType('Time', '$t$h$h$h', [], true, 'The time, in 24-hour HH:MM:SS format.', () =>
    timeFormat('%_H:%M:%S')(new Date()),
  ),
  new PromptElementType('Time (w/o seconds)', '$t$h$h$h$h$h$h', [], true, 'The time, in 24-hour HH:MM format.', () =>
    timeFormat('%_H:%M')(new Date()),
  ),
  new PromptElementType('Username', '%username%', [], true, 'The username of the current user.', 'username'),
  new PromptElementType('Hostname', '%computername%', [], true, 'The hostname.', 'host-pc-name'),
  new PromptElementType('Remote Drive Name', '$m', [], true, 
    'Remote name associated with the current drive letter or empty string if current drive is not a network drive.',
    'remote-drive-name'),
  new PromptElementType(
    'Current Drive and Path', '$p', [], true, 'The current drive and path.', 'X:\\Big Folder\\current_folder',
  ),
  new PromptElementType(
    'Current Drive', '$n', [], true, 'The current drive letter.', 'X',
  ),
  new PromptElementType('Newline', '$_', [], false, 'A newline.', '\n'),
  // new PromptElementType('Prompt Sign', '\\$', [], true, 'If the effective uid is 0, #, otherwise $.', '$'),
  new PromptElementType('Error Level', '%errorlevel%', [], true, 'Error level of the last run command.', '0'),
  new PromptElementType('Windows Version', '$v', [], true, 'Windows version number with build.', 
    'Microsoft Windows [Version 10.0.19045.3208]'),
  // new PromptElementType(
  //   'Git branch',
  //   // eslint-disable-next-line quotes
  //   "$(git branch 2>/dev/null | grep '*' | colrm 1 2)",
  //   [],
  //   true,
  //   'Git branch.',
  //   'master',
  // ),
  // new PromptElementType(
  //   'IP Address',
  //   '$(ip route get 1.1.1.1 | awk -F"src " \'NR == 1{ split($2, a," ");print a[1]}\')',
  //   [],
  //   true,
  //   'Private IP address.',
  //   '192.168.1.100',
  // ),
  new PromptElementType(
    'Environment Variable',
    (args) => `%${args.command ?? ''}%`,
    [{ id: 'envvar', label: 'Env Var Name' }],
    true,
    'A custom environment variable.',
    'example output',
  ),
  new PromptElementType('⎵', '$s', [], false, 'Space.', ' '),
  new PromptElementType('~', '~', [], true, 'Tilde.', '~'),
  new PromptElementType('!', '!', [], true, 'Exclamation mark.', '!'),
  new PromptElementType('?', '?', [], true, 'Question mark.', '?'),
  new PromptElementType('@', '@', [], true, 'Ampersat.', '@'),
  new PromptElementType('#', '#', [], true, 'Hash.', '#'),
  new PromptElementType('$', '$$', [], true, 'Dollar sign.', '$'),
  new PromptElementType('%', '%', [], true, 'Percent.', '%'),
  new PromptElementType('^', '^', [], true, 'Caret.', '^'),
  new PromptElementType('&', '$a', [], true, 'Ampersand.', '&'),
  new PromptElementType('*', '*', [], true, 'Asterisk.', '*'),
  new PromptElementType('(', '$c', [], true, 'Open parenthesis.', '('),
  new PromptElementType(')', '$f', [], true, 'Close parenthesis.', ')'),
  new PromptElementType('{', '{', [], true, 'Open curly bracket.', '{'),
  new PromptElementType('}', '}', [], true, 'Close curly bracket.', '}'),
  new PromptElementType('[', '[', [], true, 'Open bracket.', '['),
  new PromptElementType(']', ']', [], true, 'Close bracket.', ']'),
  new PromptElementType('-', '-', [], true, 'Hyphen.', '-'),
  new PromptElementType('_', '_', [], true, 'Underscore.', '_'),
  new PromptElementType('+', '+', [], true, 'Plus.', '+'),
  new PromptElementType('=', '$q', [], true, 'Equal.', '='),
  new PromptElementType('/', '/', [], true, 'Forward slash.', '/'),
  new PromptElementType('\\', '\\\\', [], true, 'Backslash.', '\\'),
  new PromptElementType('|', '$b', [], true, 'Pipe.', '|'),
  new PromptElementType(',', ',', [], true, 'Comma.', ','),
  new PromptElementType('.', '.', [], true, 'Period.', '.'),
  new PromptElementType(':', ':', [], true, 'Colon.', ':'),
  new PromptElementType(';', ';', [], true, 'Semicolon.', ';'),
  new PromptElementType('"', '"', [], true, 'Quotation mark.', '"'),
  new PromptElementType('⌫', '$h', [], false, 'Backspace.', '\b'),
  // eslint-disable-next-line quotes
  new PromptElementType("'", "'", [], true, 'Single quote.', "'"),
  new PromptElementType('<', '$l', [], true, 'Less than.', '<'),
  new PromptElementType('>', '$g', [], true, 'Greater than.', '>'),
  new PromptElementType(
    'Text',
    // https://www.gnu.org/software/bash/manual/html_node/Double-Quotes.html
    (args) => (args.text ?? '').replace(/([$`\\!])/g, '\\$1'),
    [{ id: 'text', label: 'Text' }],
    true,
    'A custom text.',
    (args) => args.text ?? '',
  ),
];

/**
 * {@linkcode PROMPT_ELEMENT_TYPES_SEPARATORS} is a list labels of {@linkcode PromptElementType}s in
 * {@linkcode PROMPT_ELEMENT_TYPES} *before* which a separator should be inserted in the UI.
 *
 * This is used to group similar elements.
 */
export const PROMPT_ELEMENT_TYPES_SEPARATORS = [
  'Username',
  'Newline',
  'Terminal',
  'History Number',
  'Prompt Sign',
  'Git branch',
  '⎵',
  'Text',
];
