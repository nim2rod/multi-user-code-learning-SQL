const logger = require('../../services/logger.service')
const authService = require('../auth/auth.service')
const socketService = require('../../services/socket.service')
// const blockService = require('./block.service')
const blockService = require('./block.service-SQL')

async function getBlocks(req, res) {
    try {
        console.log('getBlocks-back');
        // const queryParams = req.query
        const blocks = await blockService.query(req.query)
        res.send(blocks)
    } catch (err) {
        logger.error('Cannot get Blocks', err)
        res.status(500).send({ err: 'Failed to get Blocks' })
    }
}

async function getBlock(req, res) {
    try {
        const block = await blockService.getById(req.params.id)
        res.send(block)
    } catch (err) {
        logger.error('Failed to get Block', err)
        res.status(500).send({ err: 'Failed to get Block' })
    }
}

async function deleteBlock(req, res) {
    try {
        const deletedCount = await blockService.remove(req.params.id)
        if (deletedCount === 1) {
            res.send({ msg: 'Deleted successfully' })
        } else {
            res.status(400).send({ err: 'Cannot remove Block' })
        }
    } catch (err) {
        logger.error('Failed to delete Block', err)
        res.status(500).send({ err: 'Failed to delete Block' })
    }
}


async function addBlock(req, res) {
    console.log('back-Block-controler');
    const Block = req.body
    // console.log('req.body', Block);
    try {
        const addedBlock = await blockService.add(Block)
        // broadcast({ type: 'something-changed', BlockId: req.session?.Block._id })
        res.json(addedBlock)
    } catch (err) {
        res.status(500).send(err)
    }
}


async function updateBlock(req, res) {
    try {
        const Block = req.body
        const savedBlock = await blockService.update(Block)
        console.log('Block', savedBlock);
        res.send(savedBlock)
    } catch (err) {
        logger.error('Failed to update Block', err)
        res.status(500).send({ err: 'Failed to update Block' })
    }
}


module.exports = {
    getBlocks,
    getBlock,
    deleteBlock,
    addBlock,
    updateBlock
}