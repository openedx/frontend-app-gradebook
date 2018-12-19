import React from 'react';
import { Hyperlink, Icon } from '@edx/paragon';

import EdXLogo from '../../../assets/edx-sm.png';

export default function Footer() {
  function renderLogo() {
    return (
      <img src={EdXLogo} alt="edX logo" height="30" width="60" />
    );
  }

  return (
    <footer
      role="contentinfo"
      aria-label="Page Footer"
      className="footer d-flex justify-content-center border-top py-3 px-4"
    >
      <div className="max-width-1180 d-grid">
        <div className="area-1">
          <Hyperlink destination="https://www.edx.org/" content={renderLogo()} aria-label="edX Home" />
        </div>
        <div className="area-2">
          <h2>edx</h2>
          <ul className="list-unstyled p-0 m-0">
            <li><a href="https://www.edx.org/about-us">About</a></li>
            <li><a href="https://www.edx.org/enterprise">edX for Business</a></li>
            <li><a href="https://www.edx.org/affiliate-program">Affiliates</a></li>
            <li><a href="http://open.edx.org">Open edX</a></li>
            <li><a href="https://www.edx.org/careers">Careers</a></li>
            <li><a href="https://www.edx.org/news-announcements">News</a></li>
          </ul>
        </div>
        <div className="area-3">
          <h2>Legal</h2>
          <ul className="list-unstyled p-0 m-0">
            <li><a href="https://www.edx.org/edx-terms-service">Terms of Service &amp; Honor Code</a></li>
            <li><a href="https://www.edx.org/edx-privacy-policy">Privacy Policy</a></li>
            <li><a href="https://www.edx.org/accessibility">Accessibility Policy</a></li>
            <li><a href="https://www.edx.org/trademarks">Trademark Policy</a></li>
            <li><a href="https://www.edx.org/sitemap">Sitemap</a></li>
          </ul>
        </div>
        <div className="area-4">
          <h2>Connect</h2>
          <ul className="list-unstyled p-0 m-0">
            <li><a href="https://www.edx.org/blog">Blog</a></li>
            <li><a href="https://courses.edx.org/support/contact_us">Contact Us</a></li>
            <li><a href="https://support.edx.org">Help Center</a></li>
            <li><a href="https://www.edx.org/media-kit">Media Kit</a></li>
            <li><a href="https://www.edx.org/donate">Donate</a></li>
          </ul>
        </div>
        <div className="area-5">
          <ul
            className="d-flex flex-row justify-content-between list-unstyled max-width-222 p-0 mb-4"
          >
            {/* TODO: Use Paragon HyperLink with Icon. */}
            {/*  Would need to add rel to paragon if we still need it. */}
            <li>
              <a href="http://www.facebook.com/EdxOnline" title="Facebook" rel="noopener noreferrer" target="_blank">
                <Icon className={['fa', 'fa-facebook-square', 'fa-2x']} screenReaderText="Like edX on Facebook" />
              </a>
            </li>
            <li>
              <a href="https://twitter.com/edXOnline" title="Twitter" rel="noopener noreferrer" target="_blank">
                <Icon className={['fa', 'fa-twitter-square', 'fa-2x']} screenReaderText="Follow edX on Twitter" />
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/user/edxonline" title="Youtube" rel="noopener noreferrer" target="_blank">
                <Icon className={['fa', 'fa-youtube-square', 'fa-2x']} screenReaderText="Subscribe to the edX YouTube channel" />
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/company/edx" title="LinkedIn" rel="noopener noreferrer" target="_blank">
                <Icon className={['fa', 'fa-linkedin-square', 'fa-2x']} screenReaderText="Follow edX on LinkedIn" />
              </a>
            </li>
            <li>
              <a href="https://plus.google.com/+edXOnline" title="Google+" rel="noopener noreferrer" target="_blank">
                <Icon className={['fa', 'fa-google-plus-square', 'fa-2x']} screenReaderText="Follow edX on Google+" />
              </a>
            </li>
            <li>
              <a href="https://www.reddit.com/r/edx" title="Reddit" rel="noopener noreferrer" target="_blank">
                <Icon className={['fa', 'fa-reddit-square', 'fa-2x']} screenReaderText="Subscribe to the edX subreddit" />
              </a>
            </li>
          </ul>
          <ul className="d-flex flex-row justify-content-between list-unstyled max-width-264 p-0 mb-5">
            <li>
              <a href="https://itunes.apple.com/us/app/edx/id945480667?mt=8" rel="noopener noreferrer" target="_blank">
                <img
                  className="max-height-39"
                  alt="Download the edX mobile app from the Apple App Store"
                  src="https://prod-edxapp.edx-cdn.org/static/images/app/app_store_badge_135x40.d0558d910630.svg"
                />
              </a>
            </li>
            <li>
              <a href="https://play.google.com/store/apps/details?id=org.edx.mobile" rel="noopener noreferrer" target="_blank">
                <img
                  className="max-height-39"
                  alt="Download the edX mobile app from Google Play"
                  src="https://prod-edxapp.edx-cdn.org/static/images/app/google_play_badge_45.6ea466e328da.png"
                />
              </a>
            </li>
          </ul>
          <p>
            © 2012–{(new Date().getFullYear())} edX Inc.
            <br />
            EdX, Open edX, and MicroMasters are registered trademarks of edX Inc.
            | 粤ICP备17044299号-2
          </p>
        </div>
      </div>
    </footer>
  );
}

