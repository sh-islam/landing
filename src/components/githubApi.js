export async function getRepoNames(){
    const response = await fetch('https://raw.githubusercontent.com/sh-islam/Tools/main/portfolio-website/selectedRepos.txt');
    if (!response.ok) throw new Error('Error fetching repo names. Status code ', response.status);
  
    const data = await response.text();
    const repoArray = data.split(',').map(repo => repo.trim());
    return repoArray;
}

export async function getRepoData(selectedRepos){

    const response = await fetch('https://api.github.com/users/sh-islam/repos');
    if (!response.ok) {
        if (response.status === 403){
            throw new Error('Error fetching repo data. Status code ' + response.status + '. Rate limit exceeded try back in an hour.');
        }
        else { 
            throw new Error('Error fetching repo data. Status code ' + response.status + '.');
        }
    }
    const data = await response.json();
    // Filter repo data by repo names in selectedRepos
    const filteredRepos = data.filter(repo => selectedRepos.includes(repo.name));

    // Extract updated dates and HTML URLs
    const updatedDates = filteredRepos.map(repo => repo.updated_at.slice(0, 10));
    const htmlUrls = filteredRepos.map(repo => repo.html_url);

    // Combine updated dates and HTML URLs into an array of objects
    const repoInfo = filteredRepos.map((repo, index) => ({
        name: repo.name,
        updatedDate: updatedDates[index],
        htmlUrl: htmlUrls[index]
    }));

    return repoInfo; // Return the array of objects
}

export async function getReadMeData(selectedRepos) {
    try {
        const formattedReadmeData = await Promise.all(selectedRepos.map(async repo => {
            try {
                const response = await fetch(`https://api.github.com/repos/sh-islam/${repo}/contents/README.md`);
                if (!response.ok) {
                    if (response.status === 403){
                        throw new Error(`Error fetching README for ${repo}. Status: ${response.status}. API rate limit exceeded. Try back again in an hour.`)
                    }
                    else {
                        throw new Error(`Error fetching README for ${repo}. Status: ${response.status}`);
                    }
                }
                const data = await response.json();
                const readmeContent = atob(data.content);
                const formattedReadme = readmeContent
                    .replace(/\n/g, '<br>\n')
                    .replace(/^#.*$/gm, '')
                    .replace(/^.*$/, '')
                    .replace(/\n\s+- /g, '&nbsp;&nbsp;- ');

                return formattedReadme;
                
            } catch (error) {
                throw error;
            }
        }));
        return formattedReadmeData;
    } catch (error) {
        throw error;
    }
}

export async function getImgLinks(selectedRepos) {
    const imgLinks = await Promise.all(selectedRepos.map(async repo => {
        const response = await fetch(`https://api.github.com/repos/sh-islam/${repo}/contents/demo.png`);
        
        if (response.ok) {
            const data = await response.json();
            return data.download_url;
        } 
        else if (response.status === 403 || response.status === 404) {
            console.log(`Error getImgLinks for ${repo}. Status code ${response.status}.`);
            return 'https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-5529.jpg?w=2000';
        }
        else if (!response.ok) {
            throw new Error(`Error getImgLinks for ${repo}. Status code ${response.status}.`);
        }
    }));

    return imgLinks;
}
