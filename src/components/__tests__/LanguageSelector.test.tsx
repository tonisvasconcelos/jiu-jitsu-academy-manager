import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import LanguageSelector from '../LanguageSelector'
import { LanguageProvider } from '../../contexts/LanguageContext'

// Mock the useLanguage hook to test different scenarios
const mockUseLanguage = jest.fn()

// Mock the LanguageContext
jest.mock('../../contexts/LanguageContext', () => ({
  ...jest.requireActual('../../contexts/LanguageContext'),
  useLanguage: () => mockUseLanguage(),
}))

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <LanguageProvider>
      {component}
    </LanguageProvider>
  )
}

describe('LanguageSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state when context is not ready', () => {
    mockUseLanguage.mockReturnValue({
      language: undefined,
      setLanguage: undefined,
      t: undefined
    })

    renderWithProvider(<LanguageSelector />)
    
    expect(screen.getByText('Loading language selector...')).toBeInTheDocument()
  })

  it('renders loading state when language is invalid', () => {
    mockUseLanguage.mockReturnValue({
      language: 'INVALID',
      setLanguage: jest.fn(),
      t: jest.fn()
    })

    renderWithProvider(<LanguageSelector />)
    
    expect(screen.getByText('Initializing language...')).toBeInTheDocument()
  })

  it('renders language selector with valid context', () => {
    const mockSetLanguage = jest.fn()
    const mockT = jest.fn((key: string) => key)

    mockUseLanguage.mockReturnValue({
      language: 'ENU',
      setLanguage: mockSetLanguage,
      t: mockT
    })

    renderWithProvider(<LanguageSelector />)
    
    expect(screen.getByText('language-selector')).toBeInTheDocument()
    expect(screen.getByText('select-language')).toBeInTheDocument()
    expect(screen.getByText('language')).toBeInTheDocument()
  })

  it('handles language change correctly', async () => {
    const mockSetLanguage = jest.fn()
    const mockT = jest.fn((key: string) => key)

    mockUseLanguage.mockReturnValue({
      language: 'ENU',
      setLanguage: mockSetLanguage,
      t: mockT
    })

    renderWithProvider(<LanguageSelector />)
    
    const portugueseOption = screen.getByText('portuguese').closest('div')
    expect(portugueseOption).toBeInTheDocument()
    
    fireEvent.click(portugueseOption!)
    
    await waitFor(() => {
      expect(mockSetLanguage).toHaveBeenCalledWith('PTB')
    })
  })

  it('handles language change errors gracefully', async () => {
    const mockSetLanguage = jest.fn().mockImplementation(() => {
      throw new Error('Language change failed')
    })
    const mockT = jest.fn((key: string) => key)
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    mockUseLanguage.mockReturnValue({
      language: 'ENU',
      setLanguage: mockSetLanguage,
      t: mockT
    })

    renderWithProvider(<LanguageSelector />)
    
    const portugueseOption = screen.getByText('portuguese').closest('div')
    fireEvent.click(portugueseOption!)
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error changing language:', expect.any(Error))
    })

    consoleSpy.mockRestore()
  })

  it('shows correct language selection state', () => {
    const mockSetLanguage = jest.fn()
    const mockT = jest.fn((key: string) => key)

    mockUseLanguage.mockReturnValue({
      language: 'PTB',
      setLanguage: mockSetLanguage,
      t: mockT
    })

    renderWithProvider(<LanguageSelector />)
    
    // Check that Portuguese is selected (should have checkmark)
    const portugueseCard = screen.getByText('portuguese').closest('div')
    expect(portugueseCard).toHaveClass('border-blue-500', 'bg-blue-500/20')
    
    // Check that English is not selected
    const englishCard = screen.getByText('english').closest('div')
    expect(englishCard).toHaveClass('border-white/10', 'bg-white/5')
  })

  it('displays correct current language info', () => {
    const mockSetLanguage = jest.fn()
    const mockT = jest.fn((key: string) => key)

    mockUseLanguage.mockReturnValue({
      language: 'ENU',
      setLanguage: mockSetLanguage,
      t: mockT
    })

    renderWithProvider(<LanguageSelector />)
    
    expect(screen.getByText('English language')).toBeInTheDocument()
    expect(screen.getByText('The interface is currently displayed in English')).toBeInTheDocument()
  })
})
