import { FiStar } from 'react-icons/fi'
import { getInitials } from '../../lib/helpers'

export default function TestimonialCard({ testimonial }) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            className={i < testimonial.rating ? 'fill-hive-yellow text-hive-yellow' : 'text-gray-300'}
          />
        ))}
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
        "{testimonial.text}"
      </p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-hive-yellow rounded-full flex items-center justify-center text-sm font-bold text-hive-black">
          {getInitials(testimonial.name)}
        </div>
        <div>
          <p className="font-semibold text-hive-black dark:text-white text-sm">{testimonial.name}</p>
          <p className="text-xs text-gray-500">{testimonial.role}</p>
        </div>
      </div>
    </div>
  )
}
