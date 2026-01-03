'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSearchStore } from '@/store/searchStore'

interface SearchBarProps {
  placeholder?: string
  className?: string
}

export function SearchBar({ placeholder, className }: SearchBarProps) {
  const router = useRouter()
  const { query, setQuery, searchType } = useSearchStore()
  const [localQuery, setLocalQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const searchQuery = localQuery.trim()
    if (searchQuery.length < 2) return

    setQuery(searchQuery)
    router.push(`/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}`)
  }

  return (
    <form onSubmit={handleSearch} className={className}>
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder={placeholder || 'Search medicine or pharmacy...'}
            className="pl-10 pr-4 py-6 text-lg text-gray-900 border-2 border-gray-200 focus:border-blue-500"
          />
        </div>
        <Button type="submit" size="lg" className="px-8">
          Search
        </Button>
      </div>
    </form>
  )
}
