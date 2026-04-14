import { api } from './api'
import { useStore } from '@/store'
import type { SignInUserPayload, SignUpUserPayload } from '@/types'

export const getProfileDetails = async () => {
    try {
        const response = await api.get('/api/v1/profile-details')
        return response.data
    } catch (error: any) {
        if (error.response?.status === 401) {
            setTimeout(() => {
                useStore.getState().logout()
                localStorage.clear()
                window.location.href = '/sign-in'
            }, 1200)
        }
        throw error
    }
}

export const signUpUser = async (data: SignUpUserPayload) => {
    try {
        const response = await api.post('/api/v1/signup', data)
        return response.data
    } catch (error: any) {
        throw error
    }
}

export const signInUser = async (data: SignInUserPayload) => {
    try {
        const response = await api.post('/api/v1/signin', data)
        return response.data
    } catch (error: any) {
        throw error
    }
}

export const signUpWithGoogle = async (idToken: string) => {
    try {
        const response = await api.post('/api/v1/signup/google', { idToken })
        return response.data
    } catch (error: any) {
        throw error
    }
}

export const signInWithGoogle = async (idToken: string) => {
    try {
        const response = await api.post('/api/v1/signin/google', { idToken })
        return response.data
    } catch (error: any) {
        throw error
    }
}