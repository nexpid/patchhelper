"use client";

import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BuildAPIResponse } from "./api/build/types";
import Input from "@/components/Input";
import {
  compileMatch,
  compileReplace,
  searchWebpack,
  stringifyReplaceCode,
} from "@/lib/modules";
import Codeblock from "@/components/Codeblock";
import { Change, diffWordsWithSpace } from "diff";
import { checkPasted } from "@/lib/paste";
import HelpMessage, { HelpMessageTypes } from "@/components/HelpMessage";
import ChannelSelect from "@/components/ChannelSelect";

export default function Home() {
  const [modStatus, setModStatus] = useState<null | [number, number] | true>(
    null
  );
  const [modError, setModError] = useState<false | string>(false);

  const [channel, setChannel] = useState<"stable" | "ptb" | "canary">("canary");
  const channelRef = useRef<HTMLSelectElement>();

  const modules = useRef<typeof window.modules>({});
  const build = useRef<typeof window.build>();

  const modSetters = useRef({ setModStatus, setModError });
  modSetters.current = { setModStatus, setModError };
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/build?channel=${channel}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok)
          return modSetters.current.setModError(
            `request error: status ${res.status}`
          );

        res.json().then(async (data: BuildAPIResponse) => {
          modSetters.current.setModStatus([0, data.modules.length]);
          build.current = data.build;

          let finished = 0,
            total = data.modules.length,
            failed = 0;
          const promises = await Promise.all(
            data.modules.map((path) =>
              fetch(
                `/api/modules?modulePath=${encodeURIComponent(
                  path
                )}&channel=${channel}`,
                {
                  signal: controller.signal,
                }
              )
                .then((mod) => mod.text())
                .then((res) => {
                  finished++;

                  if (res.length < 100) console.log(res);

                  const code = res.replaceAll(
                    ".webpackChunkdiscord_app",
                    `.webpack[${JSON.stringify(path)}]`
                  );
                  (0, eval)(code);

                  const mods = window.webpack[path]?.[0]?.[1];

                  if (mods)
                    for (const [k, v] of Object.entries(mods))
                      modules.current[k] = v.toString();

                  modSetters.current.setModStatus([finished, total]);
                  return true;
                })
                .catch((e) => {
                  if (e?.name !== "AbortError") {
                    failed++;
                    modSetters.current.setModError(
                      `Failed to load ${failed} module(s)`
                    );
                  }
                  total--;

                  modSetters.current.setModStatus([finished, total]);
                  return false;
                })
            )
          );

          if (promises.filter((x) => !x)[0] !== false)
            modSetters.current.setModStatus(true);
        });
      })
      .catch(
        (e) =>
          e?.name !== "AbortError" &&
          modSetters.current.setModError(`request error: ${e?.message ?? e}`)
      );

    return () => controller.abort();
  }, [channel]);

  useEffect(() => {
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    console.log(
      "%cHello!!!!%c\n\nInspect fetched data using %cwindow.modules%c, %cwindow.build%c and %cwindow.webpack%c!\nHave fun!!!",
      `font-size: 36px; font-family: "gg sans"; color: ${
        dark ? "#91c7eb" : "#2578b0"
      }`,
      'font-size: 20px; font-family: "gg sans"',
      `font-size: 20px; background-color: ${
        dark ? "#1f1f1f" : "#cecfd4"
      }; border-radius: 4px; font-family: "Consolas"; padding-left: 4px; padding-right: 4px;`,
      'font-size: 20px; font-family: "gg sans"',
      `font-size: 20px; background-color: ${
        dark ? "#1f1f1f" : "#cecfd4"
      }; border-radius: 4px; font-family: "Consolas"; padding-left: 4px; padding-right: 4px;`,
      'font-size: 20px; font-family: "gg sans"',
      `font-size: 20px; background-color: ${
        dark ? "#1f1f1f" : "#cecfd4"
      }; border-radius: 4px; font-family: "Consolas"; padding-left: 4px; padding-right: 4px;`,
      'font-size: 20px; font-family: "gg sans"'
    );
  }, []);

  useEffect(() => {
    window.webpack ??= {};
    window.modules = modules.current;
    window.build = build.current;
  }, [modules, build]);

  const [findInput, setFindInput] = useState("");
  const [matchInput, setMatchInput] = useState("");
  const [replaceInput, setReplaceInput] = useState("");

  const makeDiff = (
    src: string,
    patched: string,
    match: RegExpMatchArray | null
  ) => {
    if (!match || src === patched) return null;

    const size = patched.length - src.length;

    const start = Math.max(0, match.index! - 200);
    const end = Math.min(src.length, match.index! + match[0].length + 200);
    const endPatched = end + size;

    const ctx = src.slice(start, end);
    const ctxPatched = patched.slice(start, endPatched);

    return diffWordsWithSpace(ctx, ctxPatched);
  };

  const { module, findError, match, matchError, diff } = useMemo(() => {
    const obj: {
      module: [string, string] | null;
      findError?: string;
      match: string[];
      matchError?: string;
      diff: Change[];
    } = {
      module: null,
      findError: undefined,
      match: [],
      matchError: undefined,
      diff: [],
    };
    if (!findInput) return obj;

    const candidates = searchWebpack(modules.current, [findInput]);
    const keys = Object.keys(candidates);
    const results = keys.length;

    if (results === 0)
      return {
        ...obj,
        findError: "No match. Perhaps that module is lazy loaded?",
      };
    else if (results !== 1)
      return {
        ...obj,
        findError: "Multiple matches. Please refine your filter",
      };

    const found = [keys[0], candidates[keys[0]]];
    obj.module = found as [string, string];

    const matcher = compileMatch(matchInput);
    if (typeof matcher === "string") return { ...obj, matchError: matcher };

    const src = found[1].toString().replaceAll("\n", "");
    const match = src.match(matcher);

    const replacer = compileReplace(replaceInput);
    const patched = src.replace(matcher, replacer);

    obj.match = match ?? [];
    obj.diff = makeDiff(src, patched, match) ?? [];
    return obj;
  }, [findInput, matchInput, replaceInput]);

  const onChangePasted = (
    original: Dispatch<SetStateAction<string>>,
    key: "find" | "match" | "replace"
  ) => {
    return (text: string, previous: string) => {
      const pasted = checkPasted(text, previous);
      if (pasted) {
        setFindInput(pasted.find);
        setMatchInput(pasted.match);
        setReplaceInput(pasted.replace);
        return pasted[key];
      } else original(text);
    };
  };

  return (
    <>
      <HelpMessage messageType={HelpMessageTypes.Warning} className="mb-4">
        This tool loads web modules, not desktop ones. Some patches may not work
      </HelpMessage>
      <h2 className="font-heading-lg-semibold mb-3">Patch Helper</h2>
      {modStatus !== true ? (
        <>
          <h2 className="font-eyebrow flex flex-row items-center mb-2">
            <ChannelSelect
              channel={channel}
              setChannel={setChannel}
              show={false}
            />
            fetching modules...
            {Array.isArray(modStatus) ? ` ${modStatus[0]}/${modStatus[1]}` : ""}
            {build.current && ` — ${build.current}`}
          </h2>
          {modError && (
            <h2 className="text-text-danger-light dark:text-text-danger-dark font-text-xs-normal">
              {modError}
            </h2>
          )}
        </>
      ) : (
        <div className="flex flex-row items-center mb-2">
          <ChannelSelect
            channel={channel}
            setChannel={setChannel}
            show={!build}
          />
          {build && <h2 className="font-eyebrow">build — {build.current}</h2>}
        </div>
      )}
      <div className="divider my-4" />
      <h2 className="font-eyebrow mb-2">find</h2>
      <Input
        disabled={modStatus !== true || !build}
        error={findError}
        onChange={onChangePasted(setFindInput, "find")}
        value={findInput}
      />
      <h2 className="font-eyebrow mb-2">match</h2>
      <Input
        disabled={modStatus !== true || !build}
        onChange={onChangePasted(setMatchInput, "match")}
        error={matchError}
        value={matchInput}
      />
      <h2 className="font-eyebrow mb-2">replacement</h2>
      <Input
        disabled={modStatus !== true || !build}
        onChange={onChangePasted(setReplaceInput, "replace")}
        value={replaceInput}
      />
      <h2 className="font-eyebrow mb-2">cheat sheet</h2>
      <div className="font-size14 select-text">
        <code>\i</code>: Special regex escape sequence that matches identifiers
        (varnames, classnames, etc.)
        <br />
        <code>$$</code>: Insert a $<br />
        <code>$&</code>: Insert the entire match
        <br />
        <code>$`</code>: Insert the substring before the match
        <br />
        <code>$&apos;</code>: Insert the substring after the match
        <br />
        <code>$n</code>: Insert the nth capturing group ($1, $2...)
        <br />
        <code>$self</code>: Insert the plugin instance
      </div>
      <div className="divider my-4" />
      {(modStatus !== true || build) && (
        <>
          {module && (
            <>
              <h2 className="font-eyebrow mb-2">module {module[0]}</h2>
              {!!match[0] && (
                <>
                  <h2 className="font-eyebrow mb-2">match</h2>
                  <Codeblock text={match[0].slice(0, 250)} language="js" />
                  {match[1] && (
                    <Codeblock
                      text={match
                        .slice(1)
                        .map((x, i) => `Group ${i + 1}: ${x.slice(0, 250)}`)
                        .join("\n")}
                      language="xml"
                    />
                  )}
                </>
              )}
              {!!diff?.length && (
                <>
                  <h2 className="font-eyebrow mb-2">diff</h2>
                  {diff.map((x, i) => (
                    <div
                      key={i}
                      className={`font-code leading-none overflow-clip ${
                        x.added
                          ? "text-green-700 dark:text-green-500"
                          : x.removed
                          ? "text-red-700 dark:text-red-500"
                          : "text-slate-700 dark:text-slate-500"
                      }`}
                    >
                      {x.value}
                    </div>
                  ))}
                  <div className="mb-2" />
                </>
              )}
              {!!matchInput && !!replaceInput && (
                <>
                  <h2 className="font-eyebrow mb-2">code</h2>
                  <Codeblock
                    text={stringifyReplaceCode(
                      findInput,
                      matchInput,
                      replaceInput
                    )}
                    language="js"
                  />
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
