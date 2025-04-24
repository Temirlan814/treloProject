import { rest } from 'msw';

const boardsMock = [
    {
        id: 'board-1',
        title: 'Проект 1',
        columns: [
            {
                id: 'col-1',
                title: 'To Do',
                tasks: [{ id: 'task-1', title: 'Задача 1' }],
            },
        ],
    },
    {
        id: 'board-2',
        title: 'Проект 2',
        columns: [
            {
                id: 'col-2',
                title: 'In Progress',
                tasks: [{ id: 'task-2', title: 'Задача 2' }],
            },
        ],
    },
];

export const handlers = [
    rest.get('/api/boards', (_, res, ctx) => {
        console.log('📢 Mock API: GET /api/boards вызван!');
        return res(ctx.json(boardsMock));
    }),

    rest.post('/api/boards', async (req, res, ctx) => {
        const { title } = await req.json();
        const newBoard = { id: `board-${Date.now()}`, title, columns: [] };
        boardsMock.push(newBoard);
        console.log('📢 Mock API: POST /api/boards', newBoard);
        return res(ctx.status(201), ctx.json(newBoard));
    }),

    rest.delete('/api/boards/:id', (req, res, ctx) => {
        const { id } = req.params;
        console.log(`📢 Mock API: DELETE /api/boards/${id}`);
        const index = boardsMock.findIndex((b) => b.id === id);
        if (index !== -1) {
            boardsMock.splice(index, 1);
            console.log(`✅ Доска ${id} удалена`);
            return res(ctx.status(200));
        }
        console.log(`❌ Доска ${id} не найдена`);
        return res(ctx.status(404), ctx.json({ error: 'Board not found' }));
    }),
];
