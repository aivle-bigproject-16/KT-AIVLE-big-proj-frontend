const BASE_WIDTH = 1920

export function useWidthScale() {
  const scale = window.innerWidth / BASE_WIDTH
  return { scale, baseWidth: BASE_WIDTH }
}
