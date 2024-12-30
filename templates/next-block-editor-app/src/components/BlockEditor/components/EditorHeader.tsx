import { Icon } from '@/components/ui/Icon'
import { EditorInfo } from './EditorInfo'
import { EditorUser } from '../types'
import { WebSocketStatus } from '@hocuspocus/provider'
import { Toolbar } from '@/components/ui/Toolbar'
import { Editor } from '@tiptap/core'
import { useEditorState } from '@tiptap/react'
import { Button } from '@/components/ui/Button'
import { TextSelection } from '@tiptap/pm/state'
import { DOMParser } from '@tiptap/pm/model'
import { Slice } from '@tiptap/pm/model'
import { delay } from '@/common/utils'
import content from '@/lib/data/content.md'

function parseMarkdown(editor: Editor, markdown: string) {
  const html = editor.storage.markdown.parser.parse(markdown) as string
  const tempElement = document.createElement('div')
  tempElement.innerHTML = html
  const domParser = DOMParser.fromSchema(editor.schema)
  return domParser.parse(tempElement)
}

// 水平分割线、表格、图片的光标位置有问题，先忽略
async function insertMarkdown(editor: Editor, md: string) {
  let selection = editor.state.selection
  let prev = selection.from - 1
  let next = selection.to + 1
  for (let i = 1; i <= md.length; i++) {
    const part = md.slice(0, i)
    const doc = parseMarkdown(editor, part)
    const { tr } = editor.state
    const { openStart, openEnd } = selection.content()
    const slice = new Slice(doc.content, openStart, openEnd)
    tr.replaceRange(selection.from, selection.to, slice).scrollIntoView()
    editor.view.dispatch(tr)
    prev = tr.mapping.map(prev)
    next = tr.mapping.map(next)
    selection = TextSelection.create(editor.state.doc, prev + 1, next - 1)
    await delay(1)
  }
}

export type EditorHeaderProps = {
  isSidebarOpen?: boolean
  toggleSidebar?: () => void
  editor: Editor
  collabState: WebSocketStatus
  users: EditorUser[]
}

export const EditorHeader = ({ editor, collabState, users, isSidebarOpen, toggleSidebar }: EditorHeaderProps) => {
  const { characters, words } = useEditorState({
    editor,
    selector: (ctx): { characters: number; words: number } => {
      const { characters, words } = ctx.editor?.storage.characterCount || { characters: () => 0, words: () => 0 }
      return { characters: characters(), words: words() }
    },
  })

  return (
    <div className="flex flex-row items-center justify-between flex-none py-2 pl-6 pr-3 text-black bg-white border-b border-neutral-200 dark:bg-black dark:text-white dark:border-neutral-800">
      <div className="flex flex-row gap-x-1.5 items-center">
        <div className="flex items-center gap-x-1.5">
          <Toolbar.Button
            tooltip={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            onClick={toggleSidebar}
            active={isSidebarOpen}
            className={isSidebarOpen ? 'bg-transparent' : ''}
          >
            <Icon name={isSidebarOpen ? 'PanelLeftClose' : 'PanelLeft'} />
          </Toolbar.Button>
          <Button variant="outline" onClick={() => insertMarkdown(editor, content)}>
            Insert markdown
          </Button>
        </div>
      </div>
      <EditorInfo characters={characters} words={words} collabState={collabState} users={users} />
    </div>
  )
}
