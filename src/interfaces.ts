export interface SqlNote {
  id: number
  guid: string
  mid: number
  mod: number
  usn: number
  tags: string
  flds: string
  sfld: string
  csum: number
  flags: number
  data: string
}

export interface Note {
  content: string
}
