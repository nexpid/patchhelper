export function checkPasted(
  value: string,
  previous: string
): { find: string; match: string; replace: string } | undefined {
  const newStart = value.split("").findIndex((v, i) => previous[i] !== v);
  const newEnd = value
    .split("")
    .findIndex((v, i) => i > newStart && previous[i] === v);

  const content = value.slice(newStart, newEnd);
  if (content.length < 2) return;

  let find = value.match(/find: ?(".*?"),/)?.[1];
  const match = value.match(/match: ?\/(.*?)\/,/)?.[1];
  let replace = value.match(/replace: ?(".*?"),?/)?.[1];
  if (!find || !match || !replace) return;

  try {
    find = JSON.parse(find) as string;
    replace = JSON.parse(replace) as string;
    new RegExp(match);
  } catch (e) {
    console.log(e);
    return;
  }

  return { find, match, replace };
}
