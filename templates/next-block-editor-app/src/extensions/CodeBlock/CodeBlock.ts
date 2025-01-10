import { mergeAttributes } from '@tiptap/core'
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import { all, createLowlight } from 'lowlight'
import { calcYchangeDomAttrs, hoverWrapper } from '../YChange/utils'

// import js from 'highlight.js/lib/languages/javascript'

const lowlight = createLowlight(all)

// lowlight.register('javascript', js)

export const CodeBlock = CodeBlockLowlight.configure({
  lowlight,
  defaultLanguage: 'javascript',
}).extend({
  // 只特殊允许 ychange 标记
  marks: 'ychange',
  renderHTML({ node, HTMLAttributes }) {
    return [
      'pre',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, calcYchangeDomAttrs(node.attrs)),
      ...hoverWrapper(node.attrs.ychange, [
        [
          'code',
          {
            class: node.attrs.language ? this.options.languageClassPrefix + node.attrs.language : null,
          },
          0,
        ],
      ]),
    ]
  },
})
