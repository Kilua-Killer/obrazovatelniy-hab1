import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, Users, Clock, Award, BookOpen, Calculator, Phone } from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: <CheckCircle className="h-8 w-8 text-primary-600" />,
      title: "Гарантия качества",
      description: "Каждый проект проходит проверку на соответствие требованиям"
    },
    {
      icon: <Users className="h-8 w-8 text-primary-600" />,
      title: "Опытные специалисты",
      description: "Команда профессионалов с педагогическим опытом"
    },
    {
      icon: <Clock className="h-8 w-8 text-primary-600" />,
      title: "Соблюдение сроков",
      description: "Сдача проектов точно в оговоренное время"
    },
    {
      icon: <Award className="h-8 w-8 text-primary-600" />,
      title: "Высокие оценки",
      description: "Наши проекты регулярно получают высокие оценки"
    }
  ]

  const projectTypes = [
    {
      title: "Научные проекты",
      description: "Исследования в области физики, химии, биологии и других наук",
      examples: ["Эксперименты", "Научные статьи", "Исследовательские работы"]
    },
    {
      title: "Творческие проекты",
      description: "Художественные и дизайнерские работы",
      examples: ["Искусство", "Дизайн", "Мультимедиа"]
    },
    {
      title: "IT проекты",
      description: "Программирование, веб-разработка, мобильные приложения",
      examples: ["Сайты", "Приложения", "Базы данных"]
    },
    {
      title: "Социальные проекты",
      description: "Общественно значимые инициативы и волонтерство",
      examples: ["Экология", "Социальная помощь", "Образование"]
    }
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Проекты для старших классов под ключ
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Профессиональная помощь в создании учебных проектов. 
              Гарантируем высокие оценки и своевременную сдачу.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/projects" className="btn-primary inline-flex items-center justify-center">
                Смотреть проекты
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/calculator" className="btn-secondary inline-flex items-center justify-center">
                <Calculator className="mr-2 h-5 w-5" />
                Рассчитать стоимость
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              Почему выбирают нас
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Мы предоставляем комплексные решения для учебных проектов старшеклассников
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Types Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              Виды проектов
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Работаем с проектами любой направленности и сложности
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projectTypes.map((type, index) => (
              <div key={index} className="card">
                <h3 className="text-2xl font-semibold mb-3">{type.title}</h3>
                <p className="text-gray-600 mb-4">{type.description}</p>
                <div className="flex flex-wrap gap-2">
                  {type.examples.map((example, i) => (
                    <span key={i} className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Готовы начать работу над проектом?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Свяжитесь с нами прямо сейчас и получите бесплатную консультацию
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/order" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 inline-flex items-center justify-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Заказать проект
            </Link>
            <Link to="/contacts" className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 inline-flex items-center justify-center">
              <Phone className="mr-2 h-5 w-5" />
              Связаться с нами
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
