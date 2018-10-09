const router = require('express').Router()
const todoController = require('../controllers/todoController')
const middleware = require('../middleware/middleware')

router.post('/create',middleware.authenticate, todoController.create)
router.get('/read',middleware.authenticate,todoController.read)
router.put('/update/:id',middleware.isHim,todoController.update)
router.delete('/delete/:id',middleware.isHim,todoController.delete)
router.put('/complete/:id',middleware.isHim,todoController.complete)
router.put('/uncomplete/:id',middleware.isHim,todoController.uncomplete)

module.exports = router