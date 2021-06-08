console.log('background');

const openBookmarks = async (_tab) => {
  await chrome.tabs.create({url: "bookmarks.html"});
}

chrome.action.onClicked.addListener(openBookmarks);
