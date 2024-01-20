let isLoading = false;
const reposPerPage = 10; // Fixed number of repositories per page

function fetchRepositories(page = 1) {
  if (isLoading) {
    return;
  }

  const username = document.getElementById('username').value;

  if (!username) {
    alert('Please enter a GitHub username.');
    return;
  }

  const userUrl = `https://api.github.com/users/${username}`;
  const reposUrl = `https://api.github.com/users/${username}/repos?per_page=${reposPerPage}&page=${page}`;

  isLoading = true;
  showLoader();

  // Fetch user profile information
  fetch(userUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`GitHub API Error: ${response.statusText}`);
      }
      return response.json();
    })
    .then((user) => {
      displayUserProfile(user);
    })
    .catch((error) => {
      alert(`Error fetching user profile: ${error.message}`);
    });

  // Fetch repositories
  fetch(reposUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`GitHub API Error: ${response.statusText}`);
      }
      return response.json();
    })
    .then((repositories) => {
      displayRepositories(repositories);
      displayPagination(repositories, page);
    })
    .catch((error) => {
      alert(`Error fetching repositories: ${error.message}`);
    })
    .finally(() => {
      isLoading = false;
      hideLoader();
    });
}

function displayUserProfile(user) {
  const userProfileContainer = document.getElementById('user-profile-container');
  userProfileContainer.innerHTML = '';

  const userProfile = document.createElement('div');
  userProfile.id = 'user-profile';

  const userAvatar = document.createElement('div');
  userAvatar.id = 'user-avatar';
  const avatarImage = document.createElement('img');
  avatarImage.src = user.avatar_url;
  avatarImage.alt = 'Profile Picture';
  userAvatar.appendChild(avatarImage);

  const userInfo = document.createElement('div');
  userInfo.id = 'user-info';

  const userHeader = document.createElement('div');
  userHeader.id = 'user-header';
  const userName = document.createElement('h2');
  userName.textContent = user.login;
  userHeader.appendChild(userName);

  const githubLink = document.createElement('p');
  
  githubLink.innerHTML = `<i class="fa fa-link" aria-hidden="true"></i> <a href="${user.html_url}" target="_blank">${user.html_url}</a>`;
  userHeader.appendChild(githubLink);

  userInfo.appendChild(userHeader);

  const userBio = document.createElement('p');
  userBio.textContent = user.bio || 'No bio available';
  userInfo.appendChild(userBio);

  const userLocation = document.createElement('p');
  userLocation.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${user.location || 'Not specified'}`;
  userInfo.appendChild(userLocation);

  const userTwitter = document.createElement('p');
  userTwitter.innerHTML = `Twitter: ${user.twitter_username ? `<a href="https://twitter.com/${user.twitter_username}" target="_blank">${user.twitter_username}</a>` : 'Not specified'}`;
  userInfo.appendChild(userTwitter);

  userProfile.appendChild(userAvatar);
  userProfile.appendChild(userInfo);

  userProfileContainer.appendChild(userProfile);
}

function displayRepositories(repositories) {
  const repositoriesList = document.getElementById('repositories-list');
  repositoriesList.innerHTML = '';

  if (repositories.length === 0) {
    repositoriesList.innerHTML = '<p>No repositories found.</p>';
    return;
  }

  // Create a container for repositories
  const repositoriesContainer = document.createElement('div');
  repositoriesContainer.id = 'repositories-container';

  repositories.forEach((repo, index) => {
    const repoContainer = document.createElement('div');
    repoContainer.className = 'repository-container';

    const repoName = document.createElement('h2');
    repoName.textContent = repo.name;
    repoContainer.appendChild(repoName);

    // Add repository description
    const repoDescription = document.createElement('p');
    repoDescription.textContent = repo.description || 'No description available';
    repoContainer.appendChild(repoDescription);

    const repoTopics = document.createElement('div');
    repoTopics.className = 'repository-topics';

    // Join the topics with spaces
    const topicsText = repo.topics.join(' ');

    // Split topics and create individual span elements
    const topicsArray = repo.topics.map(topic => {
      const topicSpan = document.createElement('span');
      topicSpan.className = 'topic-tag';
      topicSpan.textContent = topic;
      return topicSpan;
    });

    repoTopics.append(...topicsArray);

    repoContainer.appendChild(repoTopics);

    repositoriesContainer.appendChild(repoContainer);
  });

  repositoriesList.appendChild(repositoriesContainer);

  // Show pagination after fetching repositories
  document.getElementById('pagination').style.display = 'block';
}

function displayPagination(repositories, currentPage) {
    const totalPages = Math.ceil(repositories.length / reposPerPage);
  
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
  
    for (let i = 1; i <= 10; i++) {
      const pageButton = document.createElement('button');
      pageButton.textContent = i;
      pageButton.onclick = () => navigatePages(i);
      if (i === currentPage) {
        pageButton.classList.add('active');
      }
      pagination.appendChild(pageButton);
    }
  }
  
  function navigatePages(page) {
    fetchRepositories(page);
  }
  
  function showLoader() {
    document.getElementById('loader').style.display = 'block';
  }
  
  function hideLoader() {
    document.getElementById('loader').style.display = 'none';
  }
  