export const openExternalLink = (url: string) => {
  if (window.electronAPI?.invoke) {
    window.electronAPI.invoke('open-external', url)
  } else if (window.electronAPI?.openExternal) {
    window.electronAPI.openExternal(url)
  } else {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}