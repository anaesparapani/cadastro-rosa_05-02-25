const connect = require("../db/connect");

module.exports = class userController {
  static async createUser(req, res) {
    const { cpf, email, password, name, data_nascimento } = req.body;

    if (!cpf || !email || !password || !name || !data_nascimento) {
      return res.status(400).json({ error: "Todos os campos devem ser preenchidos" });
    } else if (isNaN(cpf) || cpf.length !== 11) {
      return res.status(400).json({
        error: "CPF inválido. Deve conter exatamente 11 dígitos numéricos",
      });
    } else if (!email.includes("@")) {
      return res.status(400).json({ error: "Email inválido. Deve conter @" });
    } else {
      // Construção da query INSERT
      const query = `INSERT INTO usuario (cpf, password, email, name, data_nascimento) VALUES('${cpf}', '${password}', '${email}', '${name}', '${data_nascimento}')`;

      //Executando a query criada
      try {
        connect.query(query, function (err) {
          if (err) {
            console.log(err);
            console.log(err.code);
            if (err.code === "ER_DUP_ENTRY") {
              return res.status(400).json({ error: "O email ja esta vinculado a outro usuario" });
            } else {
              return res.status(500).json({ error: "Erro interno do servidor" });
            }
          } else {
            return res.status(201).json({ message: "Usuário criado com sucesso" });
          }
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
      }
    }
  }

  static postLogin(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const user = user.find(
      (user) => user.email === email && user.password === password
    );
    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    return res.status(200).json({ message: "Login realizado com sucesso", user });
  }

  static async getAllUsers(req, res) {
    const query = `SELECT * FROM usuario`; //busca e mostra a tabela usuario

    try {
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno no servidor" });
        } //chama a const connect, vai receber a query e a função
        return res.status(200).json({ message: "Lista de usuarios", users:results }); //passa os resultados pra users
      });
    } catch (error) {
      console.error("Erro ao executar consulta:", error);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }

  }

  static async getUserById(req, res) {
    const userId = req.params.cpf;
    const user = users.find((user) => user.cpf === userId);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
  }

  static async updateUser(req, res) {
    const { cpf, email, password, name, data_nascimento } = req.body;

    if (!cpf || !email || !password || !name || !data_nascimento) {
      return res.status(400).json({ error: "Todos os campos devem ser preenchidos" });
    }
    const query = `UPDATE usuario SET nome=?,email=?,senha=?,cpf=? WHERE id_usuario = ?`;
    const values = [name, email, password, cpf];
    const userIndex = users.findIndex((user) => user.cpf === cpf);
    

    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res
              .status(400)
              .json({ error: "Email já cadastrado por outro usuario" });
          } else {
            console.error(err);
            return res.status(500).json({ error: "Erro interno do servidor" });
          }
        }
        if (results.affectedRows === 0) {
          return res.status(400).json({ error: "Usuario não encontrado" });
        }
        return res.status(200).json({ message: "Usuario atualizado com sucesso" });
      });
    } catch (error) {
      console.error("Erro ao executar consulta", error);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  }

  static async deleteUser(req, res) {
    const userId = req.params.cpf;
    const query = `DELETE FROM usuario WHERE id_usuario = ?`;
    const values = [userId]

    try{
      connect.query(query,values,function(err,results){
        if(err){
          console.error(err);
          return res.status(500).json({error:"Erro interno no servidor"})
        }
        if(results.affectedRows === 0){
          return res.status(404).json({error:"Usuario não encontrado"})
        }

        return res.status(200).json({message:"Usuario excluído com sucesso"})
      })
    }catch(error){
      console.error(error);
      return res.status(500).json({error:"Erro interno do servidor"})
  }
}

//Método de Login - implementar
static async loginUser(req, res){
  const {email, password} = req.body

  if(!email||!password){
    return res.status(400).json({error:"Email e senha são obrigatórios"})
}
  const query = `SELECT * from usuario WHERE email = ?`

  try{
    connect.query(query, [email],(err,results)=>{
      if(err){
        console.log(err);
        return res.status(500).json({error: "Erro interno no servidor"})
      }
      if(results.length===0){
        return res.status(401).json({error:"Usuário não encontrado"})
      }
      const user = results[0];

      if(user.password !== password){
        return res.status(403).json({error:"Senha incorreta"})
      }

      return res.status(200).json({message:"Login bem sucedido", user})

    })
  } catch (error){
    console.log(error);
    return res.status(500).json({error:"Erro interno no servidor"})
  }
    }

    //Método de Login - implementar
static async cadastroUser(req, res){
  const {email, password, cpf, name, data_nascimento} = req.body

  if(!cpf || !email || !password || !name || !data_nascimento){
    return res.status(400).json({error:"Email e senha são obrigatórios"})
}
  const query = `SELECT * from usuario WHERE email = ?`

  try{
    connect.query(query, [email],(err,results)=>{
      if(err){
        console.log(err);
        return res.status(500).json({error: "Erro interno no servidor"})
      }
      if(results.length===0){
        return res.status(401).json({error:"Usuário não encontrado"})
      }
      const user = results[0];

      if(user.password !== password){
        return res.status(403).json({error:"Senha incorreta"})
      }

      return res.status(200).json({message:"Cadastro bem sucedido", user})

    })
  } catch (error){
    console.log(error);
    return res.status(500).json({error:"Erro interno no servidor"})
  }
    }
};

