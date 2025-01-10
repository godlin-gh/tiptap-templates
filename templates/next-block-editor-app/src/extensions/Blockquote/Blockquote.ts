import TiptapBlockquote from '@tiptap/extension-blockquote'
import { mergeAttributes } from '@tiptap/core'
import { calcYchangeDomAttrs, hoverWrapper } from '../YChange/utils'

export const Blockquote = TiptapBlockquote.extend({
  renderHTML({ node, HTMLAttributes }) {
    return [
      'blockquote',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, calcYchangeDomAttrs(node.attrs)),
      ...hoverWrapper(node.attrs.ychange, [0]),
    ]
  },
})
