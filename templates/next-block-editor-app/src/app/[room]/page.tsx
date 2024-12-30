'use client'

import 'iframe-resizer/js/iframeResizer.contentWindow'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { BlockEditor } from '@/components/BlockEditor'
import { Icon } from '@/components/ui/Icon'
import { Surface } from '@/components/ui/Surface'
import { Toolbar } from '@/components/ui/Toolbar'
import { createPortal } from 'react-dom'
import * as Y from 'yjs'

const useDarkmode = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false,
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => setIsDarkMode(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  const toggleDarkMode = useCallback(() => setIsDarkMode(isDark => !isDark), [])
  const lightMode = useCallback(() => setIsDarkMode(false), [])
  const darkMode = useCallback(() => setIsDarkMode(true), [])

  return {
    isDarkMode,
    toggleDarkMode,
    lightMode,
    darkMode,
  }
}

export default function Document({ params }: { params: { room: string } }) {
  const { isDarkMode, darkMode, lightMode } = useDarkmode()

  const { ydoc, permanentUserData } = useMemo(() => {
    const ydoc = new Y.Doc()
    ydoc.gc = false
    const permanentUserData = new Y.PermanentUserData(ydoc)
    permanentUserData.setUserMapping(ydoc, ydoc.clientID, 'godlin')
    return { ydoc, permanentUserData }
  }, [])

  const DarkModeSwitcher = createPortal(
    <Surface className="flex items-center gap-1 fixed bottom-6 right-6 z-[99999] p-1">
      <Toolbar.Button onClick={lightMode} active={!isDarkMode}>
        <Icon name="Sun" />
      </Toolbar.Button>
      <Toolbar.Button onClick={darkMode} active={isDarkMode}>
        <Icon name="Moon" />
      </Toolbar.Button>
    </Surface>,
    document.body,
  )

  return (
    <>
      {DarkModeSwitcher}
      <BlockEditor ydoc={ydoc} permanentUserData={permanentUserData} />
    </>
  )
}
