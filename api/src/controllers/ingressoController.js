const connect = require("../db/connect");

module.exports = class IngressoController{
    //criação de ingresso
    static async createIngresso(req, res){
        const{preco, tipo, fk_id_evento} = req.body;

        //validação
        if(!preco || !tipo || !fk_id_evento){
            return res.status(400).json({error: "Todos os campos devem ser preenchidos!!"});
        }

        // Validação do tipo: somente 'VIP' ou 'Pista' são permitidos
        const tiposPermitidos = ['VIP', 'Pista'];
        if (!tiposPermitidos.includes(tipo)) {
            return res.status(400).json({ error: "Tipo de ingresso inválido! Apenas 'VIP' ou 'Pista' são permitidos." });
        }

        const query = `insert  into ingresso (preco, tipo, fk_id_evento)  values (?, ?, ?)`;
        const values = [preco, tipo, fk_id_evento];
        try{
            connect.query(query, values, (err) => { //arrow de flecha
                if(err){
                    console.log(err);
                    return res.status(500).json ({error: "Erro ao efetuar ingresso!!"});
                }
                return res.status(201).json({message: "Ingresso efetuado!!"});

            })
        } catch(error){
            console.log("Erro ao executar uma consulta:", error);
            return res.status(500).json({erro: "Erro interno do servidor!!"});
        } 
    } //fim do create

    //Visualizar todos os ingressos
    static async getAllIngresso(req, res){
        const query = `select * from ingresso`;
        
        try{
            connect.query(query, (err, results) => {
                if(err){
                    console.log(err);
                    return res.status(500).json({error: "Erro ao procurar ingressos!!"});
                }
                return res.status(200).json({message: "Ingressos listados!!", ingresso: results});
            })
        } catch(error){
            console.log("Erro ao executar a query:", error);
            return res.status(500).json({erro: "Erro interno do servidor!!"});
        }
    } //fim do get

    //Update do ingresso
    static async updateIngresso(req, res){
        const{id_ingresso, preco, tipo, fk_id_evento} = req.body;

        //validação 
        if(!id_ingresso || !preco || !tipo || !fk_id_evento){
            return res.status(400).json({error: "Todos os campos devem ser preenchidos!!"});
        }

        // Validação do tipo: somente 'VIP' ou 'Pista' são permitidos
        const tiposPermitidos = ['VIP', 'Pista'];
        if (!tiposPermitidos.includes(tipo)) {
            return res.status(400).json({ error: "Tipo de ingresso inválido! Apenas 'VIP' ou 'Pista' são permitidos." });
        }

        const query = `update ingresso set preco=?, tipo=?, fk_id_evento=? where id_ingresso = ?`;
        const values = [preco, tipo, fk_id_evento, id_ingresso];
        try{
            connect.query(query, values, (err, results) => { //arrow de flecha =>
                console.log("Resultados: ", results);
                if(err){
                    console.log(err);
                    return res.status(500).json ({error: "Erro ao atualizar ingresso!!"});
                }
                if(results.affectedRows === 0){
                    return res.status(404).json({error: "Ingresso não encontrado!!"});

                }
                return res.status(200).json({message: "Ingresso atualizado!!"});

            })
        } catch(error){
            console.log("Erro ao executar uma consulta:", error);
            return res.status(500).json({erro: "Erro interno do servidor!!"});
        } 
    } //fim do update

    //Exclusão dos ingressos
    static async deleteIngresso(req, res){
        const idIngresso = req.params.id;
        const query = `DELETE FROM ingresso WHERE id_ingresso = ?`

        try{
            connect.query(query, idIngresso, (err, results) => {
                if(err){
                    console.log(err);
                    return res.status(500).json({error: "Erro ao excluir ingresso!!"});
                }
                if(results.affectedRows ===0){
                    return res.status(404).json({error: "Ingresso não encontrado!!"});
                }
                return res.status(200).json({message: "Ingresso excluído!!"});
            });
        } catch(error){
            console.log("Erro ao executar a consulta!!", error);
            return res.status(500).json({error: "Erro interno do servidor"});
        }
    }
};
 