const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');  // Import para lidar com caminhos
const app = express();
app.use(cors());
app.use(express.json());

// Servir a pasta 'public' como estática
app.use(express.static(path.join(__dirname, 'public')));

//POST
// Rota para adicionar patrimônio
app.post('/patrimonio', (req, res) => {
    const { descricao, local, status, valor, imagem } = req.body;

    // Lê os dados existentes do banco
    fs.readFile('db.json', (err, data) => {
        if (err) return res.status(500).send({ message: 'Erro ao ler o banco de dados.' });

        const json = JSON.parse(data);
        // Obtém o maior ID existente
        const maxId = json.patrimonio.reduce((max, p) => Math.max(max, p.id), 0);
        const newId = maxId + 1; // Próximo ID

        const newPatrimonio = { id: newId, descricao, local, status, valor, imagem };

        // Adiciona o novo patrimônio
        json.patrimonio.push(newPatrimonio);

        // Salva as alterações no banco de dados
        fs.writeFile('db.json', JSON.stringify(json, null, 2), (err) => {
            if (err) return res.status(500).send({ message: 'Erro ao salvar no banco de dados.' });

            res.status(200).send({ message: 'Patrimônio cadastrado com sucesso!', patrimonio: newPatrimonio });
        });
    });
});

/* GET */
// Rota para obter todos os patrimônios
app.get('/patrimonio', (req, res) => {
    fs.readFile('db.json', (err, data) => {
        if (err) return res.status(500).send({ message: 'Erro ao ler o banco de dados.' });

        const json = JSON.parse(data);
        res.status(200).send(json.patrimonio);
    });
});

// Rota para buscar patrimônio por local com correspondência parcial
app.get('/patrimonio/local', (req, res) => {
    const { local } = req.query;

    if (!local) {
        return res.status(400).send({ message: 'Local não especificado.' });
    }

    fs.readFile('db.json', (err, data) => {
        if (err) return res.status(500).send({ message: 'Erro ao ler o banco de dados.' });

        const json = JSON.parse(data);

        // Filtrar patrimônios pelo local com correspondência parcial
        const patrimoniosPorLocal = json.patrimonio.filter(p =>
            p.local.toLowerCase().includes(local.toLowerCase())
        );

        if (patrimoniosPorLocal.length === 0) {
            return res.status(404).send({ message: 'Nenhum patrimônio encontrado para o local especificado.' });
        }

        res.status(200).send(patrimoniosPorLocal);
    });
});

// Rota para buscar patrimônio por descrição com correspondência parcial
app.get('/patrimonio/buscar-por-descricao', (req, res) => {
    const { descricao } = req.query;

    if (!descricao) {
        return res.status(400).send({ message: 'Descrição não especificada.' });
    }

    fs.readFile('db.json', (err, data) => {
        if (err) return res.status(500).send({ message: 'Erro ao ler o banco de dados.' });

        const json = JSON.parse(data);

        // Filtrar patrimônios pela descrição com correspondência parcial
        const patrimoniosPorDescricao = json.patrimonio.filter(p =>
            p.descricao.toLowerCase().includes(descricao.toLowerCase())
        );

        if (patrimoniosPorDescricao.length === 0) {
            return res.status(404).send({ message: 'Nenhum patrimônio encontrado para a descrição especificada.' });
        }

        res.status(200).send(patrimoniosPorDescricao);
    });
});

/* GET específico para Imagem */
// Rota para obter a imagem de um patrimônio por ID
// Rota para fazer a busca pelo ID/NI
app.get('/patrimonio/:id', (req, res) => {
    const id = parseInt(req.params.id);

    fs.readFile('db.json', (err, data) => {
        if (err) return res.status(500).send({ message: 'Erro ao ler o banco de dados.' });

        const json = JSON.parse(data);
        const patrimonio = json.patrimonio.find(p => p.id === id);

        if (!patrimonio) {
            return res.status(404).send({ message: 'Patrimônio não encontrado.' });
        }

        res.status(200).send(patrimonio);
    });
});

// Servir arquivos de imagem da pasta 'uploads'
app.use('/imagens', express.static(path.join(__dirname, 'uploads')));

/* PUT */
// Rota para atualizar um patrimônio por ID
app.put('/patrimonio/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { descricao, local, status, valor } = req.body;

    fs.readFile('db.json', (err, data) => {
        if (err) return res.status(500).send({ message: 'Erro ao ler o banco de dados.' });

        const json = JSON.parse(data);
        const patrimonioIndex = json.patrimonio.findIndex(p => p.id === id);

        if (patrimonioIndex === -1) {
            return res.status(404).send({ message: 'Patrimônio não encontrado.' });
        }

        // Atualiza os dados do patrimônio
        json.patrimonio[patrimonioIndex] = {
            ...json.patrimonio[patrimonioIndex],
            descricao,
            local,
            status,
            valor
        };

        // Salva as alterações no banco de dados
        fs.writeFile('db.json', JSON.stringify(json, null, 2), (err) => {
            if (err) return res.status(500).send({ message: 'Erro ao salvar no banco de dados.' });

            res.status(200).send({ message: 'Patrimônio atualizado com sucesso!' });
        });
    });
});

/* DELETE */
// Rota para deletar um patrimônio por ID
app.delete('/patrimonio/:id', (req, res) => {
    const id = parseInt(req.params.id);

    fs.readFile('db.json', (err, data) => {
        if (err) return res.status(500).send({ message: 'Erro ao ler o banco de dados.' });

        const json = JSON.parse(data);
        // Filtra os patrimônios para remover o que tem o ID correspondente
        const newPatrimonioList = json.patrimonio.filter(p => p.id !== id);

        // Verifica se algum patrimônio foi removido
        if (newPatrimonioList.length === json.patrimonio.length) {
            return res.status(404).send({ message: 'Patrimônio não encontrado.' });
        }

        // Atualiza o banco de dados
        json.patrimonio = newPatrimonioList;

        fs.writeFile('db.json', JSON.stringify(json, null, 2), (err) => {
            if (err) return res.status(500).send({ message: 'Erro ao salvar no banco de dados.' });

            res.status(200).send({ message: 'Patrimônio deletado com sucesso.' });
        });
    });
});

app.listen(3000, () => {
    console.log('Servidor na porta 3000 rodando');
});