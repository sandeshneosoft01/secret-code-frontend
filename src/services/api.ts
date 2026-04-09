import { useStore } from '@/store'
import axios from 'axios'
import { toast } from 'sonner'

const URL: string | undefined = process.env.PROD
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL

export const api = axios.create({
    baseURL: URL?.replace('/api/v1', ''),
    headers: { 'Content-Type': 'application/json' },
})

const pendingRequests: Record<string, NodeJS.Timeout> = {}

// ✅ REQUEST INTERCEPTOR — add token from Redux
api.interceptors.request.use(
    async (config: any) => {
        const token = useStore.getState().user?.token
        const requestId = config.url || Math.random().toString()

        pendingRequests[requestId] = setTimeout(() => {
            toast.warning(
                'Server was inactive and is spinning up now. Loading might take a moment.'
            )
        }, 5000)
            ; (config as any)._requestId = requestId

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error: any) => Promise.reject(error)
)

// ✅ RESPONSE INTERCEPTOR (optional global error handling)
api.interceptors.response.use(
    (response: any) => {
        const requestId = (response.config as any)._requestId
        clearTimeout(pendingRequests[requestId])
        delete pendingRequests[requestId]
        return response
    },
    (error: any) => {
        const requestId = (error.config as any)?._requestId
        if (requestId) {
            clearTimeout(pendingRequests[requestId])
            delete pendingRequests[requestId]
        }
        if (error.response?.status === 401) {
            console.warn('Unauthorized - Token expired?')
            // Optionally dispatch logout
            // store.dispatch(clearToken());
        }

        return Promise.reject(error)
    }
)