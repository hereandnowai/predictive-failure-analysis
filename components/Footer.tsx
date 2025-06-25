
import React from 'react';
import { BlogIcon } from './icons/BlogIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { GitHubIcon } from './icons/GitHubIcon';
import { XIcon } from './icons/XIcon';
import { YouTubeIcon } from './icons/YouTubeIcon';


const socialLinks = [
  { name: 'Blog', href: 'https://hereandnowai.com/blog', icon: BlogIcon },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/hereandnowai/', icon: LinkedInIcon },
  { name: 'Instagram', href: 'https://instagram.com/hereandnow_ai', icon: InstagramIcon },
  { name: 'GitHub', href: 'https://github.com/hereandnowai', icon: GitHubIcon },
  { name: 'X', href: 'https://x.com/hereandnow_ai', icon: XIcon },
  { name: 'YouTube', href: 'https://youtube.com/@hereandnow_ai', icon: YouTubeIcon },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--hnai-secondary)] border-t border-[var(--hnai-border-color)] mt-12 py-8 text-center">
      <div className="container mx-auto px-4">
        <p className="text-lg font-semibold text-[var(--hnai-text-accent)] mb-2">
          designed with passion for innovation
        </p>
        <p className="text-sm text-[var(--hnai-text-muted)]">
          Upload your latest machine data and spot failures before they happen.
          Extend equipment life. Prevent downtime. Cut maintenance costs.
        </p>

        <div className="flex justify-center space-x-6 my-6">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="text-[var(--hnai-text-muted)] hover:text-[var(--hnai-text-accent)] transition-colors duration-200"
            >
              <social.icon className="w-6 h-6" />
            </a>
          ))}
        </div>
        
        <p className="text-xs text-[var(--hnai-text-muted)] mt-6">
          Developed by Sakthi Kannan [ AI Products Engineering Team ]
        </p>
        <p className="text-xs text-[var(--hnai-text-muted)] mt-1">
          © {new Date().getFullYear()} HERE AND NOW AI. All Rights Reserved.
        </p>
         <p className="text-xs text-[var(--hnai-text-muted)] mt-1">
          Contact: <a href="mailto:info@hereandnowai.com" className="hover:text-[var(--hnai-text-accent)]">info@hereandnowai.com</a> | Mobile: <a href="tel:+919962961000"  className="hover:text-[var(--hnai-text-accent)]">+91 996 296 1000</a>
        </p>
      </div>
    </footer>
  );
};