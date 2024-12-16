import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
    const { method, body, query } = req;

    if (method === 'GET') {
        const { data, error } = await supabase.from('users').select('*');
        if (error) return res.status(500).json({ error: error.message });
        res.status(200).json(data);
    } else if (method === 'POST') {
        const { name } = body;
        const { data, error } = await supabase.from('users').insert({ name });
        if (error) return res.status(500).json({ error: error.message });
        res.status(201).json(data);
    } else if (method === 'PUT') {
        const { id, name } = body;
        const { error } = await supabase.from('users').update({ name }).eq('id', id);
        if (error) return res.status(500).json({ error: error.message });
        res.status(200).send('User updated');
    } else if (method === 'DELETE') {
        const { id } = query;
        const { error } = await supabase.from('users').delete().eq('id', id);
        if (error) return res.status(500).json({ error: error.message });
        res.status(200).send('User deleted');
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
