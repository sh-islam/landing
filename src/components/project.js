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
    // add live links, add tags

    useEffect(() => {
        const fetchJson = async () => {
            // Fetch json info on all repo, filter and store selected repos
            const response = await fetch('https://api.github.com/users/sh-islam/repos');
            const data = await response.json();
            const filteredRepos = data.filter(repo => selectedRepos.includes(repo.name));
            setRepos(filteredRepos);

            // Store last udpated dates of said repos 
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
                    console.log('resp', imgSrcResp)
                    if (imgSrcResp.status == 404) return "https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-5529.jpg?w=2000";
                    else{
                        const imgSrcData = await imgSrcResp.json();
                        return imgSrcData.download_url;
                    }
                })
            );
            setImgUrls(imgSrcs);
        }

        fetchJson();
    }, []);

    // console.log('repos', repos);
    // console.log('lastUpdated', lastUpdated);
    // console.log('readme', readme);
    // console.log('img links', imgUrls);

const renderedProjects = repos.map((repo, index) => {
    // This doesnt load all the time, so replace doesnt work always and page breaks
    const formattedReadme = readme[index]
        .replace(/\n/g, '<br>') // Replace '\n' with '<br>' to render line breaks
        .replace(/^# /, ''); // Remove the leading '# '

    return (
        <div className='project' key={repo.id}>
            <div className='left'>
                <img src={imgUrls[index]} alt={`${repo.name} demo`} />
                <h1>{repo.name.charAt(0).toUpperCase() + repo.name.slice(1)}</h1>
            </div>
            <div className='right'>
                <p dangerouslySetInnerHTML={{ __html: formattedReadme }} />
                <p>Last updated: {lastUpdated[index]}</p>
            </div>
        </div>
    );
});


    return (
        <div className='project-container'>
            {renderedProjects}
        </div>
    );
}

export default Project;


