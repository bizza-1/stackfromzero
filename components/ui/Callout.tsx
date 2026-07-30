import type { ReactNode } from "react";

type CalloutType = "tip" | "info" | "warning" | "danger";

type CalloutProps = {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
};

const config: Record<
  CalloutType,
  { className: string; icon: string; defaultTitle: string }
> = {
  tip: {
    className: "alert-success",
    icon: "bi-lightbulb-fill",
    defaultTitle: "Tip",
  },
  info: {
    className: "alert-info",
    icon: "bi-info-circle-fill",
    defaultTitle: "Note",
  },
  warning: {
    className: "alert-warning",
    icon: "bi-exclamation-triangle-fill",
    defaultTitle: "Warning",
  },
  danger: {
    className: "alert-danger",
    icon: "bi-x-octagon-fill",
    defaultTitle: "Careful",
  },
};

export default function Callout({ type = "tip", title, children }: CalloutProps) {
  const { className, icon, defaultTitle } = config[type];

  return (
    <div className={`callout alert ${className} d-flex gap-3 rounded-3 my-4`} role="note">
      <i className={`bi ${icon} fs-5 mt-1`} aria-hidden="true" />
      <div>
        <div className="fw-bold mb-1">{title ?? defaultTitle}</div>
        <div className="callout-body">{children}</div>
      </div>
    </div>
  );
}
