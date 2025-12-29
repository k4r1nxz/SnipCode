import { Snippet, User, Comment } from '../types'

const getStorage = (key: string) => JSON.parse(localStorage.getItem(key) || '[]')
const setStorage = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data))

export const fetchSnippets = async (filters: any = {}): Promise<Snippet[]> => {
  let snippets = getStorage('snippets')
  
  if (filters.search) {
    const q = filters.search.toLowerCase()
    snippets = snippets.filter((s: Snippet) => 
      s.title.toLowerCase().includes(q) || s.language.toLowerCase().includes(q)
    )
  }

  if (filters.author === 'me') {
    const user = await getCurrentUser()
    snippets = snippets.filter((s: Snippet) => s.author.id === user?.id)
  }

  if (filters.popular) {
    snippets.sort((a: Snippet, b: Snippet) => b.likes - a.likes)
  } else {
    snippets.sort((a: Snippet, b: Snippet) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  return snippets
}

export const fetchSnippetBySlug = async (slug: string): Promise<Snippet | null> => {
  const snippets = getStorage('snippets')
  return snippets.find((s: Snippet) => s.slug === slug) || null
}

export const createSnippet = async (data: any): Promise<Snippet> => {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const newSnippet: Snippet = {
    id: Date.now().toString(),
    ...data,
    slug: data.title.toLowerCase().replace(/ /g, '-'),
    author: user,
    likes: 0,
    views: 0,
    createdAt: new Date().toISOString()
  }

  const snippets = getStorage('snippets')
  setStorage('snippets', [newSnippet, ...snippets])
  return newSnippet
}

export const updateSnippet = async (slug: string, data: any): Promise<void> => {
  const snippets = getStorage('snippets')
  const index = snippets.findIndex((s: Snippet) => s.slug === slug)
  if (index !== -1) {
    snippets[index] = { ...snippets[index], ...data }
    setStorage('snippets', snippets)
  }
}

export const deleteSnippet = async (slug: string): Promise<void> => {
  const snippets = getStorage('snippets')
  setStorage('snippets', snippets.filter((s: Snippet) => s.slug !== slug))
}

export const likeSnippet = async (slug: string): Promise<void> => {
  const snippets = getStorage('snippets')
  const index = snippets.findIndex((s: Snippet) => s.slug === slug)
  if (index !== -1) {
    snippets[index].likes += 1
    setStorage('snippets', snippets)
  }
}

export const incrementView = async (slug: string): Promise<void> => {
  const snippets = getStorage('snippets')
  const index = snippets.findIndex((s: Snippet) => s.slug === slug)
  if (index !== -1) {
    snippets[index].views = (snippets[index].views || 0) + 1
    setStorage('snippets', snippets)
  }
}

export const fetchComments = async (slug: string): Promise<Comment[]> => {
  const comments = getStorage('comments')
  return comments.filter((c: Comment) => c.snippetSlug === slug)
}

export const postComment = async (slug: string, content: string): Promise<Comment> => {
  const user = await getCurrentUser()
  const comment: Comment = {
    id: Date.now().toString(),
    snippetSlug: slug,
    username: user?.username || 'Anonymous',
    content,
    createdAt: new Date().toISOString()
  }
  const comments = getStorage('comments')
  setStorage('comments', [comment, ...comments])
  return comment
}

export const getCurrentUser = async (): Promise<User | null> => {
  return JSON.parse(localStorage.getItem('currentUser') || 'null')
}

export const logout = async () => localStorage.removeItem('currentUser')

export const fetchDashboardStats = async () => {
  const user = await getCurrentUser()
  const snippets = getStorage('snippets').filter((s: Snippet) => s.author.id === user?.id)
  return {
    total_snippets: snippets.length,
    total_likes: snippets.reduce((acc: number, curr: Snippet) => acc + curr.likes, 0),
    total_comments: 0
  }
}

export const fetchUserSnippets = async (): Promise<Snippet[]> => {
    return fetchSnippets({ author: 'me' })
}
