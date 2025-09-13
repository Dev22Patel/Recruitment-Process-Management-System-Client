import { Link } from 'react-router-dom';
import { APP_NAME } from '../../utils/constants';

const Navbar = () => {
  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-2xl font-bold text-black hover:text-green-900 transition-colors"
          >
            {APP_NAME}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
