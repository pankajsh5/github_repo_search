const APIURL = 'https://api.github.com/users/';

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const flag=true;

// Dark mode toggle functionality
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
  
    const darkModeToggleBtn = document.getElementsByClassName("dark-mode-toggle")[0];
    if (flag) {
      darkModeToggleBtn.innerText = 'Dark-mode';
      return;
    }
    if (!flag) {
      darkModeToggleBtn.innerText = 'Light-mode';
      return;
    }
  });
  

async function getUser(username) {
    try {
        const { data } = await axios(APIURL + username);
        createUserCard(data);
        console.log(data);
        getRepos(username);
    } catch (err) {
        if (err.response && err.response.status === 404) {
            createErrorCard('No profile with this Username');
        } else {
            createErrorCard('An error occurred while fetching data');
        }
    }
}

async function getRepos(username, page = 1, perPage = 5, sort = 'created') {
    try {
        const { data } = await axios(`${APIURL}${username}/repos?sort=${sort}&page=${page}&per_page=${perPage}`);
        addReposToCard(data);
    } catch (err) {
        createErrorCard('Problem Fetching Repos');
    }
}

function createUserCard(user) {
    const cardHTML = `
        <div class="card">
            <div>
                <img src="${user.avatar_url}" alt="${user.login}" class="avatar">
            </div>
            <div class="user-info">
                <h2>${user.login}</h2>
                <p>${user.html_url}</p>
                <ul>
                    <li>${user.followers} <strong>Followers</strong></li>
                    <li>${user.following} <strong>Following</strong></li>
                    <li>${user.public_repos} <strong>Repos</strong></li>
                </ul>

                <div id="repos"></div>
                <button id="showMoreBtn" onclick="showAllRepos('${user.login}')">Show More</button>
            </div>
        </div>
    `;
    main.innerHTML = cardHTML;
}

function createErrorCard(msg) {
    const cardHTML = `
        <div class="card">
            <h1>${msg}</h1>
        </div>
    `;
    main.innerHTML = cardHTML;
}

function addReposToCard(repos) {
    const reposEl = document.getElementById('repos');

    reposEl.innerHTML = ''; // Clear previous repos

    repos.forEach(repo => {
        const repoEl = document.createElement('a');
        repoEl.classList.add('repo');
        repoEl.href = repo.html_url;
        repoEl.target = '_blank';
        repoEl.innerText = repo.name;

        reposEl.appendChild(repoEl);
    });
}

async function showAllRepos(username) {
    const showMoreBtn = document.getElementById('showMoreBtn');
    const showAll = !showMoreBtn.classList.contains('show-all');
    showMoreBtn.textContent = showAll ? 'Show Less' : 'Show More';
    showMoreBtn.classList.toggle('show-all');

    // Use the "showAll" flag to determine whether to load all repos or reset to the first page
    if (showAll) {
        // Load all repos
        const { data } = await axios(`${APIURL}${username}/repos?sort=created&per_page=100`);
        addReposToCard(data);
    } else {
        // Reset to the first page
        getRepos(username);
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const user = search.value;

    if (user) {
        getUser(user);

        search.value = '';
    }
});
