import React from 'react';

const SkinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 2c-2.2 2.2-2.2 5.8 0 8s5.8 2.2 8 0" />
    <path d="M13.2 5.4a3 3 0 0 0 4.2 4.2" />
    <path d="M12 12h.01" />
    <path d="M2 20s3-3 8-3 8 3 8 3" />
    <path d="M4 14.2A7.9 7.9 0 0 1 3 11a8 8 0 0 1 8-8 8.1 8.1 0 0 1 2.8.5" />
  </svg>
);

export default SkinIcon;