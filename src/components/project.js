import React, { useState, useEffect } from 'react';
import { getRepoNames, getRepoData, getReadMeData, getImgLinks } from './githubApi';

function Project() {
    const [repoNames, setRepoNames] = useState([]);
    const [reposData, setReposData] = useState([]);
    const [readmeData, setReadmeData] = useState([]);
    const [imgUrls, setImgUrls] = useState([]);

    // Fetch repo names for subsequent api calls
    useEffect(() => {
        async function fetchRepoNames() {
            try {
                const repoNameData = await getRepoNames();
                setRepoNames(repoNameData);
            } catch (error) {
                console.log(error.message)
            }
        }
        fetchRepoNames();
    }, []);

    // Fetch repo data from github based on repo names
    useEffect(() => {
        async function fetchRepoData() {
            try {
                const reposGitData = await getRepoData(repoNames);
                setReposData(reposGitData);

                const readmeDatas = await getReadMeData(repoNames);
                setReadmeData(readmeDatas);

                const imgLinks = await getImgLinks(repoNames);
                setImgUrls(imgLinks);
                
            } catch (error) {
                setRepoNames(['Error'])
                const repoInfo = {
                    name: 'Error',
                    updatedDate: '',
                    htmlUrl: '',
                };
                setReposData([repoInfo]);
                setReadmeData([error.message]);
                setImgUrls([
                    'https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-5529.jpg?w=2000',
                ]);
            }
        }

        if (repoNames.length > 0 && repoNames[0] !== "Error") {
            fetchRepoData();
        }
    }, [repoNames]);

    

    const renderedProjectsMap = repoNames.map((repo, index) => (
        <div className='project' key={index}>
            <div className='top'>
                <h1>{repo.charAt(0).toUpperCase() + repo.slice(1)}</h1>
                <div className='project-image-container'>
                    <div className='streak'></div>
                    <img className='project-image' src={imgUrls[index]} alt={`${repo} demo`} />
                </div>
            </div>
            <div className='bot'>
            <p className='project-description' dangerouslySetInnerHTML={{ __html: readmeData[index] }}></p>
            {reposData[index]?.htmlUrl && (
            <a href={reposData[index]?.htmlUrl}>
                <p className='lastUpdated'>Last updated: {reposData[index]?.updatedDate}</p>
            </a>
            )}
            </div>
        </div>
    ));

    return (
        <div className='projects'>
            <div className='project-container'>
            {renderedProjectsMap}
            </div>
        </div>
        );
}

export default Project;