import { INITIAL_Z_INDEX, WINDOW_CONFIG } from '#constants';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const useWindowStore = create(
     immer((set) => ({
          windows: WINDOW_CONFIG,
          nextZIndex: INITIAL_Z_INDEX + 1,

          openWindow: (windowKey, data = null) => set((state) => {
               const win = state.windows[windowKey];
               // Defensive: if the windowkey is invalid, do nothing
               if (!win) return;
               
               win.isOpen = true;
               win.zIndex = state.nextZIndex;
               win.data = data ?? win.data;
               state.nextZIndex++;
          }),
          
          closeWindow: (windowKey) => set((state) => {
               const win = state.windows[windowKey];
               // Defensive: if the windowkey is invalid, do nothing
               if (!win) return;

               win.isOpen = false;
               win.zIndex = INITIAL_Z_INDEX;
               win.data = null;
          }),

          // Minimize a window: mark minimized and close the visible window
          minimizeWindow: (windowKey) => set((state) => {
               const win = state.windows[windowKey];
               if (!win) return;

               win.isMinimized = true;
               win.isOpen = false;
               // reset zIndex so it falls behind
               win.zIndex = INITIAL_Z_INDEX;
          }),

          // Toggle maximize: expand/restores the window and bring to front
          toggleMaximize: (windowKey) => set((state) => {
               const win = state.windows[windowKey];
               if (!win) return;

               // toggle maximized state
               win.isMaximized = !win.isMaximized;

               // when maximizing, ensure it's open and on top
               if (win.isMaximized) {
                    win.isOpen = true;
                    win.isMinimized = false;
                    win.zIndex = state.nextZIndex;
                    state.nextZIndex++;
               } else {
                    // when restoring, keep it open and bring to front
                    win.isOpen = true;
                    win.zIndex = state.nextZIndex;
                    state.nextZIndex++;
               }
          }),

          focusWindow: (windowKey) => set((state) => {
               const win = state.windows[windowKey];
               win.zIndex = state.nextZIndex++;
          }),
     }))
);

export default useWindowStore;