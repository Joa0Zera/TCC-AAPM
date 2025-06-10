const express = require('express');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();
app.use(cors());

// Configuração do multer para armazenar arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Pasta onde as imagens serão armazenadas
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nome do arquivo
    }
});

const upload = multer({ storage: storage });

// Rota para upload de imagem
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'Nenhuma imagem foi enviada.' });
    }
    res.status(200).send({ message: 'Imagem enviada com sucesso!', filename: req.file.filename });
});

app.listen(3001, () => {
    console.log('Servidor na porta 3001 rodando');
});