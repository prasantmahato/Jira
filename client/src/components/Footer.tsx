import React from 'react';

const Footer = () => {
  return (
    <div className="flex flex-col justify-end bg-white">
        <div className="w-full border-t border-blue-500"></div>
      <footer className="w-full text-gray-700 bg-gray-100 body-font">
        <div className="container flex flex-col flex-wrap px-5 py-12 mx-auto md:items-center lg:items-start md:flex-row">
          {/* Branding Section */}
          <div className="flex-shrink-0 w-64 mx-auto text-center md:mx-0 md:text-left">
            <a href="/" className="flex items-center justify-center font-bold text-gray-900 title-font md:justify-start transition-transform duration-300 hover:scale-105">
              <svg className="w-auto h-6 text-indigo-600 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="nonzero" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14a6 6 0 00-6 6c0 2.21 1.79 4 4 4h1v2h2v-2h1c2.21 0 4-1.79 4-4a6 6 0 00-6-6zm0 8h-2c-1.1 0-2-.9-2-2s.9-2 2-2h2c1.1 0 2 .9 2 2s-.9 2-2 2z" />
              </svg>
            </a>
            <p className="mt-3 text-sm text-gray-500 font-light">Streamline Your Agile Workflow!</p>
            <div className="mt-6">
              <span className="inline-flex justify-center mt-2 sm:ml-auto sm:mt-0 sm:justify-start space-x-4">
                {[
                  { path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z", platform: "Facebook" },
                  { path: "M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05A4.28 4.28 0 0016.07 4c-2.36 0-4.28 1.92-4.28 4.29 0 .34.04.67.11 1-.35-.02-.7-.06-1.06-.12-2.76-.5-5.07-2.76-5.65-5.5-.24.94-.36 2.03-.36 3.13 0 2.97 1.51 5.59 3.8 7.12-.47.13-.97.23-1.49.28.42 1.31 1.64 2.39 3.09 2.42-1.13.89-2.55 1.42-4.09 1.42-.27 0-.53-.02-.79-.06 1.46.94 3.2 1.49 5.07 1.49 6.08 0 9.4-5.04 9.4-9.41 0-.14 0-.29-.01-.43.65-.47 1.21-1.05 1.65-1.72z", platform: "Twitter" },
                  { path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95.49-7.49-2.27-7.98-6.22C2.54 9.76 5.29 6.22 9.24 5.73c3.95-.49 7.49 2.27 7.98 6.22.49 3.95-2.27 7.49-6.22 7.98zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z", platform: "GitHub", stroke: true },
                  { path: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z", platform: "LinkedIn", circle: true },
                ].map((icon, index) => (
                  <a
                    key={index}
                    className="text-gray-500 cursor-pointer hover:text-indigo-600 transition-colors duration-300 transform hover:scale-110"
                    aria-label={icon.platform}
                  >
                    <svg
                      fill={icon.stroke ? "none" : "currentColor"}
                      stroke={icon.stroke ? "currentColor" : undefined}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={icon.stroke ? "2" : "0"}
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                    >
                      <path stroke={icon.stroke ? undefined : "none"} d={icon.path} />
                      {icon.circle && <circle cx="4" cy="4" r="2" stroke="none" />}
                    </svg>
                  </a>
                ))}
              </span>
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="flex flex-wrap flex-grow mt-10 -mb-10 text-center md:pl-20 md:mt-0 md:text-left">
            {[
              {
                title: "About",
                links: [
                  { text: "Company", href: "#" },
                  { text: "Documentation", href: "https://docs.example.com" },
                  { text: "Blog", href: "#" },
                ],
              },
              {
                title: "Support",
                links: [
                  { text: "Help Center", href: "https://support.example.com" },
                  { text: "Community Forum", href: "https://community.example.com" },
                  { text: "Status Page", href: "https://status.example.com" },
                ],
              },
              {
                title: "Platform",
                links: [
                  { text: "Terms & Privacy", href: "#" },
                  { text: "API Docs", href: "https://developer.example.com" },
                  { text: "Marketplace", href: "https://marketplace.example.com" },
                ],
              },
              {
                title: "Contact",
                links: [
                  { text: "Subscribe to Updates", href: "#" },
                  { text: "Contact Sales", href: "#" },
                  { text: "+123-456-7890", href: "tel:+1234567890" },
                ],
              },
            ].map((section, index) => (
              <div key={index} className="w-full px-4 lg:w-1/4 md:w-1/2 mb-10">
                <h2 className="mb-4 text-base font-semibold tracking-wider text-gray-900 uppercase">{section.title}</h2>
                <ul className="list-none">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex} className="mt-3">
                      <a
                        href={link.href}
                        className="text-gray-500 hover:text-indigo-600 transition-colors duration-300 text-sm font-light"
                      >
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="bg-white border-t border-gray-200">
          <div className="container px-5 py-6 mx-auto flex items-center justify-between flex-col sm:flex-row">
            <p className="text-sm text-gray-500 font-light">© 2025 All rights reserved | Powered by Atlasian</p>
            <a
              href="https://support.example.com/feedback"
              className="text-xs text-gray-600 hover:text-indigo-600 transition-colors duration-300"
            >
              Report a Bug
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;