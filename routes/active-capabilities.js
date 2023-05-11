const express = require('express')
const cors = require('cors')
const router = express.Router();
const {PrismaClient} = require('@prisma/client')
const multer = require("multer");
const {extname} = require("path");
const prisma = new PrismaClient()

const storage = multer.memoryStorage()

const upload = multer({
    storage: storage,
    limits: {fileSize: 5 * 1000 * 1000},
    fileFilter: (req, file, cb) => {
        // Rename the file here
        const fileExt = extname(file.originalname)
        file.originalname = `${file.fieldname}-${Date.now()}${fileExt}`
        cb(null, true)
    }
})

router.get('/', cors(), async function (req, res, next) {
    const activeCapabilities = await prisma.activeCapabilities.findMany({
        select: {
            id: true,
            name: true,
            description: true,
            type: true
        },
        orderBy: {
            name: 'asc',
        },
    });

    res.send(activeCapabilities);
})

router.get('/:id(\\d+)', cors(), async function (req, res, next) {
    const activeCapabilityId = parseInt(req.params.id)

    const activeCapability = await prisma.activeCapabilities.findUnique({
        where: {
            id: activeCapabilityId,
        },
        select: {
            id: true,
            name: true,
            description: true
        }
    })

    res.send(activeCapability)
})

router.post('/', cors(), upload.none(), async function (req, res, next) {
    let {name, description, type} = req.body

    await prisma.activeCapabilities.create({
        data: {
            name: name,
            description: description,
            type: type
        }
    })
    res.send('Gotcha')
})

router.delete('/:id(\\d+)', cors(), async (req, res, next) => {
    const activeCapabilityId = parseInt(req.params.id)
    const card = await prisma.activeCapabilities.delete({
        where: {id: activeCapabilityId},
    })

    res.send('Gotcha')
})

router.patch('/:id(\\d+)', cors(), async (req, res, next) => {
    const activeCapabilityId = parseInt(req.params.id)
    let {name, description, type} = req.body

    await prisma.activeCapabilities.update({
        data: {
            name: name,
            description: description,
            type: type
        },
        where: {id: activeCapabilityId}
    })

    res.send('Gotcha')
})

module.exports = router;
