import React from 'react';
import './footer.css';
import githubIcon from './images/github_footer.png';

function Footer() {
  return (
    <div className="footer-container">
      <a href="https://github.com/sh-islam">
        <img src={githubIcon} alt="GitHub icon" />
      </a>
    </div>
  );
}

export default Footer;
