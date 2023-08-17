import React from 'react';
import { useEffect, useState } from 'react';
const GHtoken = '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';
// API to all my repos:
// https://api.github.com/users/sh-islam/repos
// Contents of each repo:
// https://api.github.com/repos/sh-islam/(repo_name)/contents
// README.md data from github is located at:
// https://raw.githubusercontent.com/sh-islam/(repo_name)/main/README.md


// const selectedRepos = ['dino-run', 'Rock-paper-scissors', 'Trees'];

function Project() {
    const [repos, setRepos] = useState([]);
    const [lastUpdated, setLastUpdated] = useState([]);
    const [readme, setReadme] = useState([]);
    const [imgUrls, setImgUrls] = useState([])
    const [projectUrls, setProjectUrls] = useState([]);
    const [apiResponse, setApiResponse] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch the list of selected repos
                const selectedReposResponse = await fetch('https://raw.githubusercontent.com/sh-islam/Tools/main/portfolio-website/selectedRepos.txt');
                if (!selectedReposResponse.ok) {
                    throw new Error(`Request failed with status: ${selectedReposResponse.status}`);
                }
                setApiResponse(selectedReposResponse);
                const selectedReposData = await selectedReposResponse.text();
                const reposArray = selectedReposData.split(',').map(repo => repo.trim());
            
                // Fetch the repository data for the user
                const reposResponse = await fetch('https://api.github.com/users/sh-islam/repos');
                if (!reposResponse.ok) {
                    throw new Error(`Request failed with status: ${reposResponse.status}`);
                }
                const reposData = await reposResponse.json();
    
                // Filter and store selected repos
                const filteredRepos = reposData.filter(repo => reposArray.includes(repo.name));
                setRepos(filteredRepos);

                // Store last updated dates of selected repos 
                const updatedDates = filteredRepos.map(repo => repo.updated_at);
                setLastUpdated(updatedDates);
    
                // Fetch and store additional data for each repo
                const repoPromises = filteredRepos.map(async repo => {
                try {
                    const readmeResponse = await fetch(`https://api.github.com/repos/sh-islam/${repo.name}/contents/README.md`);
                    const imgSrcResp = await fetch(`https://api.github.com/repos/sh-islam/${repo.name}/contents/demo.png`);
                
                    if (!readmeResponse.ok) {
                        throw new Error(`Readme fetch failed for ${repo.name}`);
                    }
                    const readmeData = await readmeResponse.json();
                    const readmeContent = atob(readmeData.content);

                    let imgSrc = '';
                    if (imgSrcResp.status === 200) {
                        const imgSrcData = await imgSrcResp.json();
                        imgSrc = imgSrcData.download_url;
                    } else {
                        imgSrc = 'https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-5529.jpg?w=2000';
                    }

                    return {
                        repo,
                        readmeContent,
                        imgSrc
                    };
                } 


                catch (error) {
                    console.log('Error fetching data for', repo.name, error.message);
                    // Handle the error gracefully by returning default values
                    return {
                        repo,
                        readmeContent: 'Error fetching readme data from GitHub: ' + error.message,
                        imgSrc: 'https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-5529.jpg?w=2000'
                    };
                }
                });

    
            const fetchedRepoData = await Promise.all(repoPromises);

            // Extract data for rendering
            const readmeContents = fetchedRepoData.map(data => data.readmeContent);
            setReadme(readmeContents);

            const imgSrcs = fetchedRepoData.map(data => data.imgSrc);
            setImgUrls(imgSrcs);
    
        } 
        
        catch (error) {
             console.log(`ERROR fetching data: ${error.message}`);
        }

        };
    
        fetchData();
    }, []);
    




    // useEffect(() => {
    //     const fetchJson = async () => {
    //         try {
    //             const selectedReposResponse = await fetch('https://raw.githubusercontent.com/sh-islam/Tools/main/portfolio-website/selectedRepos.txt');
    //             setApiResponse(selectedRepos);
    //             if (!selectedReposResponse.ok){
    //                 throw new Error(`Request failed with status: ${selectedReposResponse.status}`);
    //             }
    //             const selectedReposData = await selectedReposResponse.text();
    //             const reposArray = selectedReposData.split(',').map(repo => repo.trim());
    //             setSelectedRepos(reposArray);

    //             const reposResponse = await fetch('https://api.github.com/users/sh-islam/repos');
    //             setApiResponse(reposResponse);
    //             if (!reposResponse.ok) {
    //                 throw new Error(`Request failed with status: ${reposResponse.status}`);
    //             }
    //             const reposData = await reposResponse.json();
    //             // Keeping only json of selected repos
    //             const filteredRepos = reposData.filter(repo => selectedRepos.includes(repo.name));
    //             setRepos(filteredRepos);
                
    
    //             // Store last updated dates of said repos
    //             const updatedDates = filteredRepos.map(repo => repo.updated_at);
    //             setLastUpdated(updatedDates);

    //             // Store project urls of repos
    //             const htmlUrls = filteredRepos.map(repo => repo.html_url);
    //             setProjectUrls(htmlUrls);
                
    
    //             // Fetch and store README for each repo
    //             const readmeContents = await Promise.all(
    //                 filteredRepos.map(async repo => {
    //                     const readmeResponse = await fetch(`https://api.github.com/repos/sh-islam/${repo.name}/contents/README.md`);
    //                     const readmeData = await readmeResponse.json();
    //                     const readmeContent = atob(readmeData.content); // Decode base64 content
    //                     return readmeContent;
    //                 })
    //             );
    //             setReadme(readmeContents);
    
    //             // Fetch and store demo.png img link for each repo
    //             const imgSrcs = await Promise.all(
    //                 filteredRepos.map(async repo => {
    //                     const imgSrcResp = await fetch(`https://api.github.com/repos/sh-islam/${repo.name}/contents/demo.png`);
    //                     if (imgSrcResp.status === 404) return "https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-5529.jpg?w=2000";
    //                     else {
    //                         const imgSrcData = await imgSrcResp.json();
    //                         return imgSrcData.download_url;
    //                     }
    //                 })
    //             );
    //             setImgUrls(imgSrcs);
    //         } 
            
    //         catch (error) {
    //             console.log(`ERROR: ${error.message}`);
    //         }
    //     }
    
    //     fetchJson();
    // }, []);
    
    
    // console.log('repos', repos);
    // console.log('lastUpdated', lastUpdated);
    // console.log('readme', readme);
    // console.log('img links', imgUrls);

    const renderedProjects = () => {
        return repos.map((repo, index) => {
            // console.log('repo', repo);
            // repo.name contains the name, I want to replace '# repo_name' with an empty string
            let formattedReadme = readme[index];
            if (readme[index] != null && !readme[index].includes('Error')) {
                formattedReadme = readme[index]
                    .replace(/\n/g, '<br>\n') // Replace '\n' with '<br>' while keeping the line breaks
                    .replace(/^#.*$/gm, '') // Replace lines starting with '#' with an empty string
                    .replace(/^.*$/, '') // Replace the first line with an empty string
                    .replace(/\n\s+- /g, '&nbsp;&nbsp;- ') // Replace newline + spaces + hyphen with non-breaking spaces
                    .replace(/^.*$/, '') // Replace the first line with an empty string;
            }           
            return (
                <div className='project' key={repo.id}>
                    <div className='top'>
                        <div className='project-image-container'>
                            <img className='project-image' src={imgUrls[index]} alt={`${repo.name} demo`} />
                        </div>
                        <h1>{repo.name.charAt(0).toUpperCase() + repo.name.slice(1)}</h1>
                    </div>
                    <div className='bot'>
                        <p className='project-description' dangerouslySetInnerHTML={{ __html: formattedReadme }} />
                        <a href={projectUrls[index]}>
                            <p className='lastUpdated'>Last updated: {lastUpdated[index]}</p>
                        </a>
                    </div>
                </div>
            );
        });
    }

    
    // const renderedProjects = () => {
    //     // console.log('api response', apiResponse);
    //     if (!apiResponse.ok) {

    //         if (apiResponse.status === 403){
    //             return (
    //                 <div className='project'>
    //                         <div className='top'>
    //                             <img src = ''></img>
    //                             <h1>Error status code: {apiResponse.status}</h1>
    //                         </div>
    //                         <div className='bot'>
    //                             <p>Github API rate limit exceeded. Please try again in an hour.</p>
    //                         </div>
    //                 </div>
    //             );
    //         }

    //         if (apiResponse.status === 404){
    //             return (
    //                 <div className='project'>
    //                         <div className='top'>
    //                             <img src = ''></img>
    //                             <h1>Fatal error status code: {apiResponse.status}</h1>
    //                         </div>
    //                         <div className='bot'>
    //                             <p>API fetch url not found. A kind soul would contact the owner to let thme know.</p>
    //                         </div>
    //                 </div>
    //             );
    //         }


    //     } else {
    //         return repos.map((repo, index) => {
    //             // console.log('repo', repo);
    //             // repo.name contains the name, I want to replace '# repo_name' with an empty string
    //             let formattedReadme = readme[index];
    //             if (readme[index] != null) {
    //                 formattedReadme = readme[index]
    //                     .replace(/\n/g, '<br>\n') // Replace '\n' with '<br>' while keeping the line breaks
    //                     .replace(/^#.*$/gm, '') // Replace lines starting with '#' with an empty string
    //                     .replace(/^.*$/, '') // Replace the first line with an empty string
    //                     .replace(/\n\s+- /g, '&nbsp;&nbsp;- ') // Replace newline + spaces + hyphen with non-breaking spaces
    //                     .replace(/^.*$/, '') // Replace the first line with an empty string;
    //             }           

    //             return (
    //                 <div className='project' key={repo.id}>
    //                     <div className='top'>
    //                         <div className='project-image-container'>
    //                             <img className='project-image' src={imgUrls[index]} alt={`${repo.name} demo`} />
    //                         </div>
    //                         <h1>{repo.name.charAt(0).toUpperCase() + repo.name.slice(1)}</h1>
    //                     </div>
    //                     <div className='bot'>
    //                         <p className='project-description' dangerouslySetInnerHTML={{ __html: formattedReadme }} />
    //                         <a href={projectUrls[index]}>
    //                             <p className='lastUpdated'>Last updated: {lastUpdated[index]}</p>
    //                         </a>
    //                     </div>
    //                 </div>
    //             );
    //         });
    //     }
    // };

    
    return (
        // create an outer div Swiper
        <div className='project-container'>
            {renderedProjects()}
        </div>
    );
}

export default Project;


