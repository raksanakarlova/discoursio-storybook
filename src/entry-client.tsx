// @refresh reload
import { StartClient, mount } from '@solidjs/start/client'

mount(() => <StartClient />, document.getElementById('app') || document.body)

// if (import.meta.env.PROD && "serviceWorker" in navigator) {
//   // Use the window load event to keep the page load performant
//   window.addEventListener("load", () => {
//     navigator.serviceWorker.register(`/sw.js`);
//   });
// }
