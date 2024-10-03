import { siteConfig } from "../config/site";
import {Divider} from "@nextui-org/divider";

export default function SiteFooter() {
  return (
    
    <footer className="mt-2 py-6 md:px-8 md:py-0 text-white bottom">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose md:text-left">
          © {new Date().getFullYear()} All rights reserved. The source code is
          available on{" "}
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
        <nav className="flex space-x-4">
          <a href="/about" className="hover:underline">
            About
          </a>
          <a href="/contact" className="hover:underline">
            Contact
          </a>
          <a href="/privacy" className="hover:underline">
            Privacy Policy
          </a>
        </nav>
      </div>
    </footer>
  );
}
