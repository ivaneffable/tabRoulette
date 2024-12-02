import { interpolate } from "d3-interpolate";

const ROUNDS = 3;
const START_INTERVAL = 100;
const END_INTERVAL = 1000;

let rouletterRunning = false;

const interpolator = interpolate(START_INTERVAL, END_INTERVAL);

function startInterval(callback: () => void, interval: number) {
  let intervalId = setInterval(callback, interval);
  return {
    stop: () => clearInterval(intervalId),
    changeInterval: (newInterval: number) => {
      clearInterval(intervalId);
      intervalId = setInterval(callback, newInterval);
    },
  };
}

chrome.action.onClicked.addListener(async () => {
  if (rouletterRunning) {
    return;
  }

  rouletterRunning = true;
  const currentWindow = await chrome.windows.getCurrent();
  const windowTabs = await chrome.tabs.query({
    windowId: currentWindow.id,
  });
  const numTabs = windowTabs.length;
  const randomTab = windowTabs[Math.floor(Math.random() * numTabs)];

  let tabJumps = numTabs * ROUNDS;
  const selectedTabIndex = windowTabs.findIndex((tab) => tab.active);
  let nextTabIndex = selectedTabIndex;
  const { changeInterval, stop } = startInterval(() => {
    nextTabIndex = (nextTabIndex + 1) % numTabs;
    const nextTab = windowTabs[nextTabIndex];
    chrome.tabs.update(nextTab.id!, { active: true });

    tabJumps--;
    if (tabJumps <= 0 && nextTab.id === randomTab.id) {
      stop();
      rouletterRunning = false;
    } else if (tabJumps % numTabs === 0) {
      const newInterval = interpolator(1 - tabJumps / (numTabs * ROUNDS));
      changeInterval(newInterval);
    }
  }, START_INTERVAL);
});
