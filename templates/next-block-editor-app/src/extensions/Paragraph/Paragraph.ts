import TiptapParagraph from '@tiptap/extension-paragraph'
import { hoverWrapper } from '../YChange/utils'
import { calcYchangeDomAttrs } from '../YChange/utils'

export const Paragraph = TiptapParagraph.extend({
  addAttributes() {
    return { ychange: { default: null } }
  },

  renderHTML({ node }) {
    const renderChanges = node.content.size === 0
    const { ychange, ...attrs } = renderChanges ? calcYchangeDomAttrs(node.attrs) : node.attrs
    const defChildren = [0]
    const children = renderChanges ? hoverWrapper(node.attrs.ychange, defChildren) : defChildren
    return ['p', attrs, ...children]
  },
})
