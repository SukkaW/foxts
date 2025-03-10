const reHtmlEntity = /["&'<>]/;
export function escapeHTML(str: string) {
  const match = reHtmlEntity.exec(str);

  if (match === null) {
    return str;
  }

  let escape = '';
  let html = '';

  let index = match.index;
  let lastIndex = 0;

  // iterate from the first match
  for (const len = str.length; index < len; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escape = '&quot;';
        break;
      case 38: // &
        escape = '&amp;';
        break;
      case 39: // '
        escape = '&#39;';
        break;
      case 60: // <
        escape = '&lt;';
        break;
      case 62: // >
        escape = '&gt;';
        break;
      default:
        continue;
    }

    if (lastIndex !== index) {
      html += str.slice(lastIndex, index);
    }

    lastIndex = index + 1;
    html += escape;
  }

  return lastIndex === index
    ? html
    : html + str.slice(lastIndex, index);
}
