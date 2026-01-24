import { useState } from 'react'
import { Calculator, Info } from 'lucide-react'

const Calculator = () => {
  const [projectType, setProjectType] = useState('science')
  const [complexity, setComplexity] = useState('medium')
  const [urgency, setUrgency] = useState('normal')
  const [pages, setPages] = useState(10)
  const [consultation, setConsultation] = useState(false)
  const [presentation, setPresentation] = useState(false)

  const basePrices = {
    science: { low: 3000, medium: 5000, high: 8000 },
    it: { low: 4000, medium: 7000, high: 12000 },
    creative: { low: 2500, medium: 4000, high: 6000 },
    social: { low: 2000, medium: 3500, high: 5500 }
  }

  const urgencyMultiplier = {
    normal: 1,
    urgent: 1.5,
    superUrgent: 2
  }

  const calculatePrice = () => {
    const basePrice = basePrices[projectType][complexity]
    const urgencyPrice = basePrice * urgencyMultiplier[urgency]
    const pagesPrice = Math.max(0, (pages - 10) * 100)
    const consultationPrice = consultation ? 1000 : 0
    const presentationPrice = presentation ? 1500 : 0
    
    return urgencyPrice + pagesPrice + consultationPrice + presentationPrice
  }

  const calculateDeadline = () => {
    const baseDays = {
      low: 7,
      medium: 14,
      high: 21
    }
    
    const urgencyDays = {
      normal: 1,
      urgent: 0.5,
      superUrgent: 0.3
    }
    
    return Math.ceil(baseDays[complexity] * urgencyDays[urgencyDays])
  }

  const price = calculatePrice()
  const deadline = calculateDeadline()

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Калькулятор стоимости
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Рассчитайте стоимость вашего проекта за несколько минут
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calculator Form */}
            <div className="card">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Calculator className="h-6 w-6 mr-2 text-primary-600" />
                Параметры проекта
              </h2>

              {/* Project Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тип проекта
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="science">Научный проект</option>
                  <option value="it">IT проект</option>
                  <option value="creative">Творческий проект</option>
                  <option value="social">Социальный проект</option>
                </select>
              </div>

              {/* Complexity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Сложность
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'low', label: 'Низкая' },
                    { value: 'medium', label: 'Средняя' },
                    { value: 'high', label: 'Высокая' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setComplexity(option.value)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        complexity === option.value
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Urgency */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Срочность
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'normal', label: 'Обычно (14+ дней)', multiplier: 1 },
                    { value: 'urgent', label: 'Срочно (7-14 дней)', multiplier: 1.5 },
                    { value: 'superUrgent', label: 'Очень срочно (до 7 дней)', multiplier: 2 }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setUrgency(option.value)}
                      className={`w-full px-4 py-3 rounded-lg border-2 text-left transition-colors ${
                        urgency === option.value
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-medium">{option.label}</div>
                      {option.multiplier > 1 && (
                        <div className="text-sm text-gray-500">
                          +{((option.multiplier - 1) * 100).toFixed(0)}% к стоимости
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pages */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Объем (страниц): {pages}
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={pages}
                  onChange={(e) => setPages(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>5</span>
                  <span>50</span>
                </div>
              </div>

              {/* Additional Services */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дополнительные услуги
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={consultation}
                      onChange={(e) => setConsultation(e.target.checked)}
                      className="mr-2"
                    />
                    <span>Консультация (+1 000 ₽)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={presentation}
                      onChange={(e) => setPresentation(e.target.checked)}
                      className="mr-2"
                    />
                    <span>Презентация (+1 500 ₽)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Result */}
            <div>
              <div className="card bg-gradient-to-br from-primary-50 to-primary-100 mb-6">
                <h3 className="text-2xl font-semibold mb-6">Результат расчета</h3>
                
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-primary-600 mb-2">
                    {price.toLocaleString('ru-RU')} ₽
                  </div>
                  <div className="text-gray-600">
                    Срок выполнения: {deadline} дней
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Базовая стоимость:</span>
                    <span>{basePrices[projectType][complexity].toLocaleString('ru-RU')} ₽</span>
                  </div>
                  {urgencyMultiplier[urgency] > 1 && (
                    <div className="flex justify-between text-red-600">
                      <span>Наценка за срочность:</span>
                      <span>+{((basePrices[projectType][complexity] * (urgencyMultiplier[urgency] - 1))).toLocaleString('ru-RU')} ₽</span>
                    </div>
                  )}
                  {pages > 10 && (
                    <div className="flex justify-between">
                      <span>Дополнительные страницы:</span>
                      <span>+{((pages - 10) * 100).toLocaleString('ru-RU')} ₽</span>
                    </div>
                  )}
                  {consultation && (
                    <div className="flex justify-between">
                      <span>Консультация:</span>
                      <span>+1 000 ₽</span>
                    </div>
                  )}
                  {presentation && (
                    <div className="flex justify-between">
                      <span>Презентация:</span>
                      <span>+1 500 ₽</span>
                    </div>
                  )}
                </div>

                <button className="w-full btn-primary">
                  Заказать проект
                </button>
              </div>

              <div className="card bg-blue-50">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Важно знать:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Цена может измениться после обсуждения деталей</li>
                      <li>• Возможна оплата по частям</li>
                      <li>• Гарантируем соответствие требованиям</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calculator
