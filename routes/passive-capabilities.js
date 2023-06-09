const express = require('express')
const cors = require('cors')
const router = express.Router()
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
    const passiveCapabilities = await prisma.passiveCapabilities.findMany({
        select: {
            id: true,
            name: true,
            description: true
        },
        orderBy: {
            name: 'asc',
        },
    });

    res.send(passiveCapabilities);
});

router.post('/', cors(), upload.none(), async function (req, res, next) {
    let {name, description} = req.body

    await prisma.passiveCapabilities.create({
        data: {
            name: name,
            description: description
        }
    })
    res.send('Gotcha')
})

router.get('/:id(\\d+)', cors(), async function (req, res, next) {
    const passiveCapabilityId = parseInt(req.params.id)

    const passiveCapability = await prisma.passiveCapabilities.findUnique({
        where: {
            id: passiveCapabilityId,
        },
        select: {
            id: true,
            name: true,
            description: true
        }
    })

    res.send(passiveCapability)
})

router.delete('/:id(\\d+)', cors(), async (req, res, next) => {
    const passiveCapabilityId = parseInt(req.params.id)
    await prisma.passiveCapabilities.delete({
        where: {id: passiveCapabilityId},
    })

    res.send('Gotcha')
})

router.patch('/:id(\\d+)', cors(), upload.none(), async (req, res, next) => {
    const passiveCapabilityId = parseInt(req.params.id)
    let {name, description} = req.body

    await prisma.passiveCapabilities.update({
        data: {
            name: name,
            description: description
        },
        where: {id: passiveCapabilityId}
    })

    res.send('Gotcha')
})

module.exports = router;
