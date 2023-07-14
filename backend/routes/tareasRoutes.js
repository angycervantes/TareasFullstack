const express = require('express')
const router = express.Router()
const {getTareas, createTareas, updateTareas, deleteTareas} = require('../controllers/tareasControllers.js')
const { protect } = require('../middleware/authMiddleware')


router.route('/').get(getTareas).post(protect, createTareas)
// router.get('/', protect, getTareas)
// router.post('/', protect, createTareas)

router.route('/:id').delete(deleteTareas).put(protect, updateTareas)
// router.put('/:id', protect, updateTareas)
// router.delete('/:id', protect, deleteTareas)

module.exports = router