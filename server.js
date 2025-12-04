import express from "express";
import db from './banco.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Rota GET - Listar produtos
app.get('/produtos', (req, res) => {
  try {
    const produtos = db.prepare('SELECT * FROM produtos').all();
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota POST - Criar produto
app.post('/produtos', (req, res) => {
  const { nome, preco } = req.body;
  
  if (!nome || preco === undefined) {
    return res.status(400).json({ error: 'Nome e preço são obrigatórios' });
  }
  
  try {
    const result = db.prepare('INSERT INTO produtos (nome, preco) VALUES (?, ?)').run(nome, preco);
    res.status(201).json({ 
      id: result.lastInsertRowid, 
      nome, 
      preco 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota PUT - Atualizar produto
app.put('/produtos/:id', (req, res) => {
  const { id } = req.params;
  const { nome, preco } = req.body;
  
  if (!nome || preco === undefined) {
    return res.status(400).json({ error: 'Nome e preço são obrigatórios' });
  }
  
  try {
    const result = db.prepare('UPDATE produtos SET nome = ?, preco = ? WHERE id = ?').run(nome, preco, id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    res.json({ updated: result.changes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota DELETE - Remover produto
app.delete('/produtos/:id', (req, res) => {
  const { id } = req.params;
  
  try {
    const result = db.prepare('DELETE FROM produtos WHERE id = ?').run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    res.json({ deleted: result.changes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});