# Backlog de execução — MVP ViverPets

Este documento deriva do **PRD v0.3** e organiza o trabalho em **ordem sugerida de execução**, com passos claros e critérios de pronto. **Não contém prazos em semanas ou datas**; avance etapa a etapa validando cada bloco antes de acoplar o próximo.

**Regra geral:** concluir o caminho feliz do fluxo principal (PRD §11) o quanto antes; adiar tudo que não for estritamente necessário para demonstrar valor ponta a ponta.

---

## Como usar este backlog

1. Execute na **ordem das fases** (A → B → C …), salvo quando uma nota explícita permitir paralelismo.
2. Cada item tem **Objetivo**, **Entregas**, **Critério de pronto (DoD)** e **Depende de** (quando aplicável).
3. Ao terminar uma fase, faça uma **demo gravada ou roteiro de teste manual** cobrindo o DoD da fase.

---

## Fase A — Fundação do repositório e ambiente

| ID  | Objetivo                                                                                                                                                   |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A.1 | Repositório inicial com app web escolhida (ex.: framework + TypeScript), lint/format, variáveis de ambiente documentadas em `.env.example` (sem segredos). |
| A.2 | Pipeline mínimo de qualidade: typecheck + lint no CI ou script local documentado no README do projeto.                                                     |
| A.3 | Estratégia de deploy de **staging** definida (mesmo que manual no início), com URL ou processo descrito em um único lugar.                                 |

**DoD da fase A:** projeto sobe localmente com um comando documentado; build não quebra; existe `.env.example` com chaves necessárias nomeadas.

**Depende de:** nada.

---

## Fase B — Modelo de dados e multi-tenant

| ID  | Objetivo                                                                                                                                               |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| B.1 | Entidade **Clínica** (`clinic`) com campos: nome, slug opcional, logo URL opcional, cor principal, timestamps.                                         |
| B.2 | Todas as entidades de negócio com **`clinic_id` obrigatório** e índices para consultas frequentes (ex.: pet por clínica, consulta por data e clínica). |
| B.3 | Política documentada: **nenhuma** query de leitura/escrita sem filtro por `clinic_id` (middleware ou camada de repositório).                           |

**DoD da fase B:** migrações aplicam; teste automatizado ou script de smoke que prova que usuário da clínica A não lê pet da clínica B (mesmo com ID conhecido).

**Depende de:** A.

---

## Fase C — Autenticação e usuários

| ID  | Objetivo                                                                                                                                                            |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C.1 | Cadastro/login de usuário com vínculo a **uma** clínica (MVP).                                                                                                      |
| C.2 | Sessão segura conforme stack; logout; recuperação de senha **se** o provedor escolhido suportar com esforço razoável (caso contrário, documentar limitação do MVP). |
| C.3 | Convite ou criação de usuário pelo **admin** da clínica (fluxo mínimo: admin cria usuário com email + papel).                                                       |

**DoD da fase C:** três papéis existem no modelo: `admin`, `reception`, `vet`; atribuição persistida; troca de senha ou convite documentado.

**Depende de:** B.

---

## Fase D — RBAC (autorização)

| ID  | Objetivo                                                                                                                                      |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| D.1 | Matriz de permissões alinhada ao PRD v0.3 §23 (ler vs escrever prontuário, vacinas, anexos, cadastros).                                       |
| D.2 | Bloqueio em **API e UI** (esconder ou desabilitar ações não permitidas; API sempre valida papel).                                             |
| D.3 | Testes ou checklist automatizado cobrindo pelo menos: reception não edita prontuário se a regra for essa; vet edita; admin gerencia usuários. |

**DoD da fase D:** nenhuma rota sensível confia apenas no front-end.

**Depende de:** C.

---

## Fase E — Shell da aplicação e white label básico

| ID  | Objetivo                                                                                        |
| --- | ----------------------------------------------------------------------------------------------- |
| E.1 | Layout principal: sidebar ou top nav, área de conteúdo, estado de carregamento e erro genérico. |
| E.2 | Tema com **cor primária** da clínica + **logo** + nome exibidos após login.                     |
| E.3 | Página de configurações da clínica (apenas `admin`): editar nome, cor, upload ou URL de logo.   |

**DoD da fase E:** após alterar cor/logo, recarregar a sessão reflete a identidade visual nos componentes principais.

**Depende de:** C (e B para dados da clínica).

**Paralelismo:** E.1 pode começar após C.1, mas E.2/E.3 precisam de dados da clínica persistidos.

---

## Fase F — CRUD Tutores e Pets

| ID  | Objetivo                                                                                                                                             |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| F.1 | CRUD **Tutor** (nome, telefone, email opcional, documento opcional, observações) sempre escopado à clínica.                                          |
| F.2 | CRUD **Pet** vinculado a tutor (relacionamento 1:N ou N:N se múltiplos tutores for requisito futuro; MVP: **1 tutor principal** por pet).            |
| F.3 | Campos do pet: nome, espécie, raça opcional, sexo, data nascimento aproximada ou idade texto, peso atual, foto opcional, alergias/notas importantes. |
| F.4 | Busca simples por nome de pet ou tutor (lista com filtro).                                                                                           |

**DoD da fase F:** criar tutor → criar pet → listar e editar sem vazamento entre clínicas.

**Depende de:** D.

---

## Fase G — Agenda e consultas

| ID  | Objetivo                                                                                                                                                              |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G.1 | Modelo **Consulta**: pet, data/hora, status (`agendada`, `em_atendimento`, `concluida`, `cancelada` ou conjunto mínimo equivalente), profissional opcional na agenda. |
| G.2 | Visão de agenda do dia (lista ou calendário simples).                                                                                                                 |
| G.3 | Ações: agendar, reagendar, cancelar, iniciar atendimento (opcional), concluir.                                                                                        |

**DoD da fase G:** recepcionista agenda consulta para pet existente; aparece no dashboard quando a fase J existir (ou lista provisória até lá).

**Depende de:** F.

---

## Fase H — Prontuário mínimo e vínculo à consulta

| ID  | Objetivo                                                                                                                                                                                          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| H.1 | Ao concluir (ou durante) consulta, formulário com campos obrigatórios do PRD v0.3 §22: motivo/queixa, achados, conduta/orientações; peso opcional mas incentivado na UI.                          |
| H.2 | **Retorno recomendado**: data + nota; estado derivado para **retorno pendente** se não houver consulta futura associada (regra explícita no código e documentada).                                |
| H.3 | Validação: não marcar consulta como `concluida` sem prontuário mínimo preenchido **ou** decisão consciente do PRD de permitir rascunho (se permitir rascunho, documentar e refletir na timeline). |

**DoD da fase H:** fluxo veterinário: abrir consulta do dia → abrir pet → preencher prontuário → concluir; registro aparece no perfil do pet.

**Depende de:** G, D.

---

## Fase I — Vacinas e anexos

| ID  | Objetivo                                                                                                                           |
| --- | ---------------------------------------------------------------------------------------------------------------------------------- |
| I.1 | Registro de vacina: nome/tipo, data aplicação, data prevista próximo reforço (ou validade), observação, vínculo ao pet.            |
| I.2 | Upload de anexo (storage seguro) ou URL temporária no MVP, com metadados: título, data, vínculo ao pet e opcionalmente à consulta. |
| I.3 | Listagem no perfil do pet: vacinas e anexos em seções distintas.                                                                   |

**DoD da fase I:** anexo e vacina criados após consulta aparecem no perfil e respeitam RBAC.

**Depende de:** F, D; H opcional para vínculo consulta-anexo mas desejável.

---

## Fase J — Timeline e eventos automáticos

| ID  | Objetivo                                                                                                                                                  |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| J.1 | Modelo de **Evento de timeline** (tipo, payload resumido, `pet_id`, `clinic_id`, timestamp, `actor_user_id` opcional).                                    |
| J.2 | Geração automática de eventos ao: criar/editar consulta relevante, salvar prontuário, registrar vacina, adicionar anexo, registrar peso, gerar resumo IA. |
| J.3 | UI de timeline no perfil do pet: ordenação cronológica, ícones por tipo, link para detalhe quando existir.                                                |

**DoD da fase J:** ações das fases G–I refletem na timeline sem passos manuais duplicados.

**Depende de:** H e I (mínimo); G se eventos de agendamento forem incluídos.

---

## Fase K — Perfil inteligente do pet (consolidação)

| ID  | Objetivo                                                                                                                                                   |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| K.1 | Tela única “Perfil do pet” com cards: dados, tutor, alertas, últimas consultas, vacinas próximas, retornos pendentes, timeline embutida ou aba.            |
| K.2 | **Alertas simples** calculados: vacina com reforço/prazo dentro do limiar configurável por constante; retorno pendente; opcional “sem consulta há X dias”. |
| K.3 | Atalhos: nova consulta, registrar vacina, anexar exame.                                                                                                    |

**DoD da fase K:** um veterinário responde às perguntas do PRD §7 sem navegar para mais de duas áreas principais além da timeline.

**Depende de:** J.

---

## Fase L — Dashboard operacional

| ID  | Objetivo                                                                                            |
| --- | --------------------------------------------------------------------------------------------------- |
| L.1 | Painel pós-login: consultas do dia, contagem de retornos pendentes, vacinas próximas (lista curta). |
| L.2 | Links diretos para pet/consulta a partir de cada card.                                              |

**DoD da fase L:** dados coerentes com o que foi cadastrado nas fases anteriores.

**Depende de:** G, J (e K para links refinados, mas não obrigatório).

---

## Fase M — IA contextual (por último no núcleo)

| ID  | Objetivo                                                                                                                                                        |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M.1 | Endpoint seguro que monta **contexto estruturado** a partir dos dados reais do pet (consultas, prontuário, vacinas, anexos metadados) e chama o provedor de IA. |
| M.2 | Saídas: **Resumo**, **Pontos de atenção**, **Sugestão de mensagem ao tutor**; todas com disclaimer e flag “revisão humana obrigatória”.                         |
| M.3 | Persistir **metadados** de geração (PRD §9 e §23): usuário, timestamp, pet, clínica, versão do prompt ou hash.                                                  |
| M.4 | UI: botões “Copiar”, área editável para mensagem ao tutor, opção “regenerar” (com limite de taxa simples anti-abuso).                                           |
| M.5 | Comportamento com dados insuficientes: mensagem clara de lacuna, sem alucinar fatos.                                                                            |

**DoD da fase M:** IA desligada ou com chave ausente não quebra o app; com chave válida, resumo reflete apenas dados presentes; trilha de auditoria gravada.

**Depende de:** K (contexto mínimo rico); H e I fortemente recomendados antes.

---

## Fase N — Polimento, observabilidade e piloto

| ID  | Objetivo                                                                                                         |
| --- | ---------------------------------------------------------------------------------------------------------------- |
| N.1 | Tratamento consistente de erros de rede e permissão; estados vazios (“sem consultas ainda”).                     |
| N.2 | Logs estruturados ou equivalente para depuração em staging (sem dados sensíveis em claro).                       |
| N.3 | Roteiro de teste manual do fluxo §11 do PRD + checklist LGPD mínimo (acesso, exclusão lógica se houver, termos). |
| N.4 | Material de demo: dados seed fictícios (nomes de fantasia) para portfólio.                                       |

**DoD da fase N:** uma pessoa externa consegue percorrer o fluxo com o roteiro sem ajuda sua, ou anotações de falha viram bugs priorizados.

**Depende de:** todas as fases anteriores relevantes ao MVP.

---

## Ordem resumida (checklist)

- [ ] A Fundação repo/ambiente
- [ ] B Tenant `clinic_id` + invariantes
- [ ] C Auth + usuário por clínica
- [ ] D RBAC server-side
- [ ] E Shell + white label básico
- [ ] F Tutores e pets + busca
- [ ] G Agenda e consultas
- [ ] H Prontuário mínimo + retorno
- [ ] I Vacinas e anexos
- [ ] J Timeline automática
- [ ] K Perfil do pet consolidado
- [ ] L Dashboard
- [ ] M IA contextual + auditoria de geração
- [ ] N Polimento e piloto

---

## Itens explicitamente fora deste backlog (pós-MVP)

Integração WhatsApp, billing SaaS, multi-unidade, exportação legal completa, relatórios avançados, app nativo — conforme PRD §14.

---

## Referência

- `docs/PRD v0.3 — Sistema White Label para Clínicas Veterinárias.md`
