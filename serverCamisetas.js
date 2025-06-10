const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');  
const app = express();
app.use(cors());
app.use(express.json());

// Servir a pasta 'public' como estática (se houver arquivos estáticos)
app.use(express.static(path.join(__dirname, 'public')));

// POST - Rota para Adicionar Aluno
app.post('/alunos', (req, res) => {
    const { cpf, nome, tamanho, pagamento } = req.body;

    // Lê os dados existentes do banco
    fs.readFile('db.json', (err, data) => {
        if (err) return res.status(500).send({ message: 'Erro ao ler o banco de dados.' });

        const json = JSON.parse(data);
        // Obtém o maior ID existente
        const maxId = json.alunos.reduce((max, p) => Math.max(max, p.id), 0);
        const newId = maxId + 1; // Próximo ID

        const newAluno = { id: newId, cpf, nome, tamanho, pagamento };

        // Adiciona o novo aluno
        json.alunos.push(newAluno);

        // Salva as alterações no banco de dados
        fs.writeFile('db.json', JSON.stringify(json, null, 2), (err) => {
            if (err) return res.status(500).send({ message: 'Erro ao salvar no banco de dados.' });

            res.status(200).send({ message: 'Aluno cadastrado com sucesso!', aluno: newAluno });
        });
    });
});

/* GET */
// Rota para obter todos os alunos
app.get('/alunos', (req, res) => {
    fs.readFile('db.json', (err, data) => {
        if (err) return res.status(500).send({ message: 'Erro ao ler o banco de dados.' });

        const json = JSON.parse(data);
        res.status(200).send(json.alunos);
    });
});

// GET - Rota para obter o estoque
app.get('/estoque', (req, res) => {
    fs.readFile('db.json', (err, data) => {
        if (err) return res.status(500).send({ message: 'Erro ao ler o banco de dados.' });

        const json = JSON.parse(data);
        // Supondo que o estoque está armazenado na chave 'estoque' em db.json
        res.status(200).send(json.estoque);
    });
});

// Atualizar o estoque
app.put('/estoque', (req, res) => {
    const novoEstoque = req.body;

    fs.readFile('db.json', (err, data) => {
        if (err) return res.status(500).send({ message: 'Erro ao ler o banco de dados.' });

        const json = JSON.parse(data);
        json.estoque = novoEstoque;

        fs.writeFile('db.json', JSON.stringify(json, null, 2), (err) => {
            if (err) return res.status(500).send({ message: 'Erro ao salvar o estoque.' });

            res.status(200).send({ message: 'Estoque atualizado com sucesso!' });
        });
    });
});

/* DELETE */
// Rota para deletar um aluno por ID
app.delete('/alunos/:id', (req, res) => {
    const id = parseInt(req.params.id);

    fs.readFile('db.json', (err, data) => {
        if (err) return res.status(500).send({ message: 'Erro ao ler o banco de dados.' });

        const json = JSON.parse(data);
        // Filtra os alunos para remover o que tem o ID correspondente
        const newAlunoList = json.alunos.filter(p => p.id !== id);

        // Verifica se algum aluno foi removido
        if (newAlunoList.length === json.alunos.length) {
            return res.status(404).send({ message: 'Aluno não encontrado.' });
        }

        // Atualiza o banco de dados
        json.alunos = newAlunoList;

        fs.writeFile('db.json', JSON.stringify(json, null, 2), (err) => {
            if (err) return res.status(500).send({ message: 'Erro ao salvar no banco de dados.' });

            res.status(200).send({ message: 'Aluno deletado com sucesso.' });
        });
    });
});

app.listen(3002, () => {
    console.log('Servidor na porta 3002 rodando');
});
