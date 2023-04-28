const express = require('express');
const router = express.Router();
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const multer = require('multer')
const {extname} = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const fileExt = extname(file.originalname)
        const newFilename = `${file.fieldname}-${Date.now()}${fileExt}`
        cb(null, newFilename)
    }
})

const upload = multer({storage: storage})

router.get('/', async function (req, res, next) {
    const cards = await prisma.cards.findMany({
        select: {
            id: true,
            name: true,
            image: true,
            power: true,
            type: {select: {id: true, name: true}},
            class: {select: {id: true, name: true}}
        },
    });

    res.send(cards);
});

router.post('/', upload.single('image'), async function (req, res, next) {
    let {name, image, power, type_id, class_id} = req.body

    power = parseInt(power)
    type_id = parseInt(type_id)
    class_id = parseInt(class_id)
    image = req.file.filename

    await prisma.cards.create({
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
        },
        select: {
            id: true,
            name: true,
            image: true,
            power: true,
            type: {select: {id: true, name: true}},
            class: {select: {id: true, name: true}}
        },
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
