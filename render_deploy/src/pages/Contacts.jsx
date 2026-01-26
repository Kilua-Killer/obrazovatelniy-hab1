import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send, MessageSquare } from 'lucide-react'

const Contacts = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Имитация отправки формы
    setTimeout(() => {
      setSubmitMessage('Сообщение отправлено! Мы ответим вам в ближайшее время.')
      setFormData({ name: '', email: '', message: '' })
      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Контакты
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Свяжитесь с нами любым удобным способом
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div>
            <div className="card mb-8">
              <h2 className="text-2xl font-semibold mb-6">Контактная информация</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-primary-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Телефон</h3>
                    <p className="text-gray-600">+7 (999) 123-45-67</p>
                    <p className="text-sm text-gray-500">Звоните с 9:00 до 20:00</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-primary-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email</h3>
                    <p className="text-gray-600">info@проектмастер.рф</p>
                    <p className="text-sm text-gray-500">Отвечаем в течение 2 часов</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-primary-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Адрес</h3>
                    <p className="text-gray-600">г. Москва, ул. Примерная, д. 123</p>
                    <p className="text-sm text-gray-500">Офис 45 (работаем онлайн)</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-primary-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Рабочее время</h3>
                    <div className="text-gray-600">
                      <p>Понедельник - Пятница: 9:00 - 20:00</p>
                      <p>Суббота - Воскресенье: 10:00 - 18:00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="card">
              <h2 className="text-2xl font-semibold mb-6">Частые вопросы</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Как быстро вы начинаете работу?</h3>
                  <p className="text-gray-600">После обсуждения деталей и предоплаты начинаем работу в течение 24 часов.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Какие гарантии вы предоставляете?</h3>
                  <p className="text-gray-600">Гарантируем соответствие требованиям, своевременную сдачу и поддержку до защиты.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Возможна ли оплата по частям?</h3>
                  <p className="text-gray-600">Да, мы предлагаем гибкие условия оплаты: 50% предоплата и 50% после сдачи.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="card">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <MessageSquare className="h-6 w-6 mr-2 text-primary-600" />
                Написать нам
              </h2>

              {submitMessage ? (
                <div className="text-center py-8">
                  <div className="bg-green-100 text-green-800 p-6 rounded-lg mb-6">
                    <h3 className="text-xl font-semibold mb-2">Сообщение отправлено!</h3>
                    <p>{submitMessage}</p>
                  </div>
                  <button
                    onClick={() => setSubmitMessage('')}
                    className="btn-primary"
                  >
                    Отправить еще сообщение
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ваше имя *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Иван Иванов"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="ivan@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Сообщение *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Расскажите о вашем проекте или задайте вопрос..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      'Отправка...'
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Отправить сообщение
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Social Links */}
            <div className="mt-8 text-center">
              <h3 className="font-semibold mb-4">Следите за нами</h3>
              <div className="flex justify-center space-x-4">
                <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  Telegram
                </button>
                <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  WhatsApp
                </button>
                <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  VK
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contacts
