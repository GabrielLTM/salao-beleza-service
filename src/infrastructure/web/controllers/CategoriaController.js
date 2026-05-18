import { Resultado } from '../helpers/Resultado.js';

export class CategoriaController {
  /** @param {{ categoriaService: import('../../../application/services/CategoriaService.js').CategoriaService }} deps */
  constructor({ categoriaService }) {
    this.service = categoriaService;
  }

  index = async (req, res, next) => {
    try { return res.json(Resultado.ok(await this.service.listar(req.paginacao))); }
    catch (e) { return next(e); }
  };

  show = async (req, res, next) => {
    try { return res.json(Resultado.ok(await this.service.buscarPorId(req.params.id))); }
    catch (e) { return next(e); }
  };

  store = async (req, res, next) => {
    try { return res.status(201).json(Resultado.ok(await this.service.criar(req.body), 'Categoria criada com sucesso.')); }
    catch (e) { return next(e); }
  };

  update = async (req, res, next) => {
    try { return res.json(Resultado.ok(await this.service.editar(req.params.id, req.body), 'Categoria atualizada com sucesso.')); }
    catch (e) { return next(e); }
  };

  destroy = async (req, res, next) => {
    try { await this.service.excluir(req.params.id); return res.json(Resultado.ok(null, 'Categoria excluida com sucesso.')); }
    catch (e) { return next(e); }
  };
}
