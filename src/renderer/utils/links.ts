export const openExternalLink = (url: string) => {
  if (window.electronAPI) {
    window.electronAPI.invoke('open-external', url)
  } else {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}