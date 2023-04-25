const express = require('express');
const router = express.Router();
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const multer = require('multer')
const upload = multer()

router.get('/', async function (req, res, next) {
    const types = await prisma.types.findMany({})
    res.send(types);
});

router.post('/', upload.none(), async function (req, res, next) {
    const name = req.body.name

    await prisma.types.create({
        data: {
            name: name
        }
    })

    res.send('Gotcha')

})


router.get('/:id(\\d+)', async function (req, res, next) {
    const typeId = parseInt(req.params.id)

    const type = await prisma.types.findUnique({
        where: {
            id: typeId,
        }
    })

    res.send(type)
})

router.delete('/:id(\\d+)', async (req, res, next) => {
    const typeId = parseInt(req.params.id)

    await prisma.types.delete({
        where: {id: typeId},
    })

    res.send('Gotcha')
})

router.put('/:id(\\d+)', upload.none(), async (req, res, next) => {
    const typeId = parseInt(req.params.id)
    const name = req.body.name

    await prisma.types.update({
        data: {
            name: name
        },
        where: {id: typeId},
    })
    res.send('Gotcha')
})

module.exports = router;
