const connect = require("../db/connect");
const { getAllOrganizadores } = require("./organizadorController");

module.exports = class eventoController {
    //criação de um evento
    static async createEvento(req, res){
        const{nome, descricao, data_hora, local, fk_id_organizador} = req.body;

        //validação genérica de todos os atributos
        if(!nome || !descricao || !data_hora || !local || !fk_id_organizador){
            return res.status(400).json({error: "Todos os campos devem ser preenchidos!!"});
        }

        const query = `insert  into evento (nome, descricao, data_hora, local, fk_id_organizador)  values (?, ?, ?, ?, ?)`;
        const values = [nome, descricao, data_hora, local, fk_id_organizador];
        try{
            connect.query(query, values, (err) => { //arrow de flecha
                if(err){
                    console.log(err);
                    return res.status(500).json ({error: "Erro ao criar evento!!"});
                }
                return res.status(201).json({message: "Evento criado com sucesso!!"});

            })
        } catch(error){
            console.log("Erro ao executar uma consulta:", error);
            return res.status(500).json({erro: "Erro interno do servidor!!"});
        } 
    } //fim do create

    //Visualizar todos os eventos cadastrados
    static async getAllEventos(req, res){
        const query = `select * from evento`;
        
        try{
            connect.query(query, (err, results) => {
                if(err){
                    console.log(err);
                    return res.status(500).json({error: "Erro ao buscar eventos!!"});
                }
                return res.status(200).json({message: "Eventos listados com sucesso!!", events: results});
            })
        } catch(error){
            console.log("Erro ao executar a query:", error);
            return res.status(500).json({erro: "Erro interno do servidor!!"});
        }
    }

    //Update de um evento
    static async updateEvento(req, res){
        const{id_evento, nome, descricao, data_hora, local, fk_id_organizador} = req.body;

        //validação genérica de todos os atributos
        if(!id_evento || !nome || !descricao || !data_hora || !local || !fk_id_organizador){
            return res.status(400).json({error: "Todos os campos devem ser preenchidos!!"});
        }

        const query = `update evento set nome=?, descricao=?, data_hora=?, local=?, fk_id_organizador=? where id_evento = ?`;
        const values = [nome, descricao, data_hora, local, fk_id_organizador, id_evento];
        try{
            connect.query(query, values, (err, results) => { //arrow de flecha =>
                console.log("Resultados: ", results);
                if(err){
                    console.log(err);
                    return res.status(500).json ({error: "Erro ao atualizar evento!!"});
                }
                if(results.affectedRows === 0){
                    return res.status(404).json({error: "Evento não encontrado!!"});

                }
                return res.status(200).json({message: "Evento atualizado com sucesso!!"});

            })
        } catch(error){
            console.log("Erro ao executar uma consulta:", error);
            return res.status(500).json({erro: "Erro interno do servidor!!"});
        } 
    } //fim do update

    //Exclusão de eventos
    static async deleteEvento(req, res){
        const idEvento = req.params.id;
        const query = `DELETE FROM evento WHERE id_evento = ?`

        try{
            connect.query(query, idEvento, (err, results) => {
                if(err){
                    console.log(err);
                    return res.status(500).json({error: "Erro ao excluir evento!!"});
                }
                if(results.affectedRows ===0){
                    return res.status(404).json({error: "Evento não encontrado!!"});
                }
                return res.status(200).json({message: "Evento excluído com sucesso!!"});
            });
        } catch(error){
            console.log("Erro ao executar a consulta!!", error);
            return res.status(500).json({error: "Erro interno do servidor"});
        }
    }

    static async getEventosPorData(req, res){
        const query = `SELECT * from evento`

        try{
            connect.query(query,(err, results) =>{
                if(err){
                    console.error(err);
                    return res.status(500).json({error: "Erro ao buscar eventos"})
                }
                const dataEvento = new Date(results[0].data_hora)
                const dia = dataEvento.getDate()
                const mes = dataEvento.getMonth() +1
                const ano = dataEvento.getFullYear()
                console.log(dia+'/'+mes+'/'+ano)

                const now = new Date() //pega a data atual
                const eventosPassados = results.filter(evento => new Date(evento.data_hora)<now) //metodo de filtragem de array
                const eventosFuturos = results.filter(evento => new Date(evento.data_hora)>=now) //metodo de filtragem de array

                const diferencaMs = eventosFuturos[0].data_hora.getTime() - now.getTime(); //milisegundos
                const dias = Math.floor(diferencaMs/(1000*60*60*24)); //60 segundos - 60 minutos - 24 horas
                const horas = Math.floor((diferencaMs%(1000*60*60*24))/(1000*60*60)); //por horas
                console.log(diferencaMs, 'Falta:'+dias+ 'dias,'+horas+ 'horas');

                //comparando datas
                const dataFiltro = new Date('2024-12-15').toISOString().split("T"); //tira o T da data
                const eventosDia = results.filter(evento => new Date (evento.data_hora).toISOString().split("T")[0] === dataFiltro[0]);

                console.log("Eventos: ", eventosDia);

                return res.status(200).json({message:'OK',eventosPassados,eventosFuturos})
            })
        }
        catch(error){
            console.error(error);
            return res.status(500).json({error: "Erro ao buscar eventos"})
        
        }
    }

    static async getEventosNosProximos7Dias(req, res) {
        // Recebe a data inicial como parâmetro da query string
        const { data_inicial } = req.query;
    
        const dataInicial = new Date(data_inicial);
        
        // Verifica se a data fornecida é válida
        if (isNaN(dataInicial.getTime())) {
            return res.status(400).json({ error: "Data inválida." });
        }
    
        // Calculando a data final (7 dias após a data inicial)
        const dataFinal = new Date(dataInicial);
        dataFinal.setDate(dataInicial.getDate() + 7); // Adiciona 7 dias à data inicial
    
        // Query para buscar eventos entre a data inicial e a data final (próximos 7 dias)
        const query = `SELECT * FROM evento`;
    
        try {
            connect.query(query, (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: "Erro ao buscar as datas." });
                }
    
                // Caso contrário, retorna os eventos encontrados
                return res.status(200).json({
                    message: "Eventos encontrados com sucesso.",eventos: results});
            });
        } catch (error) {
            console.error("Erro ao executar a consulta:", error);
            return res.status(500).json({ error: "Erro interno ao buscar eventos." });
        }
    }
    
}


        

    
            
    


