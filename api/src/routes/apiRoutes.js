const router = require('express').Router();
const userController = require('../controllers/userController');
const organizadorController = require('../controllers/organizadorController');
const eventoController = require('../controllers/eventoController');
const IngressoController = require('../controllers/ingressoController');

//rotas userController
 router.post('/user', userController.createUser);
 router.get('/user', userController.getAllUsers);
// router.post('/user/login', userController.postLogin); 
// router.get('/user/:cpf', userController.getUserById);
 router.put('/user/', userController.updateUser);
 router.delete('/user/:cpf', userController.deleteUser);
 router.post('/login', userController.loginUser);
 //router.post('/cadastro', userController.cadastroUser);

 //rotas organizadorController
router.post('/organizador', organizadorController.createOrganizador);
router.get('/organizador', organizadorController.getAllOrganizadores);
// router.get('/organizador/:id', organizadorController.getOrganizadorById);
router.put('/organizador', organizadorController.updateOrganizador);
router.delete('/organizador/:id', organizadorController.deleteOrganizador);

//rotas eventoController
router.post('/evento', eventoController.createEvento);
router.get('/evento', eventoController.getAllEventos);
router.put('/evento', eventoController.updateEvento);
router.delete('/evento/:id', eventoController.deleteEvento);
router.get('/evento/data', eventoController.getEventosPorData); //rota do getEventosPorData

//rotas ingressoController
router.post('/ingresso', IngressoController.createIngresso);
router.get('/ingresso', IngressoController.getAllIngresso);
router.put('/ingresso', IngressoController.updateIngresso);
router.delete('/ingresso/:id', IngressoController.deleteIngresso);
router.get('/eventos/dia', eventoController.getEventosNosProximos7Dias);
module.exports = router;
