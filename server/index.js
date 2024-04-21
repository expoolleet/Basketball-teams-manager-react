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

const app = express()

const corsOptions = {
	origin: 'http://localhost:3000',
	optionsSuccessStatus: 200,
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

app.post('/delete', (req, res) => {
	let body = ' '
	req.on('data', (chunk) => {
		body += chunk
	})

	req.on('end', () => {
		const parsed = JSON.parse(body)

		const removePart = 'http://localhost:' + PORT + '/'
		const url = './' + parsed.imagePath.replace(removePart, '')

		if (fs.existsSync(url)){
			fs.unlinkSync(url)
		}

		res.end()
	})
})

app.listen(PORT)
