export class EntregasController {
    constructor(entregasService) {
        this.entregasService = entregasService;
    }

    criar(req, res, next) {
        const { descricao, origem, destino } = req.body;
        try {
            const entrega = this.entregasService.criar(descricao, origem, destino);
            res.status(201).json(entrega);
        } catch (error) {
            next(error);
        }
    }
}