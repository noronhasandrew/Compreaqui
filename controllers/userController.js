const router = require("express").Router();
const { pool } = require('../middlewares/database-connection');
const authMiddleware = require("../middlewares/auth");
const Client = require('../models/client');
const Admin = require('../models/admin');
const Category = require('../models/category');
const Product = require('../models/product');
const multer = require('multer');
const fs = require('fs')
const bcrypt = require('bcryptjs');
const validate = require('../middlewares/validation');
require('dotenv').config();


//Configurando storage do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + (file.mimetype).replace('image/', '.'))
  }
})

//Multer storage
const upload  = multer({storage: storage})

router.post('/register', async (request, response) => {
    const salt = bcrypt.genSaltSync(10);
    const client = new Client(request.body)
    const errors = validate.user(client); //Erros dos inputs
  
    //Caso a validação não tenha erros, cliente é cadastrado
    if (!errors.length) {
      pool.query('INSERT INTO client (id, name, adress, email, login, password) VALUES (default, $1, $2, $3, $4, $5)', [client.getName(), client.getAdress(), client.getEmail(), client.getLogin(), bcrypt.hashSync(client.getPassword(), salt)], (error, results) => {
        if (error) {
          throw error;
        }
        response.status(201).send({result: results.rowCount});
      })
    } else { // Apresentando erros, objeto com erros é retornado
      const fields = {
        errors: errors,
        hasErros: (field) => {
          if (errors[field])
            return true;
          return false;
        }
      };

      response.status(201).send(fields)
    }
});

router.post('/admin/register', async (request, response) => {
  const salt = bcrypt.genSaltSync(10);
  const admin = new Admin(request.body)
  const errors = validate.user(admin); //Erros dos inputs

  //Caso a validação não tenha erros, cliente é cadastrado
  if (!errors.length) {
    pool.query('INSERT INTO administrator (id, name, email, login, password) VALUES (default, $1, $2, $3, $4)', [admin.getName(), admin.getEmail(), admin.getLogin(), bcrypt.hashSync(admin.getPassword(), salt)], (error, results) => {
      if (error) {
        console.log(error)
        throw error;
      }
      response.status(201).send({result: results.rowCount});
    })
  } else { // Apresentando erros, objeto com erros é retornado
    const fields = {
      errors: errors,
      hasErros: (field) => {
        if (errors[field])
          return true;
        return false;
      }
    };

    response.status(201).send(fields)
  }
});


router.post('/login', async (req, res) => {
  const { login, password } = req.body;

    try {
      pool.query('SELECT * from client WHERE login = $1', [login], (err, result) => {
        if (err)
          throw err;
        try {
          checkResult(result);
        } catch(e) {
          return res.status(201).json({ result: "Usuário não encontrado" });
        }
      })
    } catch(err) {
      return res.status(400).json({ error: "Falha ao buscar usuário" });
    }

    const checkResult = (result) => {
      if (result.rowCount) {
        const checkPassword = bcrypt.compareSync(password, result.rows[0].password);
        if (checkPassword) {
          const user = new Client(result.rows[0]);
          try {
            return res.status(200).json({ user, token: user.generateToken() });
          } catch(err) {
            console.log(err)
          }
        } else {
          return res.status(201).json({ result: 'Senha inválida' });
        }
      } else {
        return res.status(201).json({ result: 'Usuário não encontrado' });
      }
    }
});

router.post('/admin/login', async (req, res) => {
  const { login, password } = req.body;

  try {
    pool.query('SELECT * from administrator WHERE login = $1', [login], (err, result) => {
      if (err)
        throw err;
      try {
        checkResult(result);
      } catch(e) {
        return res.status(201).json({ result: "Administrador não encontrado" });
      }
    });
  } catch(err) {
    return res.status(400).json({ error: "Falha ao buscar administrador" });
  }

  const checkResult = (result) => {
    if (result.rowCount) {
      const checkPassword = bcrypt.compareSync(password, result.rows[0].password);
      if (checkPassword) {
        const user = new Admin(result.rows[0]);
        try {
          return res.status(200).json({ user, token: user.generateToken() });
        } catch(err) {
          console.log(err)
        }
      } else {
        return res.status(201).json({ result: 'Senha inválida' });
      }
    } else {
      return res.status(201).json({ result: 'Administrador não encontrado' });
    }
  }
});

//Cadastra novo produto
router.post('/admin/product', upload.single('file'), (req, res) => {
  const obj = () => {
    return { photo: {...req.file}, ...req.body }
  }
  if (!req.file)
    return res.status(201).json({ error: "Adicione uma imagem ao seu produto" });

  const product = new Product(obj())
  console.log(product)
  try {
    pool.query('INSERT INTO product (id, name, description, amount, price, photo) VALUES (default, $1, $2, $3, $4, $5)', [product.getName(), product.getDescription(), product.getAmount(), product.getPrice(), product.getPhoto()], (err, result) => {
      if (err)
        throw err
      res.status(201).send({result: result.rowCount});
    })
  } catch(err) {
      console.log(err)
      res.status(400).json({ error: "Falha ao cadastrar produto" });
  }
})

//Retorna um produto de acordo com o id fornecido
router.get('/admin/product/:id', (req, res) => {
  const { id } = req.params
  try {
    pool.query('SELECT * FROM product WHERE id=$1', [ id ], (err, result) => {
      if (err)
        throw err

      //Transforma arquivo para base64
      const base64_encode = (file) => {
        const bitmap = fs.readFileSync(file)
        return new Buffer.from(bitmap).toString('base64')
      }

      //Transformando arquivo para base64
      const productImg = result.rows[0].photo
      result.rows[0].photo = base64_encode('./uploads/' + productImg)
      console.log(result.rows[0])
      
      res.status(201).send(result.rows[0]);
    })
  } catch(err) {
      console.log(err)
      res.status(400).json({ error: "Falha ao cadastrar produto" });
  }
})

//A partir deste ponto para baixo, o usuário precisa fornecer um token válido para realizar qualquer das operações
router.use(authMiddleware);

router.get("/admin/auth", async (req, res) => {
  try {
    const { isAdmin } = req;
    if (isAdmin) {
      return res.json({ result: true });
    } else {
      return res.json({ result: false });
    }
  } catch (err) {
    return res.status(400).json({ error: "Não foi possível retornar resultado" });
  }
});

module.exports = router;
