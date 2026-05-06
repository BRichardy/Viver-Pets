# ViverPets

Sistema web white label para clínicas veterinárias (MVP em construção).

## Repositório

Código-fonte: [github.com/BRichardy/Viver-Pets](https://github.com/BRichardy/Viver-Pets)

```bash
git remote add origin https://github.com/BRichardy/Viver-Pets.git
# Branches principais já existentes no remoto: main, staging
```

## Branches

Branches no GitHub: [`main`](https://github.com/BRichardy/Viver-Pets/tree/main), [`staging`](https://github.com/BRichardy/Viver-Pets/tree/staging).

| Branch | Uso |
|--------|-----|
| `main` | Produção (deploy Vercel Production). Só código estável. |
| `staging` | Homologação (deploy preview estável ou ambiente dedicado). Espelha o que vai sendo validado antes de subir para `main`. |
| `feature/*` ou `fix/*` | Trabalho do dia; abre PR → merge em `staging` primeiro (recomendado) ou direto em `main` quando for mudança pequena e segura. |

```powershell
git checkout main
git checkout staging
git pull origin staging
```

Fluxo sugerido: **feature → `staging` → `main`** após validação.

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
