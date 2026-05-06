# ViverPets — Norte técnico e stack

Documento vivo de decisões técnicas. Objetivo: norte claro, pouca burocracia, revisão quando fizer sentido.

**Não é verdade absoluta:** decisões podem mudar; aqui registramos o estado atual e o porquê.

## Como usamos os IDs (`SD-00X`)

- Status: `proposta` | `aprovada` | `descartada` | `revisar`.

---

## Ambientes (local / staging / prod) vs Git — leitura rápida

São coisas **relacionadas**, mas **não são a mesma coisa**:

| Conceito       | O que é                                                                                                                               |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Ambiente**   | _Onde o aplicativo está rodando_ com um conjunto de configurações (URLs, chaves, banco). Ex.: seu PC, um preview na Vercel, produção. |
| **Branch Git** | _Linha de desenvolvimento do código_ (histórico de commits). Ex.: `main`, `staging`, `feature/login`.                                 |

- **Local** não é branch. **Local** = sua máquina, `npm run dev`, normalmente variáveis em `.env.local` (não vai pro Git).
- **Staging** = um **deploy** (URL de homologação) alimentado por uma branch que vocês combinarem (ex.: `staging` ou `develop`).
- **Produção** = deploy público “oficial”, em geral alimentado pela **`main`**.

**Segredos:** ficam em arquivos `.env*` no desenvolvimento e nas **Environment Variables** do projeto na Vercel (Production / Preview / Development). A chave da Open Router e o `service_role` do Supabase **só no servidor**, nunca `NEXT_PUBLIC_*`.

**Sugestão de fluxo Git + deploy (você pode ajustar depois):**

- `main` → deploy **Production** na Vercel (prod).
- `staging` (ou `develop`) → deploy **Preview** estável ou ambiente de homologação (staging).
- `feature/*` ou trabalho direto em branch curta → **Preview** por PR (ótimo na Vercel).

**“Branch local”:** não costuma existir como padrão. O que existe é **trabalhar localmente** em qualquer branch (ex.: `feature/pets-crud`) e só **pushar** quando quiser.

---

## SD-001 — Framework principal do produto

- **Status:** `aprovada`
- **Decisão:** `Next.js` com `React`.
- **Por que:** SaaS com auth, APIs, anexos e multi-tenant pede base full-stack coerente.
- **Impacto:** UI e servidor no mesmo repositório.

## SD-002 — Estilização

- **Status:** `aprovada`
- **Decisão:** `Tailwind CSS`.
- **Por que:** velocidade para UI operacional e white label simples (cor/logo/nome).

## SD-003 — Dados e backend gerenciado

- **Status:** `aprovada`
- **Decisão:** `Supabase` (Postgres, Auth, Storage).
- **Por que:** acelera MVP com modelo relacional e segurança por políticas.

## SD-004 — Multi-tenant

- **Status:** `aprovada`
- **Decisão:** isolamento lógico por `clinic_id` em todas as entidades sensíveis.
- **Impacto:** queries e políticas sempre escopadas à clínica.

## SD-005 — Linguagem

- **Status:** `aprovada`
- **Decisão:** `TypeScript`.

## SD-006 — Autenticação (MVP)

- **Status:** `aprovada`
- **Decisão:** `Supabase Auth` — email/senha e confirmação por código (OTP) quando aplicável.
- **Guardrails:** email confirmado para novos cadastros; chave `service_role` só servidor; erros sem vazar detalhes.

## SD-007 — Autorização

- **Status:** `aprovada`
- **Decisão:** `RBAC` na aplicação (`admin`, `reception`, `vet`) + `RLS` no Postgres.
- **Regra:** nenhuma query em dado sensível sem escopo de clínica.

## SD-008 — Anexos

- **Status:** `aprovada`
- **Decisão:** `Supabase Storage`, bucket **privado**, leitura por **URL assinada** de curta duração, path `clinic_id/pet_id/...`.

## SD-009 — APIs no Next.js

- **Status:** `aprovada`
- **Decisão:** híbrido — `Server Actions` (telas internas) + `Route Handlers` (integrações, proxy IA, webhooks).

## SD-010 — Migrações

- **Status:** `aprovada`
- **Decisão:** mudanças de schema via migrações SQL versionadas; evitar “alteração na mão” em prod fora de migração.

## SD-011 — Observabilidade mínima

- **Status:** `aprovada`
- **Decisão:** logs estruturados no servidor com `request_id`; `clinic_id` / `user_id` quando seguro; sem dados clínicos em log.

## SD-012 — IA (fase posterior ao núcleo do MVP)

- **Status:** `aprovada` (direção; implementação detalhada depois)
- **Provedor:** [OpenRouter](https://openrouter.ai/).
- **Modelo desejado:** linha **GPT-4.x “Flash” / rápido** (slug exato no catálogo da OpenRouter a fixar na implementação — nomes mudam no painel).
- **Modo de uso:** chamadas **HTTP à API** da OpenRouter com **API key**.
- **Onde fica a chave:** apenas **variável de ambiente no servidor** (ex.: `OPENROUTER_API_KEY`); nunca no client nem em `NEXT_PUBLIC_*`.
- **Onde roda a lógica:** em **Route Handler** ou **Server Action** server-only que monta o contexto a partir do banco e chama a API (alinhado ao PRD: revisão humana, sem diagnóstico).
- **Nota:** módulo de IA entra após fluxo clínico + dados estarem sólidos (vide backlog, fase M).

## SD-013 — Ambientes e segredos

- **Status:** `aprovada`
- **Decisão:**
  - **Local:** dev na máquina; `.env.local` (gitignored) com URL/chaves do projeto Supabase de desenvolvimento (ou branch de dados que vocês definirem).
  - **Staging:** deploy de homologação (Preview dedicado na Vercel ou projeto separado); variáveis na Vercel para Preview; idealmente **projeto Supabase de staging** quando o produto exigir separação real de dados.
  - **Produção:** deploy production na Vercel; variáveis “Production”; Supabase **projeto prod**.
- **Segredos típicos:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (só servidor), `OPENROUTER_API_KEY` (só servidor, quando existir IA).
- **Vercel:** token de CLI / integrações CI é para **automação**, não costuma ir dentro do runtime do Next — cada coisa no seu lugar.

## SD-014 — Hospedagem

- **Status:** `aprovada`
- **Decisão:** frontend/host do app Next.js na **Vercel**, com integração operacional boa com Supabase (deploy, previews, envs).
- **Impacto:** `main` → produção; branches/PRs → previews conforme configuração do projeto.

---

## Regras de arquitetura já aceitas

- Multi-tenant por `clinic_id`.
- IA assistiva e revisável; não diagnóstica.
- Segurança e rastreabilidade mínimas no MVP.

## Próximos tópicos (quando for implementar)

- Slug exato do modelo na OpenRouter e limites de custo.
- Projeto Supabase único vs **dois projetos** (staging + prod) — recomendado antes de dados reais de clínica.
