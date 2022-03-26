export type DrawingType = 'rect' | 'arc' | 'common'
export type DrawingFnType = (ctx: CanvasRenderingContext2D | null, x: number, y: number) => void
