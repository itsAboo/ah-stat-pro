import { useCallback, useEffect } from "react";
import { useBlocker } from "react-router";

export function useLeaveFormConfirm(shouldBlock: boolean, message: string) {
  const blocker = useBlocker(useCallback(() => shouldBlock, [shouldBlock]));
  useEffect(() => {
    if (blocker.state === "blocked") {
      const confirmed = window.confirm(message);
      if (confirmed) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker, message]);
}

export function useUnloadWarning(when: boolean) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!when) return;

      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [when]);
}
