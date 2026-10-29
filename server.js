// Delivery Tracker — Exercício do Cap. 4.
// Este é o ponto de entrada. Ele deve APENAS configurar o app e montar as rotas.
// A regra de negócio fica no Service; o acesso a dados no Repository; a
// composição das dependências (injeção) fica no seu arquivo de rotas.
//
// Comece implementando as camadas em src/ (veja o README) e vá rodando o
// autograder: `npm run check` (com o servidor no ar) ou pela aba Actions no push.
import 'dotenv/config';
import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import methodOverride from 'method-override';
import session from 'express-session';
import flash from 'connect-flash';
import { criarRotas } from './src/routes/index.js';  // <- descomente quando criar as rotas
import { middlewareDeErros } from './src/middlewares/errors.middleware.js';
import { dirname, join }  from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'src', 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/base');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'segredo-dev',
  resave: false,
  saveUninitialized: false,
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.flash = {
    sucesso: req.flash('sucesso'),
    erro: req.flash('erro'),
  };
  next();
});

// Health check exigido pelo contrato de execução (não remova).
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.get('/', (req, res) => res.redirect('/entregas'));

app.use('/', criarRotas());

app.use((req, res) => res.status(404).json({ erro: 'recurso não encontrado' }));
app.use(middlewareDeErros);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Delivery Tracker rodando em http://localhost:${PORT}`));
