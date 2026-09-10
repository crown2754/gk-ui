import { css } from "lit";

export const messageProviderStyles = css`
  :host {
    display: contents;
  }
`;

/** Injected onto the body portal node (not shadow). */
export const messageContainerCssText = `
.gk-message-container {
  position: fixed;
  z-index: 4000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
  padding: 12px;
  box-sizing: border-box;
}
.gk-message-container--top {
  top: 0; left: 50%; transform: translateX(-50%);
  align-items: center;
}
.gk-message-container--top-left {
  top: 0; left: 0; align-items: flex-start;
}
.gk-message-container--top-right {
  top: 0; right: 0; align-items: flex-end;
}
.gk-message-container--bottom {
  bottom: 0; left: 50%; transform: translateX(-50%);
  align-items: center;
  flex-direction: column-reverse;
}
.gk-message-container--bottom-left {
  bottom: 0; left: 0; align-items: flex-start;
  flex-direction: column-reverse;
}
.gk-message-container--bottom-right {
  bottom: 0; right: 0; align-items: flex-end;
  flex-direction: column-reverse;
}
`;
