import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, GraduationCap } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <GraduationCap className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold">ПроектМастер</span>
            </div>
            <p className="text-gray-400">
              Профессиональная разработка проектов для старших классов. 
              Помогаем ученикам достигать академических успехов.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Главная</Link></li>
              <li><Link to="/projects" className="text-gray-400 hover:text-white transition-colors">Проекты</Link></li>
              <li><Link to="/calculator" className="text-gray-400 hover:text-white transition-colors">Калькулятор</Link></li>
              <li><Link to="/order" className="text-gray-400 hover:text-white transition-colors">Заказать проект</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Услуги</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Научные проекты</li>
              <li>Творческие работы</li>
              <li>Исследовательские проекты</li>
              <li>Консультации</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary-400" />
                <span className="text-gray-400">+7 (999) 123-45-67</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary-400" />
                <span className="text-gray-400">info@проектмастер.рф</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary-400" />
                <span className="text-gray-400">Москва, Россия</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 ПроектМастер. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
