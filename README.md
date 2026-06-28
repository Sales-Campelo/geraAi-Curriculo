# GeraAI Currículo

Plataforma SaaS de análise de vagas, entrevista inteligente, geração de currículo
otimizado para ATS e plano de desenvolvimento profissional.

## Stack

- **Frontend:** React + Vite, React Router, Axios, React Hook Form, Framer Motion, React Icons
- **Backend:** Django + Django REST Framework
- **Banco:** PostgreSQL
- **IA:** API
- **Infra:** Docker + Docker Compose

## Estrutura

```
geraai-curriculo/
├── backend/
│   ├── apps/
│   │   ├── jobs/          # análise de vaga (POST /api/jobs/analyze/)
│   │   ├── interviews/    # entrevista inteligente
│   │   ├── resumes/       # geração de currículo + compatibilidade
│   │   ├── careerplan/    # plano de desenvolvimento
│   │   ├── feedback/      # avaliações dos usuários
│   │   └── statistics/    # dados do dashboard administrativo
│   ├── services/          # única camada que fala com o Gemini
│   │   ├── gemini_service.py
│   │   ├── analysis_service.py
│   │   ├── interview_service.py
│   │   ├── resume_service.py
│   │   └── careerplan_service.py
│   └── config/             # settings, urls, wsgi/asgi
└── frontend/
    └── src/
        ├── pages/          # HomePage, InterviewPage, ResultPage, ResumePage,
        │                   # CareerPlanPage, AdminDashboardPage
        ├── components/     # Header, ProgressBar, FeedbackModal, AdSlot
        ├── context/        # SessionContext (session_id persistente)
        └── api/            # cliente axios + endpoints
```

## Como rodar

1. Copie o arquivo de variáveis de ambiente e informe sua chave do Gemini:

   ```bash
   cd backend
   cp .env.example .env
   # edite backend/.env e preencha GEMINI_API_KEY
   ```

2. Suba os containers:

   ```bash
   docker compose up --build
   ```

3. Rode as migrations (em outro terminal, com os containers no ar):

   ```bash
   docker compose exec backend python manage.py migrate
   docker compose exec backend python manage.py createsuperuser
   ```

4. Acesse:
   - Frontend: http://localhost:5173
   - API: http://localhost:8000/api
   - Admin Django: http://localhost:8000/admin

## Fluxo implementado

1. **Vaga** — usuário cola a descrição, IA extrai hard/soft skills, tecnologias, etc.
2. **Entrevista** — conversa adaptativa com a IA até reunir dados suficientes.
3. **Resultado** — score de compatibilidade geral/técnica/comportamental.
4. **Currículo** — visualização HTML + download PDF/DOCX (geração de arquivo a implementar em `resume_service.render_pdf/render_docx`).
5. **Plano de carreira** — sugestões de curto/médio/longo prazo para lacunas identificadas.
6. **Feedback** — modal de avaliação (1-5 estrelas + comentário) ao final do fluxo.
7. **Dashboard administrativo** — métricas agregadas em `/admin` no frontend.

## Próximos passos sugeridos

- Implementar `render_pdf` / `render_docx` em `services/resume_service.py` (reportlab / python-docx já estão no requirements.txt).
- Adicionar endpoint de download que retorne o arquivo binário (`?format=pdf` / `?format=docx`).
- Proteger `/admin` do frontend com autenticação real (hoje é uma rota aberta).
- Integrar o script real do Google AdSense nos componentes `AdSlot`.
- Adicionar testes automatizados (pytest + DRF test client).
