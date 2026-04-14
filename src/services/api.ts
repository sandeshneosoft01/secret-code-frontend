import { useStore } from '@/store'
import axios from 'axios'
import { toast } from 'sonner'

const URL: string | undefined = process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL

export const api = axios.create({
    baseURL: URL?.replace('/api/v1', ''),
    headers: { 'Content-Type': 'application/json' },
})

const getLocale = () => {
    if (typeof document === 'undefined') return 'en'
    const name = 'NEXT_LOCALE='
    const decodedCookie = decodeURIComponent(document.cookie)
    const ca = decodedCookie.split(';')
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') {
            c = c.substring(1)
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length)
        }
    }
    return 'en'
}

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

        config.headers['Accept-Language'] = getLocale()

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
            useStore.getState().logout();
            // next-intl-aware redirect; or use window.location for simplicity:
            window.location.href = '/login';
        }

        return Promise.reject(error)
    }
)