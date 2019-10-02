const router = require("express").Router();
const { pool } = require('../middlewares/database-connection');
const authMiddleware = require("../middlewares/auth");
const Client = require('../models/client');
const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const validate = require('../middlewares/validation');
require('dotenv').config();

const User = {
  "name": "teste03",
  "adress": "Rua X",
  "email": "andrew@gmail.com",
  "login": "andrew05",
  "password": "1234995678"
};

/*router.post ("/login", async (request, response) => {
    try {
      response.json({user, token: user.generateToken()});
    } catch(err) {
    console.log(err)
    }
  });*/

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
  
      if (fields.hasErros('password')) {
        console.log(fields.errors['password']);
      } else {
        console.log('Não possui erros');
      }
  
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

    if (fields.hasErros('password')) {
      console.log(fields.errors['password']);
    } else {
      console.log('Não possui erros');
    }

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
          checkResult(result, password);
        } catch(e) {
          return res.status(400).json({ error: "Usuário não encontrado" });
        }
      })
    } catch(err) {
      console.log(err);
    }

    const checkResult = (result, password) => {
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
          return res.status(400).json({ error: 'Senha inválida' });
        }
      } else {
        throw new Error('Admin não encontrado');
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
        return res.status(400).json({ error: "Administrador não encontrado" });
      }
    });
  } catch(err) {
    console.log(err);
  }

  const checkResult = (result, password) => {
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
        return res.status(400).json({ error: 'Senha inválida' });
      }
    } else {
      throw new Error('Admin não encontrado');
    }
  }
  
});

router.post ("/logout", async (req, res) => {

});

router.use(authMiddleware);

router.get("/conta", async (req, res) => {
  
  console.log(req.headers.authorization)
  process.env.BLACK_LIST.push();

  try {
    const { isAdmin } = req;
    if (isAdmin) {
      return res.json({ user });
    } else {
      return res.json( { error: "Você não é um administrador" } );
    }
  } catch (err) {
    return res.status(400).json({ error: "Não foi possível retornar usuário" });
  }
});

module.exports = router;
