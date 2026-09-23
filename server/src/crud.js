import { Router } from 'express';
import { supabase } from './supabase.js';

const wrap = (fn) => (req, res, next) => fn(req, res).catch(next);

export function crud(table, fields, { order, ascending = true, create = true }) {
  const router = Router();
  const pick = (body = {}) => Object.fromEntries(fields.filter((f) => f in body).map((f) => [f, body[f]]));

  router.get('/', wrap(async (req, res) => {
    const { data, error } = await supabase.from(table).select('*').order(order, { ascending });
    if (error) throw error;
    res.json(data);
  }));

  if (create) {
    router.post('/', wrap(async (req, res) => {
      const { data, error } = await supabase.from(table).insert(pick(req.body)).select().single();
      if (error) throw error;
      res.status(201).json(data);
    }));
  }

  router.put('/:id', wrap(async (req, res) => {
    const { data, error } = await supabase.from(table).update(pick(req.body)).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json(data);
  }));

  router.delete('/:id', wrap(async (req, res) => {
    const { error } = await supabase.from(table).delete().eq('id', req.params.id);
    if (error) throw error;
    res.status(204).end();
  }));

  return router;
}
