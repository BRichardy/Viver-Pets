# ViverPets

Sistema web white label para clínicas veterinárias (MVP em construção).

## Repositório

Código-fonte: [github.com/BRichardy/Viver-Pets](https://github.com/BRichardy/Viver-Pets)

```bash
git remote add origin https://github.com/BRichardy/Viver-Pets.git
# primeiro push (após commit inicial): git branch -M main && git push -u origin main
```

## Branches (sugestão)

| Branch | Uso |
|--------|-----|
| `main` | Produção (deploy Vercel Production). Só código estável. |
| `staging` | Homologação (deploy preview estável ou ambiente dedicado). |
| `feature/*` ou `fix/*` | Trabalho do dia; abre PR → merge em `staging` ou direto em `main` conforme combinado. |

Fluxo simples no começo: **`main` + branches curtas de feature**; crie `staging` quando precisar de URL fixa de homologação.

## Estrutura

- **Raiz** — aplicação **Next.js** (React, TypeScript, Tailwind) + Supabase (`app/`, `lib/`, `proxy.ts`, etc.)
- `docs/` — PRD, backlog e decisões de stack

Renomeie a pasta do projeto no disco para `viverpets` (minúsculo) se quiser alinhar ao npm/Git; o nome do pacote no `package.json` já está em minúsculas.

## Rodar localmente

```powershell
Copy-Item .env.example .env.local
# Preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Se ainda existir uma pasta **`web/`** vazia ou só com `node_modules` antigo (arquivo travado no Windows), feche o terminal/IDE que estiver usando o projeto e apague a pasta `web/` manualmente. O app agora vive na **raiz**.

## Documentação do produto

- `docs/PRD v0.3 — Sistema White Label para Clínicas Veterinárias.md`
- `docs/BACKLOG-execucao-MVP-ViverPets.md`
- `docs/viverpets-stack-norte.md`
