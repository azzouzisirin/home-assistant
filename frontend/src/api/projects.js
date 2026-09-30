import { request } from './client.js'

const token = () => localStorage.getItem('token')

export const createProject = (data) =>
  request('/projects', { method: 'POST', body: data, token: token() })

export const listProjects = () => request('/projects', { token: token() })