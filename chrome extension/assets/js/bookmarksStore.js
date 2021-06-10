const getBookmarks = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(["bookmarks"], (result) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }

      if (result.bookmarks) {
        resolve(result.bookmarks);
      }
      resolve([]);
    });
  });
}

const setBookmarks = (repos) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({"bookmarks": repos}, () => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }

      chrome.runtime.sendMessage({type: 'BOOKMARKS_UPDATED'});
      resolve();
    });
  });
}
