import { Mark } from '@tiptap/core'
import { hoverWrapper } from './utils'

export const YChange = Mark.create({
  name: 'ychange',
  inclusive: false,
  addAttributes() {
    return {
      user: { default: null },
      type: { default: null },
      color: { default: null },
    }
  },
  parseHTML() {
    return [{ tag: 'ychange' }]
  },
  renderHTML({ mark: node }) {
    return [
      'ychange',
      {
        ychange_user: node.attrs.user,
        ychange_type: node.attrs.type,
        ychange_color: node.attrs.color.light,
      },
      ...hoverWrapper(node.attrs, [0]),
    ]
  },
})
