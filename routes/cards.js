const express = require('express');
const router = express.Router();
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const multer = require('multer')
const upload = multer()

router.get('/', async function (req, res, next) {
    const cards = await prisma.cards.findMany({})
    res.send(cards);
});

router.post('/', upload.none(), async function (req, res, next) {
    let {name, image, power, type_id, class_id} = req.body

    power = parseInt(power)
    type_id = parseInt(type_id)
    class_id = parseInt(class_id)

    const card = await prisma.cards.create({
        data: {
            name: name,
            image: image,
            power: power,
            type_id: type_id,
            class_id: class_id
        }
    })

    res.send('Gotcha')

})


router.get('/:id(\\d+)', async function (req, res, next) {
    const cardId = parseInt(req.params.id)

    const card = await prisma.cards.findUnique({
        where: {
            id: cardId,
        }
    })

    res.send(card)
})

router.delete('/:id(\\d+)', async (req, res, next) => {
    const cardId = parseInt(req.params.id)
    const card = await prisma.cards.delete({
        where: {id: cardId},
    })

    res.send('Gotcha')
})

router.put('/:id(\\d+)', upload.none(), async (req, res, next) => {
    const cardId = parseInt(req.params.id)
    let {name, image, power, type_id, class_id} = req.body

    power = parseInt(power)
    type_id = parseInt(type_id)
    class_id = parseInt(class_id)

    const card = await prisma.cards.update({
        data: {
            name: name,
            image: image,
            power: power,
            type_id: type_id,
            class_id: class_id
        },
        where: {id: cardId},
    })
    res.send('Gotcha')
})

module.exports = router;
