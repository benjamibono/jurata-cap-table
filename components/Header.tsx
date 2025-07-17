import Link from 'next/link';
import { JurataLogo } from './JurataLogo';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <nav className="flex items-center" role="navigation" aria-label="Main navigation">
            <Link 
              href="/companies" 
              className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md p-1"
              aria-label="Jurata Cap Table Management - Home"
            >
              <JurataLogo width={120} height={24} />
              <div className="border-l border-gray-300 pl-3">
                <p className="text-sm font-medium text-secondary">Cap Table Management</p>
              </div>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}; 