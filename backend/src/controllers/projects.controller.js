import db from '../config/db.js'
import { GOALS, ROOM_TYPES } from '../config/projects.js'

export function createProject(req, res) {
  const { goal, goalText, roomType, name } = req.body || {}

  if (!GOALS.includes(goal)) {
    return res.status(400).json({ error: 'Invalid goal' })
  }
  if (!ROOM_TYPES.includes(roomType)) {
    return res.status(400).json({ error: 'Invalid room type' })
  }

  const cleanText = typeof goalText === 'string' ? goalText.trim().slice(0, 500) : null
  const cleanName = typeof name === 'string' ? name.trim().slice(0, 80) : null

  const info = db
    .prepare(
      'INSERT INTO projects (user_id, name, goal, goal_text, room_type) VALUES (?, ?, ?, ?, ?)'
    )
    .run(req.userId, cleanName || null, goal, cleanText || null, roomType)

  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(info.lastInsertRowid)
  res.status(201).json({ project })
}

export function listProjects(req, res) {
  const projects = db
    .prepare('SELECT * FROM projects WHERE user_id = ? ORDER BY id DESC')
    .all(req.userId)
  res.json({ projects })
}