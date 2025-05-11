'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestDB() {
  const [dbStatus, setDbStatus] = useState<string>('Testing connection...')
  const [userCount, setUserCount] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      setDbStatus('Testing connection...')
      setError(null)
      
      const response = await fetch('/api/test-db')
      const data = await response.json()
      
      if (response.ok) {
        setDbStatus('Connected successfully!')
        setUserCount(data.userCount || 0)
      } else {
        setDbStatus('Connection failed')
        setError(data.error || 'Unknown error')
      }
    } catch (err) {
      setDbStatus('Connection failed')
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>数据库连接测试</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded border">
              <p><strong>状态:</strong> {dbStatus}</p>
              {userCount !== null && (
                <p className="mt-2"><strong>用户数:</strong> {userCount}</p>
              )}
              {error && (
                <p className="text-red-500 mt-2"><strong>错误:</strong> {error}</p>
              )}
            </div>
            <Button onClick={testConnection}>
              重新测试连接
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 