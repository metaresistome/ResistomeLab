export function isSnapshotMode(): boolean {
  return (
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('snapshot')
  )
}
