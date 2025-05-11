import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface TimePickerDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (time: string) => void
}

export function TimePickerDialog({ isOpen, onClose, onConfirm }: TimePickerDialogProps) {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  if (!isOpen) return null

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onConfirm(`${selectedDate}T${selectedTime}`)
      onClose()
    }
  }

  // 生成未来两周的日期选项
  const getDateOptions = () => {
    const dates = []
    const today = new Date()
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date.toISOString().split('T')[0])
    }
    return dates
  }

  // 生成时间选项（9:00-18:00，每小时一个选项）
  const getTimeOptions = () => {
    const times = []
    for (let hour = 9; hour <= 18; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`)
    }
    return times
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">选择面试时间</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">日期</label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              <option value="">请选择日期</option>
              {getDateOptions().map((date) => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString('zh-CN', {
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                  })}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">时间</label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              <option value="">请选择时间</option>
              {getTimeOptions().map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedDate || !selectedTime}
          >
            确认
          </Button>
        </div>
      </div>
    </div>
  )
} 