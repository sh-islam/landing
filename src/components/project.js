import React from 'react';
import { useEffect, useState } from 'react';
const GHtoken = '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';
// API to all my repos:
// https://api.github.com/users/sh-islam/repos
// Contents of each repo:
// https://api.github.com/repos/sh-islam/(repo_name)/contents
// README.md data from github is located at:
// https://raw.githubusercontent.com/sh-islam/(repo_name)/main/README.md


const selectedRepos = ['dino-run', 'Rock-paper-scissors'];

function Project() {
    const [repos, setRepos] = useState([]);
    const [lastUpdated, setLastUpdated] = useState([]);
    const [readme, setReadme] = useState([]);
    const [imgUrls, setImgUrls] = useState([])
    // add live links?, github links add tags, response?
    const [apiResponse, setApiResponse] = useState('');


    // need to check for response.status = 403, if so create a state apiRateLimitExceeded
    // if 404 then api not found
    // or we could just save the response status, and console.log the error
    // How do we save the response status in case we need it for other functions/variables?
    useEffect(() => {
        const fetchJson = async () => {
            try {
                const response = await fetch('https://api.github.com/users/sh-islam/repos');
                // console.log('response', response);
                setApiResponse(response);
    
                if (!response.ok) {
                    throw new Error(`Request failed with status: ${response.status}`);
                }
    
                const data = await response.json();
                
                // Keeping only json of selected repos
                const filteredRepos = data.filter(repo => selectedRepos.includes(repo.name));
                setRepos(filteredRepos);
    
                // Store last updated dates of said repos
                const updatedDates = filteredRepos.map(repo => repo.updated_at);
                setLastUpdated(updatedDates);
    
                // Fetch and store README for each repo
                const readmeContents = await Promise.all(
                    filteredRepos.map(async repo => {
                        const readmeResponse = await fetch(`https://api.github.com/repos/sh-islam/${repo.name}/contents/README.md`);
                        const readmeData = await readmeResponse.json();
                        const readmeContent = atob(readmeData.content); // Decode base64 content
                        return readmeContent;
                    })
                );
                setReadme(readmeContents);
    
                // Fetch and store demo.png img link for each repo
                const imgSrcs = await Promise.all(
                    filteredRepos.map(async repo => {
                        const imgSrcResp = await fetch(`https://api.github.com/repos/sh-islam/${repo.name}/contents/demo.png`);
                        if (imgSrcResp.status === 404) return "https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-5529.jpg?w=2000";
                        else {
                            const imgSrcData = await imgSrcResp.json();
                            return imgSrcData.download_url;
                        }
                    })
                );
                setImgUrls(imgSrcs);
            } 
            
            catch (error) {
                console.log(`ERROR: ${error.message}`);
            }
        }
    
        fetchJson();
    }, []);
    

    // console.log('repos', repos);
    // console.log('lastUpdated', lastUpdated);
    // console.log('readme', readme);
    // console.log('img links', imgUrls);

    const renderedProjects = () => {
        // console.log('api response', apiResponse);
        if (!apiResponse.ok) {

            if (apiResponse.status === 403){
                return (
                    <div className='project'>
                            <div className='top'>
                                <img src = ''></img>
                                <h1>Error status code: {apiResponse.status}</h1>
                            </div>
                            <div className='bot'>
                                <p>Github API rate limit exceeded. Please try again in an hour.</p>
                            </div>
                    </div>
                );
            }

            if (apiResponse.status === 404){
                return (
                    <div className='project'>
                            <div className='top'>
                                <img src = ''></img>
                                <h1>Fatal error status code: {apiResponse.status}</h1>
                            </div>
                            <div className='bot'>
                                <p>API fetch url not found. A kind soul would contact the owner to let thme know.</p>
                            </div>
                    </div>
                );
            }


        } else {
            return repos.map((repo, index) => {
                console.log('repo', repo);
                // repo.name contains the name, I want to replace '# repo_name' with an empty string
                let formattedReadme = readme[index];
                if (readme[index] != null) {
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
                            <img src={imgUrls[index]} alt={`${repo.name} demo`} />
                            <h1>{repo.name.charAt(0).toUpperCase() + repo.name.slice(1)}</h1>
                        </div>
                        <div className='bot'>
                            <p dangerouslySetInnerHTML={{ __html: formattedReadme }} />
                            <p>Last updated: {lastUpdated[index]}</p>
                        </div>
                    </div>
                );
            });
        }
    };


    return (
        // create an outer div Swiper
        <div className='project-container'>
            {renderedProjects()}
        </div>
    );
}

export default Project;


