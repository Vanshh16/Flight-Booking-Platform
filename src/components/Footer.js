export default function Footer() {
    return (
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 Flight Booker, All rights reserved.</p>
          <div className="mt-4 space-x-6">
            <a href="https://twitter.com" className="hover:text-blue-500">
              Twitter
            </a>
            <a href="https://facebook.com" className="hover:text-blue-500">
              Facebook
            </a>
            <a href="https://linkedin.com" className="hover:text-blue-500">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    );
  }
  