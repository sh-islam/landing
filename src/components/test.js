import React from 'react';
import { useEffect, useState } from 'react';

function Project(){
    const [repos, setRepos] = useState([]);
    const [lastUpdated, setLastUpdated] = useState([]);
    const [readme, setReadme] = useState([]);
    const [imgUrls, setImgUrls] = useState([])
    const [projectUrls, setProjectUrls] = useState([]);
    const [errorMsg, setErrorMsg] = useState(null);
    
    // Fetch selected repos from txt file 
    useEffect(() =>{
        async function fetchRepos(){
            try {
                const response = await fetch('https://raw.githubusercontent.com/sh-islam/Tools/main/portfolio-website/selectedRepos.txt');
                if (!response.ok) {
                    if(response.status === 403) throw new Error('Fetching selected repos failed. Rate limit exceeded. Please try back in an hour.');
                    if(response.status === 404) throw new Error('Fetching selected repos. Status code 404.');
                    else throw new Error('Fetching selected repos failed. Status code: ', response.status);
                }
                const data = await response.text();
                const repoArray = data.split(',').map(repo => repo.trim());
                setRepos(repoArray);
            } 
            catch (error) {
                console.log(error.message);
                setRepos(["Error"]);
            }
        }
        fetchRepos();
    }, [])

    // Fetch repo info: last updated date and project urls
    useEffect(() => {
        async function fetchRepoInfo(selectedRepos){
            try {
                const response = await fetch('https://api.github.com/users/sh-islam/repos');
               
                
                if (!response.ok) {
                    if(response.status === 403) throw new Error('Fetching repo info failed. Rate limit exceeded. Please try back in an hour.');
                    if(response.status === 404) throw new Error('Fetching repo info failed. Status code 404.');
                    else throw new Error('Fetching repo info failed. Status code: ', response.status);
                }
                const data = await response.json();
                const filteredRepos = data.filter(repo => selectedRepos.includes(repo.name));
                
                // Store last updated dates of selected repos 
                const updatedDates = filteredRepos.map(repo => repo.updated_at);
                
                setLastUpdated(updatedDates);
    
                // Store project urls
                const htmlUrls = filteredRepos.map(repo => repo.html_url);
                setProjectUrls(htmlUrls);
                
            }
            catch(error){
                setErrorMsg(error.message);
                repos.forEach(repo => {
                    // Create a new array with the same length as the repos array,
                    // but with empty strings for each element
                    const updatedDates = new Array(repos.length).fill('');
                    setLastUpdated(updatedDates);
            
                    const projectUrlsArray = new Array(repos.length).fill('');
                    setProjectUrls(projectUrlsArray);
                })
            }
        }

        // *FIXME* Add a check if promise of all repos have been returned, then fetch repo
        fetchRepoInfo(repos); // Pass repos array as argument
        
    }, [repos]);

    useEffect(() => {
        async function getReadMeData(repo) {
            try {
                const response = await fetch(`https://api.github.com/repos/sh-islam/${repo}/contents/README.md`);
    
                if (!response.ok) {
                    if(response.status === 403) throw new Error('Fetching readme failed. Rate limit exceeded. Please try back in an hour.');
                    if(response.status === 404) throw new Error('Fetching readme failed. Status code 404.');
                    else throw new Error('Fetching readme failed. Status code: ', response.status);
                }
                const data = await response.json();
                const readmeContent = atob(data.content);
                return readmeContent;
    
            } catch (error) {
                // setErrorMsg(error.message);
                return error.message;
            }
            
        }
    
        Promise.all(repos.map(repo => getReadMeData(repo)))
            .then(readmeContents => {
                setReadme(readmeContents);
        });

    }, [repos]);

    useEffect(() => {
        async function getImgLinks(repo) {
            try {
                const response = await fetch(`https://api.github.com/repos/sh-islam/${repo}/contents/demo.png`);
                if (!response.ok) {
                    // console.log('cant fetch img links', response);
    
                    const newImageUrl = 'https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-5529.jpg?w=2000';
    
                    return newImageUrl;
    
                }
                const data = await response.json();
                const imgsrc = data.download_url;
    
                return imgsrc;
    
            } catch (error) {
                setErrorMsg(error.message);
                return null;
            }
        }
    
        // Use Promise.all to collect all the image URLs and then update the state once
        Promise.all(repos.map(repo => getImgLinks(repo)))
            .then(imgUrls => {
                setImgUrls(imgUrls.filter(url => url !== null));
            });
    
    }, [repos]);
    
    

    //console.log('repo', repos);
    // console.log('error:', errorMsg);
    // console.log('last updated', projectUrls);
    // console.log('read me', readme)
    // console.log('img links', imgUrls);
    
    const renderedProjects = () => {
        return repos.map((repo, index) => {
           
            let formattedReadme = readme[index];
            // Only format if there's no error, display error as is. 
            if (readme[index] != null && errorMsg === null) {
                formattedReadme = readme[index]
                    .replace(/\n/g, '<br>\n')
                    .replace(/^#.*$/gm, '')
                    .replace(/^.*$/, '')
                    .replace(/\n\s+- /g, '&nbsp;&nbsp;- ');
            }
            // console.log('readme', readme)
            // console.log('formatted readme', formattedReadme)
           
            return (
                <div className='project' key={index}>
                    <div className='top'>
                        <div className='project-image-container'>
                            <img className='project-image' src={imgUrls[index]} alt={`${repo} demo`} />
                        </div>
                        <h1>{repo.charAt(0).toUpperCase() + repo.slice(1)}</h1>
                    </div>
                    <div className='bot'>
                        <p className='project-description' dangerouslySetInnerHTML={{ __html: formattedReadme }} />
                        <a href={projectUrls[index]}>
                            {/* <p className='lastUpdated'>Last updated: {lastUpdated[index]}</p> */}
                            {lastUpdated[index] !== '' && (
                                <p className='lastUpdated'>Last updated: {lastUpdated[index]}</p>
                            )}
                        </a>
                    </div>
                </div>
            );

        });
    };
    
    return(
        <div className='project-container'>
            {renderedProjects()}
        </div>
    )
}
export default Project;