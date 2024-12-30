import type { AnyExtension, Editor } from '@tiptap/core'
import Collaboration from '@tiptap/extension-collaboration'
import { useEditor } from '@tiptap/react'
// import CollaborationHistory from '@tiptap/extension-collaboration-history'
import type { Doc as YDoc } from 'yjs'

import { ExtensionKit } from '@/extensions/extension-kit'
// import { initialContent } from '@/lib/data/initialContent'
import * as Y from 'yjs'

declare global {
  interface Window {
    editor: Editor | null
  }
}

export const useBlockEditor = ({
  ydoc,
  permanentUserData,
}: {
  ydoc?: YDoc
  permanentUserData?: Y.PermanentUserData
}) => {
  const editor = useEditor(
    {
      immediatelyRender: true,
      shouldRerenderOnTransaction: false,
      autofocus: true,
      // onCreate: ctx => {
      //   if (provider && !provider.isSynced) {
      //     provider.on('synced', () => {
      //       setTimeout(() => {
      //         if (ctx.editor.isEmpty) {
      //           ctx.editor.commands.setContent(initialContent)
      //         }
      //       }, 0)
      //     })
      //   } else if (ctx.editor.isEmpty) {
      //     ctx.editor.commands.setContent(initialContent)
      //     ctx.editor.commands.focus('start', { scrollIntoView: true })
      //   }
      // },
      extensions: [
        ...ExtensionKit({
          // provider,
        }),
        Collaboration.configure({
          document: ydoc,
          field: 'prosemirror',
          ySyncOptions: {
            permanentUserData,
            // colors: [
            //   { light: '#ecd44433', dark: '#ecd444' },
            //   { light: '#ee635233', dark: '#ee6352' },
            //   { light: '#6eeb8333', dark: '#6eeb83' },
            // ],
          },
        }),
        // provider
        //   ? CollaborationCursor.configure({
        //       provider,
        //       user: {
        //         name: randomElement(userNames),
        //         color: randomElement(userColors),
        //       },
        //     })
        //   : undefined,
        // aiToken
        //   ? AiWriter.configure({
        //       authorId: userId,
        //       authorName: userName,
        //     })
        //   : undefined,
        // aiToken
        //   ? AiImage.configure({
        //       authorId: userId,
        //       authorName: userName,
        //     })
        //   : undefined,
        // aiToken ? Ai.configure({ token: aiToken }) : undefined,
      ].filter((e): e is AnyExtension => e !== undefined),
      editorProps: {
        attributes: {
          autocomplete: 'off',
          autocorrect: 'off',
          autocapitalize: 'off',
          class: 'min-h-full',
        },
      },
    },
    [ydoc],
  )
  // const users = useEditorState({
  //   editor,
  //   selector: (ctx): (EditorUser & { initials: string })[] => {
  //     if (!ctx.editor?.storage.collaborationCursor?.users) {
  //       return []
  //     }

  //     return ctx.editor.storage.collaborationCursor.users.map((user: EditorUser) => {
  //       const names = user.name?.split(' ')
  //       const firstName = names?.[0]
  //       const lastName = names?.[names.length - 1]
  //       const initials = `${firstName?.[0] || '?'}${lastName?.[0] || '?'}`

  //       return { ...user, initials: initials.length ? initials : '?' }
  //     })
  //   },
  // })

  // useEffect(() => {
  //   provider?.on('status', (event: { status: WebSocketStatus }) => {
  //     setCollabState(event.status)
  //   })
  // }, [provider])

  window.editor = editor

  return { editor }
}
