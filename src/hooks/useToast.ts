import * as React from "react";
import type { ToastActionElement, ToastProps } from "@/types/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const ACTIONS = {
  ADD: "ADD_TOAST",
  UPDATE: "UPDATE_TOAST",
  DISMISS: "DISMISS_TOAST",
  REMOVE: "REMOVE_TOAST",
} as const;

type ActionType = typeof ACTIONS;

type Action =
  | { type: ActionType["ADD"]; toast: ToasterToast }
  | { type: ActionType["UPDATE"]; toast: Partial<ToasterToast> }
  | { type: ActionType["DISMISS"]; toastId?: string }
  | { type: ActionType["REMOVE"]; toastId?: string };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

let listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

let count = 0;
const genId = () => `${++count % Number.MAX_SAFE_INTEGER}`;

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) return;

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: ACTIONS.REMOVE, toastId });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ACTIONS.ADD:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };
    case ACTIONS.UPDATE:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };
    case ACTIONS.DISMISS: {
      const { toastId } = action;
      if (toastId) addToRemoveQueue(toastId);
      else state.toasts.forEach((t) => addToRemoveQueue(t.id));
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          !toastId || t.id === toastId ? { ...t, open: false } : t
        ),
      };
    }
    case ACTIONS.REMOVE:
      return {
        ...state,
        toasts: action.toastId
          ? state.toasts.filter((t) => t.id !== action.toastId)
          : [],
      };
    default:
      return state;
  }
};

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

type ToastInput = Omit<ToasterToast, "id">;

function toast({ ...props }: ToastInput) {
  const id = genId();
  const update = (newProps: Partial<ToasterToast>) =>
    dispatch({ type: ACTIONS.UPDATE, toast: { ...newProps, id } });
  const dismiss = () => dispatch({ type: ACTIONS.DISMISS, toastId: id });
  dispatch({
    type: ACTIONS.ADD,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => !open && dismiss(),
    },
  });
  return { id, dismiss, update };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);
  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      listeners = listeners.filter((l) => l !== setState);
    };
  }, []);
  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: ACTIONS.DISMISS, toastId }),
  };
}

export { useToast, toast };
