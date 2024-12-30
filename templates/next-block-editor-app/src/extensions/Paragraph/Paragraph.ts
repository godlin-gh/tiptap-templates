import TiptapParagraph from '@tiptap/extension-paragraph'
import { calcYchangeDomAttrs } from '../YChange/utils'

export const Paragraph = TiptapParagraph.extend({
  addAttributes() {
    return { ychange: { default: null } }
  },

  renderHTML({ node }) {
    // only render changes if no child nodes
    const renderChanges = node.content.size === 0
    const { ychange, ...attrs } = renderChanges ? calcYchangeDomAttrs(node.attrs) : node.attrs
    const defChildren = [0]
    // const children = renderChanges ? hoverWrapper(node.attrs.ychange, defChildren) : defChildren
    const children = defChildren
    return ['p', attrs, ...children]
  },
})
