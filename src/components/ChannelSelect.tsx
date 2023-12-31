import { useState } from "react";
import styles from "./ChannelSelect.module.css";

type Channel = "stable" | "ptb" | "canary";
const Option = ({
  value,
  label,
  set,
}: {
  value: Channel;
  label: string;
  set: (val: Channel) => void;
}) => {
  return (
    <button
      onClick={() => set(value)}
      className="px-5 py-1 bg-background-modifier-accent-light dark:bg-background-modifier-accent-dark rounded-lg"
    >
      <h2 className="font-text-sm-medium">{label}</h2>
    </button>
  );
};

export default function ChannelSelect({
  channel,
  setChannel,
  show,
}: {
  channel: string;
  setChannel: (val: Channel) => void;
  show: boolean;
}) {
  const [opened, setOpened] = useState(false);

  const setter = (x: Channel) => {
    setOpened(false);
    setChannel(x);
  };

  return (
    <>
      <button
        className={`rounded-md mr-2 p-[0.35rem] aspect-square font-eyebrow ${styles.fader} flex justify-center items-center`}
        onClick={() => setOpened(!opened)}
      >
        {opened ? "▲" : "▼"}
      </button>
      {show && channel}
      <div
        className={`absolute p-2 bg-background-secondary-light dark:bg-background-secondary-dark rounded-lg ${
          styles.selector
        } ${!opened && "hidden"} flex flex-col gap-1 z-10`}
      >
        <Option value={"stable"} label="Stable" set={setter} />
        <Option value={"ptb"} label="PTB" set={setter} />
        <Option value={"canary"} label="Canary" set={setter} />
      </div>
    </>
  );
}
