import useWindowStore from "#store/window.js";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useLayoutEffect, useRef } from "react";

const WindowWrapper = (Component, windowKey) => {
     const Wrapped = (props) => {
          const { focusWindow, windows } = useWindowStore();
          const { isOpen, zIndex } = windows[windowKey];
          const ref = useRef(null);

          useGSAP(() => {
               const el = ref.current;
               if (!el || !isOpen) return;

               el.style.display = "block";

               gsap.fromTo(el, { scale: 0.8, opacity: 0, y: 40 }, { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: "power3.inOut" },
               );
          }, [isOpen]);

          useGSAP(() => {
               const el = ref.current;
               if(!el) return () => {};

               // Use the window header as the drag handle so inner interactive
               // elements (links/buttons) remain tappable. `#window-header` is
               // used across window components as the header element.
               const handle = el.querySelector('#window-header') || el;

               // Prevent page scrolling while dragging on touch devices by
               // blocking `touchmove` during an active drag. This listener is
               // added on drag start and removed on drag end/release.
               const preventTouchMove = (e) => {
                    if (e && typeof e.preventDefault === 'function') e.preventDefault();
                    return false;
               };

               const onPress = () => {
                    try { focusWindow(windowKey); } catch (err) { /* ignore */ }
               };

                    // Elements inside the header that should not start a drag (links,
                    // buttons, window controls). We'll stop propagation for their
                    // pointer/touchstart so Draggable doesn't begin when interacting
                    // with them.
                    const nonDragSelector = '#window-controls, #window-header a, #window-header button, #window-header [data-no-drag], #window-header .close, #window-header .minimize, #window-header .maximize';
                    const nonDragElements = Array.from(el.querySelectorAll(nonDragSelector));
                    const stopPropagation = (ev) => ev.stopPropagation();
                    nonDragElements.forEach((node) => {
                         try {
                              node.addEventListener('pointerdown', stopPropagation);
                              node.addEventListener('touchstart', stopPropagation);
                         } catch (e) {}
                    });

               const onDragStart = () => {
                    try {
                         document.body.classList.add('is-dragging');
                         document.addEventListener('touchmove', preventTouchMove, { passive: false });
                    } catch (e) {
                         // ignore
                    }
               };

               const onRelease = () => {
                    try {
                         document.body.classList.remove('is-dragging');
                         document.removeEventListener('touchmove', preventTouchMove, { passive: false });
                         // Some browsers don't accept the options object when removing
                         // the listener; try again without options as fallback.
                         document.removeEventListener('touchmove', preventTouchMove);
                    } catch (e) {
                         // ignore
                    }
               };

               // Create draggable with a handle and basic options. Using a handle
               // keeps clicks/taps inside the window content functional. Use the
               // header as the trigger when it exists so events in content are
               // not captured by Draggable.
               const triggerEl = (handle && handle !== el) ? handle : el;

               const instances = Draggable.create(el, {
                    type: 'x,y',
                    edgeResistance: 0.65,
                    bounds: document.body,
                    trigger: triggerEl,
                    handle: handle,
                    onPress: onPress,
                    onDragStart: onDragStart,
                    onRelease: onRelease,
                    onDragEnd: onRelease,
               });

               const instance = instances && instances[0];

               return () => {
                    try {
                         if (instance && typeof instance.kill === 'function') instance.kill();
                    } catch (e) {}
                    try {
                         document.removeEventListener('touchmove', preventTouchMove);
                    } catch (e) {}
                    // Cleanup non-drag listeners
                    nonDragElements.forEach((node) => {
                         try {
                              node.removeEventListener('pointerdown', stopPropagation);
                              node.removeEventListener('touchstart', stopPropagation);
                         } catch (e) {}
                    });
               };
          }, []);

          useLayoutEffect(() => {
               const el = ref.current;
               if (!el) return;
               el.style.display = isOpen ? "block" : "none";
          }, [isOpen]);

          return (
               <section id={windowKey} ref={ref} style={{ zIndex }} className="absolute">
                    <Component {...props} />
               </section>
          );
     };

     Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || "Component"})`;


     return Wrapped;
};

export default WindowWrapper;


//higher order component (HOC) that wraps window components to provide common functionality like focus management and z-index handling