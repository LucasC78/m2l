const mariadb = require('mariadb')
const express = require('express')
const app = express();
const axios = require('axios');
let cors = require('cors');
const bcrypt = require('bcrypt');

require('dotenv').config()

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    database: process.env.DB_DTB,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    connectionLimit: 100,
})

app.use(express.json())
app.use(cors())

// Formulaire de connexion

const bodyParser = require('body-parser');
app.use(bodyParser.json());

  app.post('/Connexion', async (req, res) => {
    conn = await pool.getConnection();
    const { email, password } = req.body;
    const query = `SELECT * FROM users WHERE email = '${email}'`;
    const login = await conn.query(query);
      if (login.length === 0) {
        console.log('c pas bon1')
        return res.status(401).json({ message: 'Invalid email ' });
      }
      const match = await bcrypt.compare(password, login[0].password);
      if (!match) {
        console.log('c pas bon2')
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      console.log('c bon')
      const indentifiant = {'id':login[0].id,'email':login[0].email, 'statut':login[0].statut}
      res.status(200).json(indentifiant);
    });
  
// Pour telecharger l'image des produits dans un dossier


const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/Dev/web/cours/AP3/m2l/m2l/src/img'); // remplacer le chemain de fichier par le sien
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const fileName =
      path.basename(file.originalname, extension);
    cb(null, fileName + extension);
  },
});

const upload = multer({ storage: storage });

app.post('/api/download', upload.single('file'), (req, res) => {
  try {
    res.send('Le fichier a été téléchargé avec succès');
  } catch (error) {
    console.error(error);
    res.status(500).send('Une erreur est survenue lors du téléchargement du fichier');
  }
});


// Requete pour la création d'un compte utilisateur

app.post('/addusers', async (req, res) => {
    let conn;

      try {
        // Vérifier si l'adresse e-mail existe déjà dans la base de données
        conn = await pool.getConnection();
        let [rows2] = await conn.query('SELECT COUNT(*) AS count FROM users WHERE email = ?', [req.body.email]);
        
        let rows3 = Number(rows2['count']); // transforme le résultat en nombre

        console.log(rows3); // affiche uniquement le chiffre zéro
        if (rows3 == 0) {
          
          const hash = await bcrypt.hash(req.body.password, 10);
          const requete = 'INSERT INTO users (pseudo, email, password, statut) VALUES (?, ?, ?, 0);';
          const insertResult = await conn.query(requete, [req.body.pseudo, req.body.email, hash]);
          res.status(200).json(insertResult.affectedRows); 
          console.log("le compte a bien été créé");
        //   return res.status(400).json({ error: 'Cette adresse e-mail est déjà utilisée' });
        } else {
            // L'adresse e-mail existe déjà dans la base de données, renvoyer une réponse d'erreur
            console.log("Cette adresse e-mail est déjà utilisée");
            return res.status(400).json({ error: 'Cette adresse e-mail est déjà utilisée' });    
             
        }

    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Une erreur est survenue lors de la création du compte utilisateur' });
    } finally {
      if (conn) {
        conn.release();
      }
    }
  });

// Pour envoyé une requête au support sur le formualire de la page contacte

app.post('/support', async (req, res) => {
    let conn;
        console.log("poste")
    try {
        console.log("lancement de la connexion")
        conn = await pool.getConnection();
        console.log("lancement de la requete insert")
        console.log(req.body);
        let requete = 'INSERT INTO support (name, email, phone, message) VALUES (?, ?, ?, ?);'
        let rows = await conn.query(requete, [req.body.name, req.body.email, req.body.phone, req.body.message]);
        console.log(rows);
        res.status(200).json(rows.affectedRows)
    }
    catch (err) {
        console.log(err);
    }
})

//MODIFICATION D'ARTICLES

// Formulaire admin pour ajouté des articles

app.post('/articles', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();     
        console.log(req.body);
        let requete = 'INSERT INTO articles (name, prix, image, quantite) VALUES (?, ?, ?, ?);'
        let rows = await conn.query(requete, [req.body.name, req.body.prix, req.body.image, req.body.quantite]);
        console.log(rows);
        res.status(200).json(rows.affectedRows)
    }
    catch (err) {
        console.log(err);
    }
})

// afficher les articles

app.get('/articles', async (req, res) => {
  let conn;
  try {
      conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM articles');
      res.status(200).json(rows)
  }
  catch (err) {
      console.log(err);
  }
})

// afficher l'article en fonction de l'id

app.get('/articles/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  let conn;
  try {
      console.log("lancement de la connexion")
      conn = await pool.getConnection();
      console.log("lancement de la requete select")
      const rows = await conn.query('SELECT * FROM articles WHERE id = ?', [id]);
      res.status(200).json(rows)
  }
  catch (err) {
      console.log(err);
  }
})

// modifier un article

app.put('/articles/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    let conn;
    try {
        conn = await pool.getConnection();
        let requete = 'UPDATE articles SET name = ?, prix = ?, image = ?, quantite = ? WHERE id = ?;'
        let rows = await conn.query(requete, [req.body.name, req.body.prix, req.body.image, req.body.quantite, id]);
        console.log(rows);
        res.status(200).json(rows.affectedRows)
    }
    catch (err) {
        console.log(err);
    }
})

// supprimer un article

app.delete('/articles/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    let conn;
    try {
        console.log("lancement de la supression")
        conn = await pool.getConnection();
        console.log("supression en cours")
        const id = parseInt(req.params.id);
        const rows = await conn.query("DELETE FROM articles WHERE id = ?", [id]);
        res.status(200).json(rows.affectedRows)
    }
    catch (err) {
        console.log(err);
    }
})

//MODIFICATION USERS

// afficher les utilisateurs

app.get('/users', async (req, res) => {
  let conn;
  try {
      conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM users');
      res.status(200).json(rows)
  }
  catch (err) {
      console.log(err);
  }
})

// afficher les utilisateurs en fonction de l'id

app.get('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  let conn;
  try {
      console.log("lancement de la connexion")
      conn = await pool.getConnection();
      console.log("lancement de la requete select")
      const rows = await conn.query('SELECT * FROM users WHERE id = ?', [id]);
      res.status(200).json(rows)
  }
  catch (err) {
      console.log(err);
  }
})

// modifier un utilisateur

app.put('/users/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    let conn;
    try {
        conn = await pool.getConnection();
        let requete = 'UPDATE users SET pseudo = ?, email = ?, password = ?  WHERE id = ?;'
        let rows = await conn.query(requete, [req.body.pseudo, req.body.email, req.body.password, id]);
        console.log(rows);
        res.status(200).json(rows.affectedRows)
    }
    catch (err) {
        console.log(err);
    }
})

// supprimer un utilisateurs

app.delete('/users/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    let conn;
    try {
        console.log("lancement de la supression")
        conn = await pool.getConnection();
        console.log("supression en cours")
        const id = parseInt(req.params.id);
        const rows = await conn.query("DELETE FROM users WHERE id = ?", [id]);
        res.status(200).json(rows.affectedRows)
    }
    catch (err) {
        console.log(err);
    }
})

app.listen(8000, () => { // ouverture du serveur sur le port 8000
    console.log("Serveur à l'écoute") // afficher un message dans la console.
})