import React, { ReactNode } from "react";

export interface SectionProps {
  children: ReactNode;
}

export function Section({ children }: SectionProps) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

export namespace Section {
  export function Title({ children }: SectionProps) {
    return (
      <div className="mb-1 text-xl font-light italic opacity-60">
        {children}
      </div>
    );
  }

  export function ContentArea({ children }: SectionProps) {
    return <div className="flex flex-col gap-2">{children}</div>;
  }

  export interface KVRowProps {
    title: ReactNode;
    value: ReactNode;
  }

  export function KVRow({ title, value }: KVRowProps) {
    return (
      <div className="flex w-full items-center justify-between">
        <div className="font-light opacity-60">{title}</div>
        <div className="opacity-80">{value}</div>
      </div>
    );
  }
}
