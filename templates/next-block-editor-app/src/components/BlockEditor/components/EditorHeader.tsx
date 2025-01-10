import { delay } from '@/common/utils'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Toolbar } from '@/components/ui/Toolbar'
import content from '@/lib/data/content.md'
import { Editor } from '@tiptap/core'
import { DOMParser, Slice } from '@tiptap/pm/model'
import { TextSelection } from '@tiptap/pm/state'
import { useEditorState } from '@tiptap/react'
import { useCallback, useState } from 'react'
import { ySyncPluginKey } from 'y-prosemirror'
import * as Y from 'yjs'

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

async function insertMarkdown2(editor: Editor, md: string) {
  const { selection, tr } = editor.state
  const doc = parseMarkdown(editor, md)
  const { openStart, openEnd } = selection.content()
  const slice = new Slice(doc.content, openStart, openEnd)
  tr.replaceSelection(slice).scrollIntoView()
  editor.view.dispatch(tr)
}

export type EditorHeaderProps = {
  isSidebarOpen?: boolean
  toggleSidebar?: () => void
  editor: Editor
  // collabState: WebSocketStatus
  // users: EditorUser[]
  ydoc?: Y.Doc
}

export const EditorHeader = ({ editor, isSidebarOpen, toggleSidebar, ydoc }: EditorHeaderProps) => {
  const [versions, setVersions] = useState<{ timestamp: number; snapshot: Y.Snapshot }[]>([])

  const { characters, words } = useEditorState({
    editor,
    selector: (ctx): { characters: number; words: number } => {
      const { characters, words } = ctx.editor?.storage.characterCount || { characters: () => 0, words: () => 0 }
      return { characters: characters(), words: words() }
    },
  })

  const handleVersionChange = useCallback(
    (value: string) => {
      if (!editor || !value) return

      if (value === 'reset') {
        const binding = ySyncPluginKey.getState(editor.view.state).binding
        if (binding != null) {
          binding.unrenderSnapshot()
        }
        return
      }

      const timestamp = parseInt(value)
      const version = versions.find(v => v.timestamp === timestamp)
      if (!version) return

      const index = versions.findIndex(v => v.timestamp === timestamp)
      const prevVersion = index > 0 ? versions[index - 1] : undefined

      editor.view.dispatch(
        editor.view.state.tr.setMeta(ySyncPluginKey, {
          snapshot: version.snapshot,
          prevSnapshot: prevVersion?.snapshot || Y.emptySnapshot,
        }),
      )
    },
    [editor, versions],
  )

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
          <Button variant="tertiary" onClick={() => insertMarkdown2(editor, content)}>
            Insert markdown
          </Button>
          {ydoc && (
            <>
              <Button
                variant="tertiary"
                onClick={() => {
                  const snapshot = Y.snapshot(ydoc)
                  setVersions([
                    ...versions,
                    {
                      timestamp: Date.now(),
                      snapshot,
                    },
                  ])
                }}
              >
                Save version
              </Button>
              <Select onValueChange={handleVersionChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="select a version..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="reset" value="reset">
                    Reset
                  </SelectItem>
                  {versions.map((version, index) => (
                    <SelectItem key={index} value={version.timestamp.toString()}>
                      {new Date(version.timestamp).toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
        </div>
      </div>
      {/* <EditorInfo characters={characters} words={words} collabState={collabState} users={users} /> */}
    </div>
  )
}
