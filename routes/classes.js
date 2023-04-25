const express = require('express');
const router = express.Router();
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const multer = require('multer')
const upload = multer()

router.get('/', async function (req, res, next) {
    const archetypes = await prisma.classes.findMany({})
    res.send(archetypes);
});

router.post('/', upload.none(), async function (req, res, next) {
    const name = req.body.name

    await prisma.classes.create({
        data: {
            name: name
        }
    })

    res.send('Gotcha')

})


router.get('/:id(\\d+)', async function (req, res, next) {
    const typeId = parseInt(req.params.id)

    const archetype = await prisma.classes.findUnique({
        where: {
            id: typeId,
        }
    })

    res.send(archetype)
})

router.delete('/:id(\\d+)', async (req, res, next) => {
    const typeId = parseInt(req.params.id)

    await prisma.classes.delete({
        where: {id: typeId},
    })

    res.send('Gotcha')
})

router.put('/:id(\\d+)', upload.none(), async (req, res, next) => {
    const typeId = parseInt(req.params.id)
    const name = req.body.name

    await prisma.classes.update({
        data: {
            name: name
        },
        where: {id: typeId},
    })
    res.send('Gotcha')
})

module.exports = router;
