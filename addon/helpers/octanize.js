const pascalRe = /(\w)(\w*)/g;
const pascalReplacer = (_, start, rest) => (start.toUpperCase() + rest);

export default function(str) {
  const [, path] = str.split(/\{\{|\}\}/g);
  const parts = path.split('/');
  const octaneName = parts.map(
    (part) => part.replace(pascalRe, pascalReplacer).replace(/-/g, '')
  ).join('::');

  return `<${octaneName}>`;
}
