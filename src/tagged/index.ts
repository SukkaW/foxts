/**
 * @example import { tagged as html } from 'foxts/tagged';
 */
export function tagged(string: TemplateStringsArray, ...values: any[]) {
  return string.reduce((acc, str, i) => acc + str + (values[i] ?? ''), '');
  // let result = '';
  // for (let i = 0, len = string.length; i < len; i++) {
  //   result += string[i] + (values[i] ?? '');
  // }
  // return result;
}
