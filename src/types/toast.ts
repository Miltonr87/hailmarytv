import type * as React from "react";
import type { Toast } from "@/components/ui/toast";

export type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

export type ToastActionElement = React.ReactElement<
    typeof import("@/components/ui/toast").ToastAction
>;
