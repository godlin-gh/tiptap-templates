import { Markdown as TiptapMarkdown } from 'tiptap-markdown'

export const Markdown = TiptapMarkdown.configure({
  transformPastedText: true,
})

export default Markdown
