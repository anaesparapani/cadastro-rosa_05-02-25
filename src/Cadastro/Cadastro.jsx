import * as React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Person from "@mui/icons-material/Person";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import api from "../axios/axios"

function Cadastro() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    data_nascimento: "",
    cpf: ""
  });

  const onChange = (event) => {
    const{name, value} = event.target;
    setUser({...user,[name]:value})
  };

  const handleSubmit = (event) =>{
    event.preventDefault();
    cadastro();
}

async function cadastro(){ //await - ele aguarda "interpreta"
  await api.postCadastro(user).then( //then se no caso for sucesso
      (response) =>{
          alert(response.data.message) //resposta que vieram da api
      },
      (error)=>{
          console.log(error)
          alert(error.response.data.error) //resposta de erro que vieram da api
      }
  )  
}
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ margin: 1, backgroundColor: "#FF6795" }}>
          <Person />
        </Avatar>
        <Typography component="h1" variant="h5">
          Cadastre-se
        </Typography>
        <Box component="form" sx={{ marginTop: 1 }} onSubmit={handleSubmit} noValidate>
        <TextField
            required
            fullWidth
            id="name"
            label="Nome"
            name="name"
            margin="normal"
            type="name"
            value={user.name}
            onChange={onChange}
          />
          <TextField
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            margin="normal"
            value={user.email}
            onChange={onChange}
          />
          <TextField
            required
            fullWidth
            id="password"
            label="Senha"
            name="password"
            margin="normal"
            type="password"
            value={user.password}
            onChange={onChange}
          />
          <TextField
            required
            fullWidth
            id="data_nascimento"
            name="data_nascimento"
            margin="normal"
            type="date"
            value={user.data_nascimento}
            onChange={onChange}
          />
          <TextField
            required
            fullWidth
            id="cpf"
            label="CPF"
            name="cpf"
            margin="normal"
            type="number"
            value={user.cpf}
            onChange={onChange}
          />
          
          <Button
            sx={{
              marginTop: 3,
              marginBottom: 2,
              backgroundColor: "#FFAEC6",
            }}
            fullWidth
            type="submit"
            variant="contained"
          >
            Cadastrar
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
export default Cadastro;
