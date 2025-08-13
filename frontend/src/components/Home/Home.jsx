import { FaFacebookF, FaTwitter, FaInstagram, FaThreads, FaGithub } from 'react-icons/fa6';
import Posts from '../Posts/Posts';
export default function Home() {
  return (
    <div className="flex min-h-screen">
      {/* Left-side Footer / Sidebar */}
      <aside className="w-60 bg-purple-600 text-white flex flex-col items-center py-6 space-y-6">
        <div className=" whitespace-nowrap font-bold">© 2025 DevNet</div>
        <div className="flex flex-col space-y-4 text-sm">
          <a href="/" className="hover:underline ">Home</a>
          <a href="#" className="hover:underline ">About</a>
          <a href="#" className="hover:underline">Contact</a>
          <a href="#" className="hover:underline">Terms of Policy</a>
        </div>

      {/* Social Icons */}
        <div className="flex space-x-4 pt-10 text-xl">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300">
            <FaFacebookF />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300">
            <FaTwitter />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300">
            <FaInstagram />
          </a>
          <a href="https://www.threads.net" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300">
            <FaThreads />
          </a>
          <a href="https://www.github.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300">
            <FaGithub />
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-r from-blue-400 to-purple-200 p-10">
        <div className="max-w-4xl mx-auto bg-white p-10 rounded-xl shadow-xl text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to DevNet</h1>
          <p className="text-lg text-gray-700 mb-6">
            A social platform built for developers to connect, share, and grow together.
          </p>
        <Posts/>
        </div>
      </main>
    </div>
  )
}
