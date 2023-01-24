const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')
const { useStore } = require('vuex')

async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('block')
        const blocks = await collection.find(criteria).toArray()
        return blocks
    } catch (err) {
        logger.error('cannot find blocks', err)
        throw err
    }
}

async function getById(blockId) {
    try {
        const collection = await dbService.getCollection('block')
        const block = await collection.findOne({ _id: ObjectId(blockId) })

        return block
    } catch (err) {
        logger.error(`while finding block by id: ${blockId}`, err)
        throw err
    }
}

async function remove(blockId) {
    try {
        const store = asyncLocalStorage.getStore()
        const { loggedinUser } = store
        const collection = await dbService.getCollection('block')
        // remove only if block is owner/admin
        const criteria = { _id: ObjectId(blockId) }
        if (!loggedinUser.isAdmin) criteria.byUserId = ObjectId(loggedinUser._id)
        const { deletedCount } = await collection.deleteOne(criteria)
        return deletedCount
    } catch (err) {
        logger.error(`cannot remove block ${blockId}`, err)
        throw err
    }
}

async function add(block) {
    const collection = await dbService.getCollection('block')
    const { ops } = await collection.insertOne(block)
    return ops[0]
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.byUserId) criteria.byUserId = filterBy.byUserId
    return criteria
}

async function update(block) {
    try {
        var id = ObjectId(block._id)
        delete block._id
        const collection = await dbService.getCollection('block')
        await collection.updateOne({ _id: id }, { $set: { ...block } })
        block._id = id
        return block
    } catch (err) {
        logger.error(`cannot update block ${block._id}`, err)
        throw err
    }
}

module.exports = {
    query,
    getById,
    remove,
    add,
    update
}


