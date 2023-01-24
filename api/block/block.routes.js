const express = require('express')
// const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getBlocks, getBlock, } = require('./block.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getBlocks)
router.get('/:id', getBlock)
// router.post('/', log, addBlock)
// router.delete('/:id', deleteBlock)
// router.put('/:id', requireAuth, updateBlock)
// router.put('/:id', updateBlock)


module.exports = router