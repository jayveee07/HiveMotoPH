import { useState } from 'react'
import { FiPackage, FiShoppingCart, FiUsers, FiDollarSign, FiTool, FiTag, FiTruck, FiBarChart2, FiPlus, FiEdit2, FiTrash2, FiDatabase } from 'react-icons/fi'
import { formatCurrency } from '../../lib/helpers'

const tabs = [
  { id: 'overview', label: 'Overview', icon: FiBarChart2 },
  { id: 'products', label: 'Products', icon: FiPackage },
  { id: 'orders', label: 'Orders', icon: FiShoppingCart },
  { id: 'services', label: 'Services', icon: FiTool },
  { id: 'customers', label: 'Customers', icon: FiUsers },
  { id: 'coupons', label: 'Coupons', icon: FiTag },
  { id: 'inventory', label: 'Inventory', icon: FiTruck },
]

const stats = [
  { label: 'Total Revenue', value: '₱284,500', change: '+12.5%', icon: FiDollarSign, color: 'bg-green-100 text-green-600' },
  { label: 'Total Orders', value: '156', change: '+8.2%', icon: FiShoppingCart, color: 'bg-blue-100 text-blue-600' },
  { label: 'Active Products', value: '234', change: '+3.1%', icon: FiPackage, color: 'bg-hive-yellow/20 text-hive-yellow' },
  { label: 'Total Customers', value: '892', change: '+15.3%', icon: FiUsers, color: 'bg-purple-100 text-purple-600' },
]

const recentOrders = [
  { id: 'HMP-A1B2C3', customer: 'Juan Dela Cruz', date: '2026-06-11', status: 'pending', total: 1500 },
  { id: 'HMP-D4E5F6', customer: 'Maria Santos', date: '2026-06-10', status: 'processing', total: 2800 },
  { id: 'HMP-G7H8I9', customer: 'Pedro Gonzales', date: '2026-06-09', status: 'shipped', total: 450 },
  { id: 'HMP-J1K2L3', customer: 'Ana Reyes', date: '2026-06-08', status: 'delivered', total: 3200 },
]

const products = [
  { id: 'p1', name: 'NGK Spark Plug CR7HSA', category: 'Engine', price: 180, stock: 50, sales: 230 },
  { id: 'p2', name: 'Mobil 1 Racing 4T', category: 'Lubricants', price: 550, stock: 100, sales: 180 },
  { id: 'p3', name: 'Brembo Brake Pads', category: 'Brakes', price: 1200, stock: 30, sales: 95 },
  { id: 'p4', name: 'Michelin Pilot Street', category: 'Tires', price: 4500, stock: 25, sales: 45 },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-hive-black dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your HiveMoto PH store</p>
        </div>
        <div className="flex gap-2">
          <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-sm">
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-56 flex-shrink-0">
          <div className="card p-2 sticky top-24">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-hive-yellow text-hive-black' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <tab.icon /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                  <div key={i} className="card p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                        <stat.icon />
                      </div>
                      <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                    </div>
                    <p className="text-2xl font-bold text-hive-black dark:text-white">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-lg font-bold text-hive-black dark:text-white">Recent Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-sm text-hive-yellow hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 font-medium text-gray-500">Order</th>
                        <th className="text-left py-3 font-medium text-gray-500">Customer</th>
                        <th className="text-left py-3 font-medium text-gray-500">Date</th>
                        <th className="text-left py-3 font-medium text-gray-500">Status</th>
                        <th className="text-right py-3 font-medium text-gray-500">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-3 font-medium text-hive-black dark:text-white">{order.id}</td>
                          <td className="py-3 text-gray-600 dark:text-gray-400">{order.customer}</td>
                          <td className="py-3 text-gray-600 dark:text-gray-400">{order.date}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : order.status === 'processing' ? 'bg-blue-100 text-blue-800' : order.status === 'shipped' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 text-right font-medium">{formatCurrency(order.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-2xl font-bold text-hive-black dark:text-white">Products</h2>
                <button className="btn-primary text-sm flex items-center gap-2"><FiPlus /> Add Product</button>
              </div>
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Product</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Category</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Price</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Stock</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Sales</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id} className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-3 px-4 font-medium text-hive-black dark:text-white">{p.name}</td>
                          <td className="py-3 px-4 text-gray-600">{p.category}</td>
                          <td className="py-3 px-4 text-right">{formatCurrency(p.price)}</td>
                          <td className="py-3 px-4 text-right">
                            <span className={p.stock < 30 ? 'text-red-500 font-medium' : ''}>{p.stock}</span>
                          </td>
                          <td className="py-3 px-4 text-right">{p.sales}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"><FiEdit2 className="text-gray-500" /></button>
                              <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><FiTrash2 className="text-red-500" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="card p-6">
              <h2 className="font-heading text-2xl font-bold text-hive-black dark:text-white mb-4">Order Management</h2>
              <div className="flex gap-2 mb-4">
                {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
                  <button key={s} className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${s === 'All' ? 'bg-hive-yellow border-hive-yellow text-hive-black' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                    {s}
                  </button>
                ))}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 font-medium text-gray-500">Order ID</th>
                      <th className="text-left py-3 font-medium text-gray-500">Customer</th>
                      <th className="text-left py-3 font-medium text-gray-500">Date</th>
                      <th className="text-left py-3 font-medium text-gray-500">Status</th>
                      <th className="text-right py-3 font-medium text-gray-500">Total</th>
                      <th className="text-right py-3 font-medium text-gray-500">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 font-medium">{order.id}</td>
                        <td className="py-3 text-gray-600">{order.customer}</td>
                        <td className="py-3 text-gray-600">{order.date}</td>
                        <td className="py-3">
                          <select className="text-xs border border-gray-300 rounded px-2 py-1">
                            <option>pending</option>
                            <option>processing</option>
                            <option>shipped</option>
                            <option>delivered</option>
                            <option>cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 text-right font-medium">{formatCurrency(order.total)}</td>
                        <td className="py-3 text-right">
                          <button className="text-sm text-hive-yellow hover:underline">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(activeTab === 'services' || activeTab === 'customers' || activeTab === 'coupons' || activeTab === 'inventory') && (
            <div className="card p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPackage className="text-2xl text-gray-400" />
              </div>
              <h3 className="font-heading text-xl font-bold text-hive-black dark:text-white mb-2 capitalize">{activeTab} Management</h3>
              <p className="text-gray-500">This section is ready for Firebase integration.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
