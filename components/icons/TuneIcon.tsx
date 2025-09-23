import React from 'react';

const TuneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 21v-7" />
    <path d="M4 8V3" />
    <path d="M12 21v-9" />
    <path d="M12 6V3" />
    <path d="M20 21v-5" />
    <path d="M20 10V3" />
    <path d="M1 14h6" />
    <path d="M9 8h6" />
    <path d="M17 16h6" />
  </svg>
);

export default TuneIcon;