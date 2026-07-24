import { useEffect } from "react";

const MOUSE_WHEEL_MULTIPLIER = 3;

const BLOCKED_TARGETS = [
  "a",
  "button",
  "input",
  "textarea",
  "select",
  "video",
  "canvas",
  "[contenteditable='true']",
  "[role='dialog']",
  "[data-fast-scroll-ignore]",
].join(",");

function shouldKeepNativeScroll(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  if (target.closest(BLOCKED_TARGETS)) return true;

  let element: Element | null = target;
  while (element && element !== document.documentElement && element !== document.body) {
    const style = window.getComputedStyle(element);
    const canScroll = /(auto|scroll)/.test(style.overflowY) && element.scrollHeight > element.clientHeight + 1;
    if (canScroll) return true;
    element = element.parentElement;
  }

  return false;
}

function normalizeWheelDelta(event: WheelEvent) {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return event.deltaY * 18;
  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) return event.deltaY * window.innerHeight;
  return event.deltaY;
}

export default function FastScrollController() {
  useEffect(() => {
    let pendingDelta = 0;
    let animationFrame = 0;

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey || shouldKeepNativeScroll(event.target)) return;

      const delta = normalizeWheelDelta(event);
      if (!Number.isFinite(delta) || delta === 0) return;

      // Small pixel deltas are usually a touchpad. Keep its native momentum and
      // only accelerate discrete mouse-wheel notches.
      const isDiscreteMouseWheel = event.deltaMode !== WheelEvent.DOM_DELTA_PIXEL || Math.abs(delta) >= 40;
      if (!isDiscreteMouseWheel) return;

      event.preventDefault();
      pendingDelta += delta * MOUSE_WHEEL_MULTIPLIER;
      if (animationFrame) return;

      animationFrame = window.requestAnimationFrame(() => {
        const scrollingElement = document.scrollingElement;
        if (scrollingElement) scrollingElement.scrollTop += pendingDelta;
        pendingDelta = 0;
        animationFrame = 0;
      });
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return null;
}
