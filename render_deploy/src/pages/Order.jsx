import { useState } from 'react'
import { Send, Phone, Mail, User, FileText, Calendar, MessageSquare } from 'lucide-react'

const Order = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    subject: '',
    description: '',
    deadline: '',
    budget: '',
    additionalInfo: ''
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
      setSubmitMessage('Спасибо за заявку! Мы свяжемся с вами в течение 24 часов.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        projectType: '',
        subject: '',
        description: '',
        deadline: '',
        budget: '',
        additionalInfo: ''
      })
      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Заказать проект
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Заполните форму и мы свяжемся с вами для обсуждения деталей
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <div className="card mb-6">
                <h3 className="text-xl font-semibold mb-4">Контактная информация</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-primary-600 mr-3" />
                    <div>
                      <div className="font-medium">Телефон</div>
                      <div className="text-gray-600">+7 (999) 123-45-67</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-primary-600 mr-3" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-gray-600">info@проектмастер.рф</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-xl font-semibold mb-4">Рабочее время</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Пн-Пт:</span>
                    <span>9:00 - 20:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Сб-Вс:</span>
                    <span>10:00 - 18:00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Form */}
            <div className="lg:col-span-2">
              <div className="card">
                {submitMessage ? (
                  <div className="text-center py-12">
                    <div className="bg-green-100 text-green-800 p-6 rounded-lg mb-6">
                      <h3 className="text-xl font-semibold mb-2">Заявка отправлена!</h3>
                      <p>{submitMessage}</p>
                    </div>
                    <button
                      onClick={() => setSubmitMessage('')}
                      className="btn-primary"
                    >
                      Отправить еще одну заявку
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <User className="inline h-4 w-4 mr-1" />
                          Ваше имя *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Иван Иванов"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Phone className="inline h-4 w-4 mr-1" />
                          Телефон *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="+7 (999) 123-45-67"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="inline h-4 w-4 mr-1" />
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="ivan@example.com"
                      />
                    </div>

                    {/* Project Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FileText className="inline h-4 w-4 mr-1" />
                          Тип проекта *
                        </label>
                        <select
                          name="projectType"
                          value={formData.projectType}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">Выберите тип</option>
                          <option value="science">Научный проект</option>
                          <option value="it">IT проект</option>
                          <option value="creative">Творческий проект</option>
                          <option value="social">Социальный проект</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Тема проекта *
                        </label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Тема вашего проекта"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MessageSquare className="inline h-4 w-4 mr-1" />
                        Подробное описание *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Опишите ваши требования, цели проекта..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Calendar className="inline h-4 w-4 mr-1" />
                          Желаемый срок
                        </label>
                        <input
                          type="date"
                          name="deadline"
                          value={formData.deadline}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Бюджет
                        </label>
                        <input
                          type="text"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="5 000 - 10 000 ₽"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Дополнительная информация
                      </label>
                      <textarea
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Любые дополнительные детали или требования"
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
                          Отправить заявку
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Order
