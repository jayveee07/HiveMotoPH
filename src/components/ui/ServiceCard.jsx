import { FiClock, FiTool } from 'react-icons/fi'
import { formatCurrency } from '../../lib/helpers'

export default function ServiceCard({ service, onBook }) {
  return (
    <div className="card p-6 hover:border-hive-yellow hover:border-2 transition-all duration-200 border-2 border-transparent">
      <div className="w-14 h-14 bg-hive-yellow/10 rounded-xl flex items-center justify-center mb-4">
        <FiTool className="text-2xl text-hive-yellow" />
      </div>
      <h3 className="font-heading text-xl font-semibold text-hive-black dark:text-white mb-2">
        {service.name}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {service.description || `Professional ${service.name.toLowerCase()} service by certified mechanics.`}
      </p>
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-bold text-hive-orange">{formatCurrency(service.price)}</span>
        <span className="flex items-center gap-1 text-sm text-gray-500">
          <FiClock /> {service.duration}
        </span>
      </div>
      <button onClick={onBook} className="w-full btn-primary text-center">
        Book Now
      </button>
    </div>
  )
}
