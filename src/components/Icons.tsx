import React from "react";

type Props = React.SVGProps<SVGSVGElement>;

export function WarningIcon(props: Props) {
  return (
    <svg
      {...props}
      aria-hidden="true"
      role="img"
      width="20"
      height="20"
      viewBox="0 0 20 20"
    >
      <path
        d="M10 0C4.486 0 0 4.486 0 10C0 15.515 4.486 20 10 20C15.514 20 20 15.515 20 10C20 4.486 15.514 0 10 0ZM9 4H11V11H9V4ZM10 15.25C9.31 15.25 8.75 14.691 8.75 14C8.75 13.31 9.31 12.75 10 12.75C10.69 12.75 11.25 13.31 11.25 14C11.25 14.691 10.69 15.25 10 15.25Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
      ></path>
    </svg>
  );
}

export function InfoIcon(props: Props) {
  return (
    <svg
      {...props}
      aria-hidden="true"
      role="img"
      width="16"
      height="16"
      viewBox="0 0 12 12"
    >
      <path
        fill="currentColor"
        d="M6 1C3.243 1 1 3.244 1 6c0 2.758 2.243 5 5 5s5-2.242 5-5c0-2.756-2.243-5-5-5zm0 2.376a.625.625 0 110 1.25.625.625 0 010-1.25zM7.5 8.5h-3v-1h1V6H5V5h1a.5.5 0 01.5.5v2h1v1z"
      ></path>
    </svg>
  );
}

export function DangerIcon(props: Props) {
  return (
    <svg
      {...props}
      aria-hidden="true"
      role="img"
      width="24"
      height="24"
      viewBox="0 0 14 14"
    >
      <path
        fill="currentColor"
        d="M7.02799 0.333252C3.346 0.333252 0.361328 3.31792 0.361328 6.99992C0.361328 10.6819 3.346 13.6666 7.02799 13.6666C10.71 13.6666 13.6947 10.6819 13.6947 6.99992C13.6947 3.31792 10.7093 0.333252 7.02799 0.333252ZM10.166 9.19525L9.22333 10.1379L7.02799 7.94325L4.83266 10.1379L3.89 9.19525L6.08466 6.99992L3.88933 4.80459L4.832 3.86259L7.02733 6.05792L9.22266 3.86259L10.1653 4.80459L7.97066 6.99992L10.166 9.19525Z"
      ></path>
    </svg>
  );
}

export function PositiveIcon(props: Props) {
  return (
    <svg
      {...props}
      aria-hidden="true"
      role="img"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.99991 16.17L4.82991 12L3.40991 13.41L8.99991 19L20.9999 7.00003L19.5899 5.59003L8.99991 16.17Z"
      ></path>
    </svg>
  );
}
