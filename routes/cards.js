const express = require('express');
const router = express.Router();
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

require('dotenv').config()

const multer = require('multer')
const minio = Minio = require('minio')
const {extname, join} = require("path");

const minioClient = new minio.Client({
    endPoint: process.env.MINIO_URL,
    useSSL: true,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
});

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
    // image = process.env.UPLOADS_URL + req.file.filename
    image = req.file.filename

    // Using fPutObject API upload your file to the bucket dc-runic-arena.
    minioClient.fPutObject(process.env.MINIO_BUCKET, image, `public/uploads/${image}`, function (err, etag) {
        if (err) return console.log(err)
        console.log('File uploaded successfully.')
        image = process.env.MINIO_URL + req.file.filename
    });

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

router.get('/:id(\\d+)/image', async function (req, res, next) {
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

    let data

    minioClient.getObject(process.env.MINIO_BUCKET, card.image, function (err, objStream) {
        if (err) {
            return console.log(err)
        }
        objStream.on('data', function (chunk) {
            data = !data ? new Buffer(chunk) : Buffer.concat([data, chunk])
        })
        objStream.on('end', function () {
            res.writeHead(200, {'Content-Type': 'image/jpeg'})
            res.write(data)
            res.end()
        })
        objStream.on('error', function (err) {
            res.status(500)
            res.send(err)
        })
    })
})

router.delete('/:id(\\d+)', async (req, res, next) => {
    const cardId = parseInt(req.params.id)
    const card = await prisma.cards.delete({
        where: {id: cardId},
    })

    res.send('Gotcha')
})

router.patch('/:id(\\d+)', upload.single('image'), async (req, res, next) => {
    const cardId = parseInt(req.params.id)
    let {name, image, power, type_id, class_id} = req.body

    power = parseInt(power)
    type_id = parseInt(type_id)
    class_id = parseInt(class_id)
    image = process.env.UPLOADS_URL + req.file.filename

    await prisma.cards.update({
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
