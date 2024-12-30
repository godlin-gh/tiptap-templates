import { Button } from '@/components/ui/Button'
import { customAlphabet } from 'nanoid'
import Link from 'next/link'

interface Document {
  name: string
  created_at: string
}

const getNanoId = (): string => {
  const nanoid = customAlphabet('6789BCDFGHJKLMNPQRTWbcdfghjkmnpqrtwz', 10)
  return nanoid()
}

async function listDocuments(): Promise<Document[]> {
  const response = await fetch(
    `https://${process.env.NEXT_PUBLIC_TIPTAP_COLLAB_APP_ID}.collab.tiptap.cloud/api/documents`,
    {
      headers: {
        Authorization: process.env.TIPTAP_API_SECRET || '',
      },
    },
  )

  if (!response.ok) {
    const result = await response.text()
    throw new Error(`status: ${response.status}, result: ${result}`)
  }

  return response.json()
}

export default async function DocumentsPage() {
  const documents = await listDocuments()

  return (
    <main className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">文档列表</h1>
        {/* <Link href="/room/new" passHref>
          <Button>
            <span>新建文档</span>
          </Button>
        </Link> */}
      </div>

      <ul className="grid gap-4">
        {documents.map(doc => {
          const id = doc.name.replace(process.env.NEXT_PUBLIC_COLLAB_DOC_PREFIX!, '')
          return (
            <li key={id}>
              <Link href={`/${id}`} className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <article>
                  <h2 className="text-lg font-semibold">{doc.name}</h2>
                  <time className="text-sm text-gray-500 mt-1" dateTime={doc.created_at}>
                    创建时间: {new Date(doc.created_at).toLocaleString('zh-CN')}
                  </time>
                </article>
              </Link>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
