import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import compression from 'compression'

async function createServer() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const resolve = (p) => path.resolve(__dirname, p)

  const spaIndex = fs.readFileSync(resolve('dist/static/spa-entrypoint.html'), 'utf-8')

  const app = express()

  app.use(compression())

  app.use('/', express.static('dist/static/'))

  app.use('*', (req, res) => {
    const prerenderedPath = resolve(path.join('dist/static/', req.originalUrl, 'index.html'));
    console.log(prerenderedPath)
    if (fs.existsSync(prerenderedPath)) {
      const html = fs.readFileSync(prerenderedPath, 'utf-8')
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } else {
      res.status(200).set({ 'Content-Type': 'text/html' }).end(spaIndex)
    }
  })

  app.listen(6173, () => {
    console.log('http://localhost:6173')
  })
}

createServer()