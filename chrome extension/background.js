console.log('background');

const openBookmarks = async (_tab) => {
  await chrome.tabs.create({url: "bookmarks.html"});
}

const messageListener = async (request, _sender, _sendResponse) => {
  if (request.type === "BOOKMARKS_UPDATED") {
    const githubTabs = await chrome.tabs.query({url: "*://github.com/*"});
    const bookmarksTabs = await chrome.tabs.query({url: chrome.runtime.getURL("bookmarks.html")});
    for (const {id: tabId} of [...githubTabs, ...bookmarksTabs]) {
      chrome.tabs.sendMessage(tabId, {type: "BOOKMARKS_UPDATED"});
    }
  }
}

chrome.action.onClicked.addListener(openBookmarks);

chrome.runtime.onMessage.addListener(messageListener);
