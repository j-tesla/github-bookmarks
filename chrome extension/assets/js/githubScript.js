const elementIds = {
  li: "bookmarking-li",
  bookmarkDiv: "bookmark-div",
  unbookmarkDiv: "unbookmark-div",
  bookmarkBtn: "bookmark-div",
  unbookmarkBtn: "unbookmark-div",
}

const pageheadActionsClass = "pagehead-actions";

const bookmarkButtonHTML = `
<button id="${elementIds.bookmarkBtn}" class="btn btn-sm">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="transparent" stroke="currentColor" stroke-width="1" class="bi mr-1 bookmark" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>
  </svg>
  <span data-view-component="true" class="py-2">Bookmark</span>
</button>
`;

const unbookmarkButtonHTML = `
<button id="${elementIds.unbookmarkBtn}" class="btn btn-sm">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi mr-1 bookmark-fill" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>
  </svg>
  <span data-view-component="true" class="py-2">Unbookmark</span>
</button>
`

const bookmarkingElement = () => {
  let bookmark = document.createElement("li");
  bookmark.id = "bookmarking-li";
  let bookmarkButtonDiv = document.createElement('div');
  bookmarkButtonDiv.id = elementIds.bookmarkDiv;
  bookmarkButtonDiv.className = "hidden";
  bookmarkButtonDiv.innerHTML = bookmarkButtonHTML;

  let unbookmarkButtonDiv = document.createElement('div');
  unbookmarkButtonDiv.id = elementIds.unbookmarkDiv;
  unbookmarkButtonDiv.className = "hidden";
  unbookmarkButtonDiv.innerHTML = unbookmarkButtonHTML;

  bookmark.appendChild(bookmarkButtonDiv);
  bookmark.appendChild(unbookmarkButtonDiv);
  return bookmark;
}


const getRepo = () => {
  const metaTags = document.getElementsByTagName('meta');

  for (const metaTag of metaTags) {
    if (metaTag.getAttribute("name") === "octolytics-dimension-repository_nwo") {
      return metaTag.getAttribute("content");
    }
  }
  return null;
}

const adjustHidden = async (repo) => {
  let bookmarkBtnDiv = document.getElementById(elementIds.bookmarkDiv);
  let unbookmarkBtnDiv = document.getElementById(elementIds.unbookmarkDiv);
  const bookmarks = await getBookmarks();
  if (bookmarks.includes(repo)) {
    bookmarkBtnDiv.className = "hidden";
    unbookmarkBtnDiv.className = "";
  } else {
    bookmarkBtnDiv.className = "";
    unbookmarkBtnDiv.className = "hidden";
  }
}


const renderBookmarkingElement = async (adjustOnly = false) => {
  const repo = getRepo();
  if (!repo) return;
  if (!adjustOnly) {
    let actions = document.getElementsByClassName(pageheadActionsClass);
    if (actions.length !== 1) return;
    actions = actions[0];

    let bookmarkLi = document.getElementById(elementIds.li);
    if (!bookmarkLi) {
      actions.appendChild(bookmarkingElement());

      const clickedBookmarkBtn = async (_e) => {
        const bookmarks = await getBookmarks();
        if (bookmarks.includes(repo)) {
          console.error(`${repo} which is already bookmarked is bookmarked`);
          return;
        }

        await setBookmarks([...bookmarks, repo]);
        await adjustHidden(repo);

      }
      const clickedUnbookmarkBtn = async (_e) => {
        const bookmarks = await getBookmarks();
        if (!bookmarks.includes(repo)) {
          console.error(`${repo} which not bookmarked is unbookmarked`);
          return;
        }

        await setBookmarks(bookmarks.filter((val) => (val !== repo)));
        await adjustHidden(repo);
      }

      const bookmarkButton = document.getElementById(elementIds.bookmarkBtn);
      const unbookmarkButton = document.getElementById(elementIds.unbookmarkBtn);

      bookmarkButton.onclick = clickedBookmarkBtn;
      unbookmarkButton.onclick = clickedUnbookmarkBtn;

    }
  }
  await adjustHidden(repo);
}


const messageListener = async (message, _sender, _sendResponse) => {
  if (message.type === "BOOKMARKS_UPDATED") {
    renderBookmarkingElement(true);
  }
}

renderBookmarkingElement();

chrome.runtime.onMessage.addListener(messageListener);
