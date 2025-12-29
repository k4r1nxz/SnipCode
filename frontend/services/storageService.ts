import { Snippet, User, Comment } from '../types'

// @ts-ignore
const API_URL = import.meta.env.VITE_API_URL

const getHeaders = (): HeadersInit => {
  const token = localStorage.getItem('auth_token')
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
  if (token && token !== 'undefined') {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

const handleResponse = async (res: Response) => {
  let data: any = null
  const type = res.headers.get('content-type')
  if (type && type.includes('application/json')) {
    data = await res.json()
  } else {
    const text = await res.text()
    data = { message: text }
  }
  if (!res.ok) throw new Error(data?.error || data?.message || 'API Error')
  return data
}

const transformSnippet = (s: any): Snippet => ({
  id: s.id?.toString(),
  slug: s.slug,
  title: s.title,
  description: s.description,
  code: s.code,
  language: s.language,
  filename: s.filename,
  author: {
    id: s.user_id?.toString() || '0',
    username: s.user?.username || 'unknown',
    avatar: s.user?.avatar,
  },
  createdAt: new Date(s.created_at || Date.now()).getTime(),
  updatedAt: new Date(s.updated_at || Date.now()).getTime(),
  likes: s.likes || 0,
  views: s.views || 0,
  commentCount: s.comments_count || 0,
  tags: s.tags || [],
})

export const getCurrentUser = async (): Promise<User | null> => {
  const raw = localStorage.getItem('current_user')
  return raw ? JSON.parse(raw) : null
}

export const fetchSnippets = async (filters: any = {}): Promise<Snippet[]> => {
  const params = new URLSearchParams()
  if (filters.search) params.append('search', filters.search)
  if (filters.author) params.append('author', filters.author)
  
  const res = await fetch(`${API_URL}/code?${params.toString()}`, {
    headers: getHeaders(),
  })
  const data = await handleResponse(res)
  const list = data.data || data || []
  return list.map(transformSnippet)
}

export const fetchSnippetBySlug = async (slug: string): Promise<Snippet> => {
  const res = await fetch(`${API_URL}/code/${slug}`, { headers: getHeaders() })
  const data = await handleResponse(res)
  return transformSnippet(data.data || data)
}

export const fetchUserProfile = async (username: string): Promise<User> => {
  const res = await fetch(`${API_URL}/profile/${username}`, { headers: getHeaders() })
  const data = await handleResponse(res)
  return data.data || data
}

export const fetchComments = async (slug: string): Promise<Comment[]> => {
  const res = await fetch(`${API_URL}/code/${slug}/comments`, { headers: getHeaders() })
  const data = await handleResponse(res)
  const list = data.data || data || []
  return list.map((c: any) => ({
    id: c.id?.toString(),
    userId: c.user_id?.toString() || '0',
    username: c.user?.username || 'User',
    content: c.content,
    createdAt: new Date(c.created_at).getTime()
  }))
}

export const incrementView = async (slug: string): Promise<void> => {
  await fetch(`${API_URL}/code/${slug}/view`, { method: 'POST', headers: getHeaders() }).catch(() => {})
}

export const postComment = async (slug: string, content: string): Promise<Comment> => {
  const res = await fetch(`${API_URL}/code/${slug}/comment`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ content }),
  })
  const c = await handleResponse(res)
  return {
    id: c.id?.toString(),
    userId: c.user_id?.toString() || '0',
    username: c.user?.username || 'User',
    content: c.content,
    createdAt: Date.now(),
  }
}

export const login = async (payload: any): Promise<User> => {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  })
  const data = await handleResponse(res)
  localStorage.setItem('auth_token', data.token)
  const user = { id: data.user?.id || '0', username: data.user?.username || payload.email.split('@')[0], email: payload.email }
  localStorage.setItem('current_user', JSON.stringify(user))
  return user
}

export const register = async (payload: any): Promise<User> => {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  })
  await handleResponse(res)
  return login({ email: payload.email, password: payload.password })
}

export const logout = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('current_user')
}

export const likeSnippet = async (slug: string) => {
  await fetch(`${API_URL}/code/${slug}/like`, { method: 'POST', headers: getHeaders() })
}

export const createSnippet = async (payload: any): Promise<Snippet> => {
  const res = await fetch(`${API_URL}/code/create`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(payload) })
  const data = await handleResponse(res)
  return transformSnippet(data.data || data)
}

export const updateSnippet = async (slug: string, payload: any): Promise<Snippet> => {
  const res = await fetch(`${API_URL}/code/edit/${slug}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(payload) })
  const data = await handleResponse(res)
  return transformSnippet(data.data || data)
}

export const deleteSnippet = async (slug: string) => {
  await fetch(`${API_URL}/code/${slug}`, { method: 'DELETE', headers: getHeaders() })
}

export const fetchDashboardStats = async () => {
  const res = await fetch(`${API_URL}/dashboard`, { headers: getHeaders() })
  return await handleResponse(res)
}

export const fetchUserSnippets = async () => fetchSnippets({ author: 'me' })
