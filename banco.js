import sqlite3 from 'sqlite3';

const banco = new sqlite3.Database('./database.db', 
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, 
  (err) => {
    if (err) {
      console.error('Erro ao conectar:', err);
    } else {
      console.log('Conectado ao banco');
      // Ativar foreign keys se necessário
      banco.run('PRAGMA foreign_keys = ON');
    }
  }
);

// Criar tabela
banco.serialize(() => {
  banco.run(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      preco REAL NOT NULL,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Função para inserir produto CORRETAMENTE
export function inserirProduto(nome, preco) {
  return new Promise((resolve, reject) => {
    banco.run(
      'INSERT INTO produtos (nome, preco) VALUES (?, ?)',
      [nome, preco],
      function(err) {
        if (err) {
          console.error('Erro ao inserir:', err);
          reject(err);
        } else {
          console.log(`Produto inserido com ID: ${this.lastID}`);
          resolve({ id: this.lastID, nome, preco });
        }
      }
    );
  });
}

// Função para buscar produtos
export function buscarProdutos() {
  return new Promise((resolve, reject) => {
    banco.all('SELECT * FROM produtos', [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

export default banco;