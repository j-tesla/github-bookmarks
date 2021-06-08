const getCardHTML = async (repo) => {
  let description = "";
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`);
    const response_json = await response.json();
    description = response_json.description;
    if (!description) {
      description = "";
    }
  } catch (e) {
    console.error(e);
    return null;
  }
  const url = `https://github.com/${repo}`;

  return `
  <div class="card-body">
    <a class="card-link" href="${url}" style="color: rgb(17,17,17);" target="_blank">
      <h4>${repo}</h4>
    </a>
    <h6 class="text-muted card-subtitle mb-2">${description}</h6>
    <button class="btn btn-secondary btn-sm unbookmark-btn" data-bss-hover-animate="pulse" type="button" repo-name="${repo}">
      <i class="fa fa-bookmark" style="padding: 3px;"></i><span style="padding: 7px;margin-left: 2px;">Unbookmark</span>
    </button>
  </div>
  `;

}

const unbookmark = async (element) => {
  const repo = element.getAttribute("repo-name");
  while (element && element.className !== "card") {
    element = element.parentElement
  }

  element.remove();
  const bookmarks = await getBookmarks();
  await setBookmarks(bookmarks.filter(r => r !== repo));

}
const handleClick = async (event) => {
  if (!event) {
    return;
  }
  let element = event.target;
  if (element instanceof HTMLElement) {
    // Climb up the document tree from the target of the event
    while (element) {
      if (element.nodeName === "BUTTON" && /unbookmark-btn/.test(element.className)) {
        await unbookmark(element);
        break;
      }

      element = element.parentNode;
    }
  }
}

const addBookmarkCards = async (cardGroup) => {
  const bookmarks = await getBookmarks();
  for (const repo of bookmarks) {
    let card = document.createElement('div');
    card.className = "card";
    card.setAttribute("repo-name", repo);
    card.innerHTML = await getCardHTML(repo);
    cardGroup.appendChild(card);
  }
}

const main = async () => {
  let cardGroup = document.getElementById("repo-cards");
  if (cardGroup) {
    await addBookmarkCards(cardGroup);
  }


  if (document.addEventListener) {
    document.addEventListener("click", handleClick, false);
  } else if (document.attachEvent) {
    document.attachEvent("onclick", handleClick);
  }
}

main();

getCardHTML("j-tesla/space-shooter");
