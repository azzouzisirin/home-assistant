import { Router } from 'express'
import { createProject, listProjects } from '../controllers/projects.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const router = Router()
router.use(requireAuth)
router.post('/', createProject)
router.get('/', listProjects)

export default router