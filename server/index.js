const path = require('path')
const cors = require('cors')
const express = require('express')
const multer = require('multer')
const fs = require('fs')

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './server/uploads')
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname))
	},
})

const upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
			cb(null, true)
		} else {
			cb(null, false)
			return cb(new Error('Only .png, .jpg and .jpeg format allowed!'))
		}
	},
})

const uploadImage = upload.single('image')

const PORT = 3001

const HOST = 'localhost'

const app = express()

const whiteList = ['http://localhost:3000', 'http://25.60.93.45:3000']

const corsOptions = {
	origin: (origin, callback) => {
		const originIsWhitelisted = whiteList.indexOf(origin) !== -1
		callback(null, originIsWhitelisted)
	},
	credentials: true,
}

app.use(cors(corsOptions))

app.use('/server', express.static('server'))

app.post('/upload', async (req, res) => {
	uploadImage(req, res, (err) => {
		if (err) {
			return res.status(400).send({ message: err.message })
		}
		const file = req.file
		res.json(file)
	})
})

app.delete('/server/uploads/:image', (req, res) => {
	const image = req.params.image
	const imagePath = path.join('server', 'uploads', image)

	if (fs.existsSync(imagePath)) {
		fs.unlinkSync(imagePath)
	}
	res.send()
})

app.listen(PORT, HOST, () => {
	console.log(`Server ${HOST} statred on port ${PORT}`)
})
