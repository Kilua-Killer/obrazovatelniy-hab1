import { useState } from 'react'
import { Search, Filter, Clock, Users, Star } from 'lucide-react'

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const projects = [
    {
      id: 1,
      title: "Исследование влияния социальных сетей на успеваемость",
      category: "social",
      price: "от 5 000 ₽",
      duration: "2-3 недели",
      complexity: "Средний",
      rating: 4.8,
      description: "Социологическое исследование с опросами и анализом данных"
    },
    {
      id: 2,
      title: "Разработка мобильного приложения для изучения языков",
      category: "it",
      price: "от 8 000 ₽",
      duration: "3-4 недели",
      complexity: "Высокий",
      rating: 4.9,
      description: "Создание прототипа приложения с базовым функционалом"
    },
    {
      id: 3,
      title: "Экологический мониторинг воздушного бассейна города",
      category: "science",
      price: "от 6 000 ₽",
      duration: "2-3 недели",
      complexity: "Средний",
      rating: 4.7,
      description: "Сбор и анализ данных о качестве воздуха"
    },
    {
      id: 4,
      title: "Создание цифрового арт-объекта на тему технологий",
      category: "creative",
      price: "от 4 000 ₽",
      duration: "1-2 недели",
      complexity: "Низкий",
      rating: 4.6,
      description: "Цифровое искусство с использованием современных технологий"
    },
    {
      id: 5,
      title: "Исследование эффективности методов запоминания",
      category: "science",
      price: "от 5 500 ₽",
      duration: "2-3 недели",
      complexity: "Средний",
      rating: 4.8,
      description: "Психологический эксперимент с тестированием методов"
    },
    {
      id: 6,
      title: "Разработка сайта для школьного музея",
      category: "it",
      price: "от 7 000 ₽",
      duration: "2-3 недели",
      complexity: "Средний",
      rating: 4.9,
      description: "Создание интерактивного сайта с виртуальной экскурсией"
    }
  ]

  const categories = [
    { id: 'all', name: 'Все проекты' },
    { id: 'science', name: 'Научные' },
    { id: 'it', name: 'IT' },
    { id: 'creative', name: 'Творческие' },
    { id: 'social', name: 'Социальные' }
  ]

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getComplexityColor = (complexity) => {
    switch(complexity) {
      case 'Низкий': return 'bg-green-100 text-green-800'
      case 'Средний': return 'bg-yellow-100 text-yellow-800'
      case 'Высокий': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Готовые проекты и идеи
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Выберите подходящий проект или закажите индивидуальную разработку
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Поиск проектов..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map(project => (
            <div key={project.id} className="card hover:scale-105 transition-transform duration-300">
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-primary-600">{project.price}</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm text-gray-600">{project.rating}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {project.duration}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getComplexityColor(project.complexity)}`}>
                  {project.complexity}
                </span>
              </div>

              <button className="w-full btn-primary">
                Подробнее
              </button>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Проекты не найдены. Попробуйте изменить параметры поиска.</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center bg-primary-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Не нашли подходящий проект?</h2>
          <p className="text-gray-600 mb-6">
            Мы можем разработать индивидуальный проект под ваши требования
          </p>
          <button className="btn-primary">
            Заказать индивидуальный проект
          </button>
        </div>
      </div>
    </div>
  )
}

export default Projects
