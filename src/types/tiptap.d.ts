import '@tiptap/core'

declare module '@tiptap/core' {
  interface Editor {
    id?: string
  }
}
