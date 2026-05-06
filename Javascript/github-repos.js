(async function () {
    const username = 'M1shmish';
    const grid = document.getElementById('repos-grid');

    async function fetchAllRepos() {
        const repos = [];
        let page = 1;

        while (true) {
            const res = await fetch(
                `https://api.github.com/users/${username}/repos?sort=updated&per_page=100&page=${page}`
            );
            if (!res.ok) throw new Error('API error');

            const batch = await res.json();
            repos.push(...batch);

            if (batch.length < 100) break;
            page++;
        }

        return repos;
    }

    try {
        const repos = await fetchAllRepos();
        const filtered = repos.filter(r => !r.fork && r.name !== 'Michael-Vilshin.github.io');

        if (filtered.length === 0) {
            grid.innerHTML = '<p>No public repositories found.</p>';
            return;
        }

        grid.innerHTML = filtered.map(repo => `
            <div class="repo-card">
                <div class="repo-card-header">
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-name">${repo.name}</a>
                </div>
                <div class="repo-card-body">
                    <p class="repo-description">${repo.description || 'No description provided.'}</p>
                    <div class="repo-meta">
                        ${repo.language ? `<span class="repo-lang">${repo.language}</span>` : ''}
                        <span class="repo-stars">&#9733; ${repo.stargazers_count}</span>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (_) {
        grid.innerHTML = '<p>Could not load repositories.</p>';
    }
})();
