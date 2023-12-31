type Modules = typeof window.modules;

export function searchWebpack(modules: Modules, filters: (string | RegExp)[]) {
  const results: Record<string, string> = {};

  outer: for (const [id, content] of Object.entries(modules)) {
    for (const filt of filters) {
      if (typeof filt === "string" && !content.includes(filt)) continue outer;
      else if (filt instanceof RegExp && !content.match(filt)) continue outer;
    }
    results[id] = content;
  }

  return results;
}

export function compileMatch(match: string) {
  try {
    return new RegExp(match.replaceAll("\\i", "[A-Za-z_$][\\w$]*"));
  } catch (e) {
    return `${e}`;
  }
}
export function compileReplace(match: string) {
  return match.replaceAll("$self", 'Vencord.Plugins.plugins["YourPlugin"]');
}

export function stringifyReplaceCode(
  find: string,
  match: string,
  replace: string
) {
  return `{
    find: ${JSON.stringify(find)},
    replacement: {
        match: /${match.replace(/(?<!\\)\//g, "\\/")}/,
        replace: ${JSON.stringify(replace)}
    }
}`.trim();
}
