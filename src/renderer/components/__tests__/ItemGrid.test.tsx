import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ItemGrid from '../ItemGrid'

describe('ItemGrid Component', () => {
  const mockItem = {
    id: 'test-1',
    name: 'Test Item',
    developer: 'Test Developer',
    description: 'Test description',
    website: 'https://example.com',
    rating: 4.5
  }

  const mockLoadItems = vi.fn(() => Promise.resolve([mockItem]))
  const mockRenderDetails = vi.fn((item) => <div>Details for {item.name}</div>)

  it('renders loading state initially', () => {
    render(
      <ItemGrid
        title="Test Items"
        itemType="daw"
        loadItems={mockLoadItems}
        renderItemDetails={mockRenderDetails}
      />
    )

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('renders items after loading', async () => {
    render(
      <ItemGrid
        title="Test Items"
        itemType="daw"
        loadItems={mockLoadItems}
        renderItemDetails={mockRenderDetails}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Test Items')).toBeInTheDocument()
      expect(screen.getByText('Test Item')).toBeInTheDocument()
      expect(screen.getByText('Test Developer')).toBeInTheDocument()
    })
  })

  it('handles error state', async () => {
    const mockErrorLoad = vi.fn(() => Promise.reject(new Error('Load failed')))
    
    render(
      <ItemGrid
        title="Test Items"
        itemType="daw"
        loadItems={mockErrorLoad}
        renderItemDetails={mockRenderDetails}
      />
    )

    await waitFor(() => {
      expect(screen.getByText(/Error: Load failed/)).toBeInTheDocument()
      expect(screen.getByText('Try Again')).toBeInTheDocument()
    })
  })

  it('filters items when filter is applied', async () => {
    const items = [
      { ...mockItem, id: '1', name: 'Item 1', category: 'Type A' },
      { ...mockItem, id: '2', name: 'Item 2', category: 'Type B' }
    ]
    
    const mockLoadMultiple = vi.fn(() => Promise.resolve(items))
    
    render(
      <ItemGrid
        title="Test Items"
        itemType="daw"
        loadItems={mockLoadMultiple}
        filterKey="category"
        renderItemDetails={mockRenderDetails}
        getFilterOptions={(items) => Array.from(new Set(items.map(i => i.category)))}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
    })

    // Click Type A filter
    const typeAButton = screen.getByText('Type A')
    fireEvent.click(typeAButton)

    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument()
  })

  it('handles bookmark action', async () => {
    render(
      <ItemGrid
        title="Test Items"
        itemType="daw"
        loadItems={mockLoadItems}
        renderItemDetails={mockRenderDetails}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Test Item')).toBeInTheDocument()
    })

    const bookmarkButton = screen.getByText('Bookmark')
    fireEvent.click(bookmarkButton)

    await waitFor(() => {
      expect(window.electronAPI.database.addBookmark).toHaveBeenCalledWith({
        type: 'daw',
        id: 'test-1',
        title: 'Test Item'
      })
    })
  })
})