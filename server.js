/**
 * Servidor de produção para Hostinger
 * AutoZen V4 - Node.js 22+
 */

const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

// Inicializar Next.js
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Parse URL
      const parsedUrl = parse(req.url, true)
      
      // Log requests em desenvolvimento
      if (dev) {
        console.log(`${req.method} ${req.url}`)
      }
      
      // Handle request
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('Internal server error')
    }
  })
    .once('error', (err) => {
      console.error('Server error:', err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`
╔═══════════════════════════════════════════╗
║                                           ║
║           AutoZen V4 - Ready!             ║
║                                           ║
║  Environment: ${dev ? 'Development' : 'Production'.padEnd(11)}         ║
║  URL: http://${hostname}:${port}          ║
║  Node.js: ${process.version.padEnd(9)}                    ║
║                                           ║
╚═══════════════════════════════════════════╝
      `)
    })
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server')
  process.exit(0)
})
