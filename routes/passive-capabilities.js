const express = require('express');
const router = express.Router();
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

router.get('/', async function (req, res, next) {
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

router.post('/', async function (req, res, next) {
    let {name, description} = req.body

    await prisma.passiveCapabilities.create({
        data: {
            name: name,
            description: description
        }
    })
    res.send('Gotcha')
})

router.get('/:id(\\d+)', async function (req, res, next) {
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

router.delete('/:id(\\d+)', async (req, res, next) => {
    const passiveCapabilityId = parseInt(req.params.id)
    const card = await prisma.passiveCapabilities.delete({
        where: {id: passiveCapabilityId},
    })

    res.send('Gotcha')
})

router.patch('/:id(\\d+)', async (req, res, next) => {
    const passiveCapabilityId = parseInt(req.params.id)
    let {name, description} = req.body

    await prisma.cards.update({
        data: {
            name: name,
            description: description
        },
        where: {id: passiveCapabilityId},
        orderBy: {
            name: 'ASC'
        }
    })

    res.send('Gotcha')
})

module.exports = router;
