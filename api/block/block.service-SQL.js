const DBService = require('../../services/SQLdb.service')

async function query(criteria = {}) {
    var namePart = criteria.name || ''
    var query = `SELECT * FROM block`
    const blocks = await DBService.runSQL(query)
    return blocks
}

async function getById(blockId) {
    var query = `SELECT * FROM block WHERE block._id = ${blockId}`

    var blocks = await DBService.runSQL(query)
    if (blocks.length === 1) return blocks[0]
    throw new Error(`block id ${blockId} not found`)
}

async function add(block) {
    var sqlCmd = `INSERT INTO block (title, description, severity, creator_id) 
                VALUES ("${block.title}",
                        "${block.description}",
                        "${block.severity}",
                        "${block.creator_id}")`
    const newblock = await DBService.runSQL(sqlCmd)
    const currblock = await getById(newblock.insertId)
    return currblock
}

function save(block) {
    if (block._id) {
        return update(block)
    } else {
        return add(block)
    }
}

async function update(block) {
    var query = `UPDATE block set title = "${block.title}",
                                description = "${block.description}",
                                severity = ${block.severity}
                WHERE block._id = ${block._id}`

    var okPacket = await DBService.runSQL(query)
    console.log(okPacket);
    if (okPacket.affectedRows !== 0) return okPacket
    throw new Error(`No block updated - block id ${block._id}`)
}

function remove(blockId, userId) {
    // var query = `DELETE FROM block WHERE block._id = ${blockId}`
    var query = `DELETE FROM block WHERE block._id = ${blockId} && creator_id = ${userId}`

    return DBService.runSQL(query).then((okPacket) =>
        okPacket.affectedRows === 1
            ? okPacket
            : Promise.reject(new Error(`No block deleted - block id ${blockId}`)),
    )
}

module.exports = {
    query,
    getById,
    add,
    update,
    remove,
    save,
}