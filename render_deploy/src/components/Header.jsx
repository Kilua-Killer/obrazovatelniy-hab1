import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, GraduationCap } from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold gradient-text">ПроектМастер</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">Главная</Link>
            <Link to="/projects" className="text-gray-700 hover:text-primary-600 transition-colors">Проекты</Link>
            <Link to="/calculator" className="text-gray-700 hover:text-primary-600 transition-colors">Калькулятор</Link>
            <Link to="/order" className="text-gray-700 hover:text-primary-600 transition-colors">Заказать</Link>
            <Link to="/contacts" className="text-gray-700 hover:text-primary-600 transition-colors">Контакты</Link>
          </nav>

          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-700 hover:text-primary-600"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors" onClick={toggleMenu}>Главная</Link>
              <Link to="/projects" className="text-gray-700 hover:text-primary-600 transition-colors" onClick={toggleMenu}>Проекты</Link>
              <Link to="/calculator" className="text-gray-700 hover:text-primary-600 transition-colors" onClick={toggleMenu}>Калькулятор</Link>
              <Link to="/order" className="text-gray-700 hover:text-primary-600 transition-colors" onClick={toggleMenu}>Заказать</Link>
              <Link to="/contacts" className="text-gray-700 hover:text-primary-600 transition-colors" onClick={toggleMenu}>Контакты</Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
