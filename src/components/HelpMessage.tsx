import styles from "./HelpMessage.module.css";
import { DangerIcon, InfoIcon, PositiveIcon, WarningIcon } from "./Icons";
export enum HelpMessageTypes {
  Warning,
  Info,
  Error,
  Positive,
}

export default function HelpMessage({
  messageType,
  children,
  className,
}: React.PropsWithChildren<{
  messageType: HelpMessageTypes;
  className?: string;
}>) {
  const Icon =
    messageType === HelpMessageTypes.Info
      ? InfoIcon
      : messageType === HelpMessageTypes.Error
      ? DangerIcon
      : messageType === HelpMessageTypes.Positive
      ? PositiveIcon
      : WarningIcon;

  return (
    <div
      className={`flex rounded-[4px] font-[500] p-[8px] w-full box-sizing border-[1px] ${
        styles.container
      } text-info-box-text-light dark:text-info-box-text-dark ${
        messageType === HelpMessageTypes.Info
          ? styles.help
          : messageType === HelpMessageTypes.Error
          ? styles.danger
          : messageType === HelpMessageTypes.Positive
          ? styles.positive
          : styles.warning
      } ${className}`}
    >
      <div className={styles.iconDiv}>
        <Icon />
      </div>
      <div className="font-text-sm-medium ml-[10px] flex-1 self-center">
        {children}
      </div>
    </div>
  );
}
