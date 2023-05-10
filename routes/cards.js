const express = require('express');
const cors = require('cors')
const router = express.Router();
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
const multer = require('multer')
const minio = Minio = require('minio')
const {extname, join} = require("path");
const storage = multer.memoryStorage()
require('dotenv').config()

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

const minioClient = new minio.Client({
    endPoint: process.env.MINIO_URL,
    useSSL: true,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
})

router.get('/', cors(), async function (req, res, next) {
    /*const cards = await prisma.cards.findMany({
        select: {
            id: true,
            name: true,
            image: true,
            power: true,
            type: true,
            class: true,
            passive_capability: true,
            active_capabilities: true
        },
        orderBy: {
            name: 'asc',
        },
    })*/
    const cards = await prisma.cards.findMany({
        include: {
            passive_capability: true,
            active_capabilities: {
                include: {
                    active_capability: true
                }
            }
        }
    })

    res.send(cards);
});

router.post('/', upload.single('image'), async function (req, res, next) {
    let {name, image, power, type_id, class_id, passive_capability_id} = req.body

    power = parseInt(power)
    type_id = parseInt(type_id)
    class_id = parseInt(class_id)
    passive_capability_id = parseInt(passive_capability_id)

    let fileName = req.file.originalname
    let fileData = req.file.buffer

    const metaData = {
        'Content-Type': req.file.mimetype
    }

    // Using fPutObject API upload your file to the bucket.
    minioClient.putObject(process.env.MINIO_BUCKET, fileName, fileData, metaData, (err, etag) => {
        if (err) return console.log(err)
        console.log('File uploaded successfully.')
        image = process.env.MINIO_URL + fileName
    });

    await prisma.cards.create({
        data: {
            name: name,
            image: fileName,
            power: power,
            type_id: type_id,
            class_id: class_id,
            passive_capability_id: passive_capability_id
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
            type: true,
            class: true,
            passive_capability: true,
            active_capabilities: true
        }
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
            type: true,
            class: true,
            passive_capability: true,
            active_capabilities: true
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
    let {name, image, power, type_id, class_id, passive_capability_id} = req.body

    power = parseInt(power)
    type_id = parseInt(type_id)
    class_id = parseInt(class_id)
    passive_capability_id = parseInt(passive_capability_id)

    image = process.env.UPLOADS_URL + image

    await prisma.cards.update({
        data: {
            name: name,
            image: image,
            power: power,
            type_id: type_id,
            class_id: class_id,
            passive_capability_id: passive_capability_id
        },
        where: {id: cardId},
    })

    res.send('Gotcha')
})

router.get('/name-generator', async (req, res) => {
    const monsterNames = ['Ancient Dragon', 'Chaos Mage', 'Crystal Dragon', 'Crystal Titan', 'Cursed Knight', 'Demon Lord', 'Divine Guardian', 'Forest Guardian', 'Goblin Chieftain', 'Ice Queen', 'Inferno Demon', 'Moonlight Dragon', 'Necromancer', 'Ocean Guardian', 'Phoenix Feather', 'Sky Elemental', 'Spectral Knight', 'Thunder God', 'Thunderbird', 'Vampire Lord']
    const monsterAdjectives = ['Adorable', 'Friendly', 'Playful', 'Affectionate', 'Curious', 'Gentle', 'Loyal', 'Helpful', 'Cheerful', 'Brave', 'Ferocious', 'Vicious', 'Malevolent', 'Cruel', 'Monstrous', 'Terrifying', 'Malicious', 'Sinister', 'Diabolical', 'Savage']

    let j = Math.floor(Math.random() * monsterAdjectives.length)
    let i = Math.floor(Math.random() * monsterNames.length)

    let monsterName = monsterAdjectives[j] + ' ' + monsterNames[i]
    res.send(monsterName)
})

module.exports = router;
