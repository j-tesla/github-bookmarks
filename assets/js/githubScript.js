const bookmarkButtonHTML = `
<button id="bookmark-btn" class="btn btn-sm">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="transparent" stroke="currentColor" stroke-width="1" class="bi mr-1 bookmark" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>
  </svg>
  <span data-view-component="true">Bookmark</span>
</button>
`;

const unbookmarkButtonHTML = `
<button id="unbookmark-btn" class="btn btn-sm">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi mr-1 bookmark-fill" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>
  </svg>
  <span data-view-component="true">Unbookmark</span>
</button>
`

const bookmarkElement = () => {
  let bookmark = document.createElement("li");
  let bookmarkButtonDiv = document.createElement('div');
  bookmarkButtonDiv.setAttribute("id", "bookmark-btn-div");
  bookmarkButtonDiv.innerHTML = bookmarkButtonHTML;

  let unbookmarkButtonDiv = document.createElement('div');
  unbookmarkButtonDiv.setAttribute("id", "unbookmark-btn-div");
  unbookmarkButtonDiv.className = "hidden";
  unbookmarkButtonDiv.innerHTML = unbookmarkButtonHTML;

  bookmark.appendChild(bookmarkButtonDiv);
  bookmark.appendChild(unbookmarkButtonDiv);
  return bookmark;
}

const addBookMarkButton = (actions) => {
  actions.appendChild(bookmarkElement());
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
  let bookmarkBtnDiv = document.getElementById("bookmark-btn-div");
  let unbookmarkBtnDiv = document.getElementById("unbookmark-btn-div");
  const bookmarks = await getBookmarks();
  if (bookmarks.includes(repo)) {
    bookmarkBtnDiv.className = "hidden";
    unbookmarkBtnDiv.className = "";
  } else {
    bookmarkBtnDiv.className = "";
    unbookmarkBtnDiv.className = "hidden";
  }
}

const clickedBookmarkBtn = async (repo) => {
  const bookmarks = await getBookmarks();
  if (bookmarks.includes(repo)) {
    console.error(`${repo} which is already bookmarked is bookmarked`);
    return;
  }

  await setBookmarks([...bookmarks, repo]);
  await adjustHidden(repo);

};

const clickedUnbookmarkBtn = async (repo) => {
  const bookmarks = await getBookmarks();
  if (!bookmarks.includes(repo)) {
    console.error(`${repo} which not bookmarked is unbookmarked`);
    return;
  }

  await setBookmarks(bookmarks.filter((val) => (val !== repo)));
  await adjustHidden(repo);
}

const main = async () => {
  const repo = getRepo();
  if (repo) {
    let actions = document.getElementsByClassName('pagehead-actions');
    if (actions.length === 1) {
      const repo = getRepo();

      actions = actions[0];
      addBookMarkButton(actions);
      await adjustHidden(repo);

      const bookmarkButton = document.getElementById("bookmark-btn");
      const unbookmarkButton = document.getElementById("unbookmark-btn");
      bookmarkButton.onclick = async () => {
        await clickedBookmarkBtn(repo);
      };
      unbookmarkButton.onclick = async () => {
        await clickedUnbookmarkBtn(repo);
      };
    }
  }
}

main();
