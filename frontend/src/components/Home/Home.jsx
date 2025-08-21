import { FaFacebookF, FaTwitter, FaInstagram, FaThreads, FaGithub } from 'react-icons/fa6';
import Posts from '../Posts/Posts';
export default function Home() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-gray-200">
      {/* Sidebar / Topbar */}
      <aside className="w-full md:w-64 bg-gradient-to-b from-purple-800/80 to-gray-900/90 text-white flex md:flex-col items-center justify-between md:justify-start py-4 md:py-8 px-6 md:px-0 space-y-0 md:space-y-8 shadow-xl backdrop-blur-lg">
        {/* Branding */}
        <div className="text-lg md:text-xl font-extrabold tracking-wide">© 2025 DevNet</div>

        {/* Links */}
        <div className="hidden md:flex flex-col space-y-4 text-sm font-medium">
          <a href="/" className="hover:text-purple-300 transition">
            Home
          </a>
          <a href="#" className="hover:text-purple-300 transition">
            About
          </a>
          <a href="#" className="hover:text-purple-300 transition">
            Contact
          </a>
          <a href="#" className="hover:text-purple-300 transition">
            Terms of Policy
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-4 md:pt-12 text-lg md:text-xl">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener"
            className="hover:text-blue-400 transition"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener"
            className="hover:text-blue-400 transition"
          >
            <FaTwitter />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener"
            className="hover:text-blue-400 transition"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.threads.net"
            target="_blank"
            rel="noopener"
            className="hover:text-blue-400 transition"
          >
            <FaThreads />
          </a>
          <a
            href="https://www.github.com"
            target="_blank"
            rel="noopener"
            className="hover:text-blue-400 transition"
          >
            <FaGithub />
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 bg-gradient-to-r from-gray-800/60 via-gray-900/70 to-black/90 backdrop-blur-xl">
        <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-4 md:mb-6">
          Welcome to DevNet
        </h1>
        <p className="text-base md:text-lg text-gray-300 mb-6 md:mb-10">
          A social platform built for developers to connect, share, and grow together.
        </p>
        <Posts />
      </main>
    </div>
  );
  
}
