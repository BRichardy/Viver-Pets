# PRD v0.3 — Sistema White Label para Clínicas Veterinárias (ViverPets)

## 0. Changelog em relação à v0.2

- Definido modelo **multi-tenant** com isolamento lógico por clínica (`clinic_id` em todas as entidades sensíveis).
- Incluídos requisitos mínimos de **segurança, privacidade e LGPD** para o MVP.
- Detalhados **papéis, permissões** e **auditoria** básica de alterações em dados clínicos.
- Especificado **prontuário simples** com campos mínimos obrigatórios e opcionais.
- Acrescentadas **métricas de sucesso mensuráveis** além dos critérios qualitativos.
- Refinados requisitos da **IA** (rastreabilidade, linguagem segura, revisão humana explícita).
- Padronizada terminologia: **retorno recomendado** (sugerido na consulta) vs **retorno pendente** (ainda não cumprido ou não agendado).

As seções 1 a 19 preservam a intenção da v0.2, com ajustes pontuais onde a v0.3 acrescenta precisão.

---

## 1. Visão do produto

O produto é um sistema web **white label** para clínicas veterinárias, pensado para organizar a rotina da clínica em torno de tutores, pets, consultas, histórico clínico, vacinas, exames, retornos e comunicação operacional.

A proposta inicial não é criar um ERP veterinário completo, nem um sistema gigante com todos os módulos possíveis. O objetivo é construir uma primeira versão clara, moderna e funcional, com um diferencial forte: transformar o histórico do pet em uma experiência organizada, visual e inteligente.

O sistema deve parecer um produto real, com domínio de negócio, fluxo operacional e utilidade prática. Ele não deve ser apenas um conjunto de telas de cadastro.

---

## 2. Frase-guia

Criar um sistema web white label para clínicas veterinárias, com foco em gestão operacional moderna, histórico inteligente dos pets, automações úteis e IA contextual para apoiar a rotina da clínica **sem substituir o veterinário** nem realizar diagnóstico ou prescrição automática.

---

## 3. Problema

Clínicas veterinárias pequenas e médias lidam com muitas informações espalhadas e processos que nem sempre são bem organizados.

Entre os problemas comuns estão:

- dificuldade para consultar rapidamente o histórico completo de um pet;
- informações de tutores e animais espalhadas em planilhas, papéis, sistemas antigos ou WhatsApp;
- falta de visão clara sobre vacinas, retornos e acompanhamentos pendentes;
- dificuldade para acompanhar evolução de peso, sintomas, exames e consultas;
- comunicação operacional muito manual com os tutores;
- sistemas genéricos, antigos ou pouco agradáveis de usar;
- baixa inteligência sobre a jornada do pet dentro da clínica.

O problema central não é apenas “falta de cadastro”. O problema é a **falta de contexto organizado** para atendimento, acompanhamento e relacionamento.

---

## 4. Público-alvo

### Público principal

Clínicas veterinárias pequenas e médias que desejam organizar melhor a rotina de atendimento, cadastro, histórico dos pets e acompanhamento dos tutores.

### Usuários do sistema

#### Administrador da clínica

Responsável por configurar a clínica, gerenciar usuários, permissões de alto nível e acompanhar informações gerais.

#### Recepcionista ou atendente

Responsável por cadastrar tutores e pets, organizar agenda, consultar informações rápidas e apoiar a comunicação com clientes.

#### Veterinário

Responsável por consultar histórico do pet, registrar atendimentos, acompanhar evolução, visualizar exames, registrar vacinas e usar a IA como apoio contextual.

---

## 5. Proposta de valor

O sistema ajuda clínicas veterinárias a terem uma visão mais clara, moderna e organizada da jornada de cada pet.

Em vez de tratar o animal como apenas mais um registro em uma tabela, o produto coloca o pet no centro da experiência. Cada pet terá um perfil próprio com histórico, eventos, consultas, vacinas, exames, anexos, observações e resumos inteligentes.

A proposta de valor inicial é:

> Menos informação perdida, mais clareza no atendimento e uma visão inteligente da jornada de saúde de cada pet.

---

## 6. Diferencial do produto

O diferencial não será apenas permitir cadastros.

O diferencial estará em combinar:

- perfil inteligente do pet;
- timeline visual do histórico;
- resumo contextual com IA;
- alertas operacionais simples;
- experiência moderna e agradável;
- white label por clínica (nome, logo, cor principal no MVP);
- base preparada para **confiabilidade** (permissões, auditoria mínima, isolamento por clínica).

O produto deve fugir da sensação de “sistema administrativo genérico”. Ele precisa parecer feito especificamente para a rotina de uma clínica veterinária.

---

## 7. Conceito central: Perfil Inteligente do Pet

O perfil do pet será o centro do sistema.

Essa tela deve reunir as principais informações do animal e permitir que a equipe entenda rapidamente sua situação.

O perfil pode conter:

- dados básicos do pet;
- tutor responsável;
- foto do animal;
- espécie, raça, idade e peso;
- alergias ou observações importantes;
- últimas consultas;
- vacinas aplicadas ou próximas do vencimento;
- exames e anexos;
- retornos pendentes e retornos recomendados não agendados;
- timeline de eventos;
- resumo contextual gerado por IA (sempre rotulado como sugestão, sujeito a revisão).

Perguntas que a tela deve ajudar a responder em poucos segundos:

- Quem é esse pet? Quem é o tutor?
- Quando foi o último atendimento?
- Existe pendência operacional (retorno, vacina, exame)?
- O que mudou recentemente?
- Qual é o contexto antes de uma nova consulta?

---

## 8. Timeline do pet

A timeline é um dos principais elementos do MVP.

Ela deve mostrar a história do pet dentro da clínica de forma cronológica e visual.

Eventos possíveis na timeline:

- consulta realizada;
- consulta agendada;
- vacina aplicada;
- exame anexado;
- alteração de peso;
- observação importante;
- retorno recomendado (registrado na consulta);
- retorno pendente (estado operacional: ainda não realizado ou não agendado);
- procedimento registrado (quando existir registro associado à consulta);
- resumo de IA gerado (com indicação de data e versão do resumo, se aplicável).

Objetivo: transformar informações soltas em uma jornada compreensível, com foco no veterinário antes e durante o atendimento.

---

## 9. Papel da IA

A IA atua como **assistente operacional e contextual**. Não é ferramenta de diagnóstico, prescrição ou substituição do profissional veterinário.

### Funções iniciais da IA

#### Resumo do histórico do pet

Analisa os registros disponíveis na clínica e gera um resumo claro sobre o histórico recente do animal, com linguagem que indique que se baseia **apenas nos dados cadastrados**.

#### Pontos de atenção

Destaca informações úteis para a equipe, como: retorno pendente, vacina próxima do vencimento, longo período sem consulta, sintomas recorrentes registrados (como texto livre histórico), mudança relevante de peso, exames recentes anexados.

#### Sugestão de mensagem para tutor

Gera texto operacional para a equipe **revisar, editar e decidir enviar** por canal externo (fora do escopo do MVP: integração real com WhatsApp).

### Requisitos de confiabilidade (MVP)

- Todo conteúdo gerado é **sugestão** e exige **revisão humana** antes de qualquer uso externo.
- O sistema deve registrar **metadados mínimos** de cada geração: usuário solicitante, data/hora, pet e clínica (para auditoria interna).
- Quando possível, o resumo deve **referenciar a origem** dos fatos (ex.: “última consulta em DD/MM/AAAA”, “vacina X com reforço previsto em …”), sem inventar dados ausentes.
- Se faltar informação essencial, a IA deve declarar **lacuna** em vez de supor.

### Limite obrigatório

Nenhuma saída da IA substitui julgamento clínico nem constitui orientação médica definitiva.

---

## 10. Escopo do MVP v0.1

MVP pequeno o bastante para ser construído, forte o bastante para demonstrar o conceito.

### Módulos iniciais

#### Autenticação

Acesso seguro para usuários da clínica, com sessão adequada ao stack escolhido.

#### Clínica (tenant)

Cadastro e configuração básica: nome, logo, cor principal. Todo dado operacional pertence a **uma clínica** isolada logicamente das demais.

#### Tutores

Cadastrar e consultar responsáveis pelos pets.

#### Pets

Cadastrar pets e acessar o perfil inteligente de cada animal.

#### Consultas

Agendar e registrar atendimentos básicos. “Consulta” no MVP engloba **atendimento clínico registrado em agenda/prontuário**; procedimentos podem existir como texto ou tipo simples vinculado ao mesmo registro, sem módulo hospitalar complexo.

#### Prontuário simples

Registro estruturado mínimo do atendimento (ver seção 22).

#### Vacinas

Registrar vacinas aplicadas e datas relevantes (próximo reforço ou validade, conforme modelo de dados adotado).

#### Exames e anexos

Anexar documentos, imagens ou laudos ao perfil do pet, com metadados básicos (nome/descrição, data).

#### Timeline

Exibir eventos importantes do pet de forma cronológica; atualização automática a partir das ações da clínica.

#### IA contextual

Resumo do histórico, pontos de atenção e sugestão de mensagem para tutor, com fluxo de revisão.

#### Dashboard simples

Consultas do dia, retornos pendentes, vacinas próximas (definição de “próximas” configurável por limiar simples, ex.: N dias, fixo no MVP).

---

## 11. Fluxo principal do MVP

```text
Recepcionista cadastra tutor
→ cadastra pet
→ agenda consulta
→ veterinário acessa agenda
→ abre perfil do pet
→ visualiza timeline e histórico
→ gera resumo contextual com IA (opcional, revisável)
→ registra atendimento (prontuário mínimo)
→ adiciona vacina, exame ou observação
→ sistema atualiza timeline
→ sistema reflete retorno recomendado e/ou retorno pendente
→ dashboard reflete pendências do dia
```

Qualquer funcionalidade que não fortalecer esse fluxo deve ser adiada.

---

## 12. Experiência desejada

O sistema deve transmitir: organização, confiança, clareza, cuidado, modernidade, simplicidade e foco na rotina real da clínica.

A navegação deve favorecer: encontrar pet rapidamente; entender histórico; registrar atendimento com baixa fricção; visualizar pendências; acessar tutor; usar IA no momento certo.

---

## 13. Direção visual

White label no MVP: nome da clínica, logo, cor principal, identidade básica.

Interface base limpa, profissional, com timeline destacada e alertas bem diferenciados. Deve parecer produto de domínio veterinário, não template genérico.

---

## 14. O que não entra no MVP v0.1

- financeiro completo;
- controle completo de estoque;
- emissão de nota fiscal;
- assinatura SaaS automatizada e billing recorrente;
- integração real com WhatsApp ou outros canais;
- app mobile nativo;
- marketplace;
- telemedicina;
- IA diagnóstica ou prescrição automática;
- relatórios avançados;
- gestão completa de banho e tosa;
- múltiplas unidades com regras complexas;
- automações sofisticadas multi-canal.

---

## 15. Roadmap simples (fases de produto)

### Fase 1 — Base do sistema

Autenticação, tenant (clínica), usuários básicos, layout principal, navegação.

### Fase 2 — Cadastros principais

Tutores, pets, vínculo tutor–pet, busca e listagens.

### Fase 3 — Atendimento

Agenda, consultas, prontuário simples, vacinas, anexos e exames.

### Fase 4 — Histórico inteligente

Perfil do pet, timeline, eventos automáticos, alertas simples.

### Fase 5 — IA contextual

Resumo, pontos de atenção, sugestão de mensagem, revisão humana e metadados de auditoria da geração.

### Fase 6 — White label inicial

Logo, cor principal, nome da clínica, ajustes visuais básicos.

---

## 16. Ideias futuras

Integração com WhatsApp, lembretes automáticos, confirmação de consulta, financeiro, estoque, relatórios, painel de relacionamento, gráficos de peso, modos por papel, múltiplas unidades, domínio customizado, planos SaaS, etc.

---

## 17. Critérios de sucesso do MVP (qualitativos)

1. Uma clínica acessa o sistema.
2. Cadastro de tutor e pet com vínculo.
3. Consulta agendada.
4. Veterinário abre perfil do pet e vê histórico claro.
5. Atendimento registrado com prontuário mínimo.
6. Vacina ou exame adicionado.
7. Timeline atualizada.
8. IA gera resumo útil e claramente marcado como sugestão.
9. Dashboard mostra informações operacionais básicas.

Perguntas de validação: parece feito para clínica real? Perfil e timeline ajudam? IA agrega sem prometer diagnóstico? Parece mais forte que um CRUD comum? Escopo ainda realista para time reduzido?

---

## 18. Princípios de decisão

1. O pet é o centro do produto.
2. O histórico precisa ser fácil de entender.
3. Priorizar fluxo completo, não quantidade de módulos.
4. IA apoia; não substitui veterinário.
5. Funcionalidade futura não bloqueia execução atual.
6. Interface moderna e confiável.
7. Parecer produto real, não experimento solto.
8. White label começa simples.
9. MVP executável com apoio de ferramentas e boas práticas.
10. Objetivos: aprendizado, portfólio forte, base para validação comercial.

---

## 19. Resumo final

Aplicação web white label para clínicas veterinárias, com MVP em tutores, pets, consultas, prontuário simples, vacinas, anexos, timeline e IA contextual, com **isolamento por clínica**, **permissões claras** e **auditoria mínima** para dados sensíveis.

---

## 20. Arquitetura multi-tenant (decisão v0.3)

### Modelo adotado no MVP

- **Um único aplicativo** (um deploy) atendendo várias clínicas.
- **Isolamento lógico**: toda linha de dado de negócio inclui `clinic_id` (ou equivalente). Nenhuma consulta de leitura/escrita sem filtro por clínica.
- Usuário pertence a uma ou mais clínicas; no MVP, **um usuário pertence a uma única clínica**, simplificando regras.

### White label neste modelo

Personalização (nome, logo, cor) é **dado da clínica**, carregado após autenticação e resolução do tenant da sessão.

### Evolução futura (fora do MVP)

Múltiplas unidades por clínica, domínios customizados, tenants com regras de billing, ou isolamento físico (banco dedicado) para clientes enterprise.

---

## 21. Segurança, privacidade e LGPD (mínimo para o MVP)

### Princípios

- Dados de tutores, pets e prontuários são **dados pessoais e sensíveis** no uso pelo produto; tratar com minimização, controle de acesso e rastreabilidade básica.
- Finalidade: operação da clínica e histórico assistencial; **não** treinar modelo de terceiros com dados reais da clínica sem base legal e contrato explícitos (recomendação: **não usar** dados de produção para treino no MVP).

### Requisitos mínimos

- **Consentimento e transparência**: texto de política de privacidade / termos de uso da clínica fica a cargo da clínica; o produto oferece pontos de coleta mínimos e registro de aceite do **usuário da plataforma** (login).
- **Retenção**: política simples configurável no futuro; no MVP, documentar comportamento padrão (ex.: manter enquanto a clínica for cliente; exclusão lógica ao encerrar).
- **Segredos**: chaves de API (IA, storage) apenas no servidor; nunca no front-end público.
- **Transporte**: HTTPS em produção.
- **Backups e exportação**: desejável planejar exportação básica pós-MVP; no MVP, registrar como risco se não existir.

---

## 22. Prontuário simples — campos mínimos (MVP)

### Obrigatórios (para “consulta concluída”)

- Data/hora do atendimento (ou vínculo à consulta agendada).
- Profissional responsável pelo registro (usuário logado).
- **Motivo / queixa** (texto curto).
- **Achados / evolução** (texto).
- **Conduta / orientações** (texto, pode incluir prescrição descrita em texto livre pela clínica; o sistema não valida conteúdo clínico).

### Fortemente recomendados

- **Peso** no momento da consulta (para timeline e alertas).
- **Retorno recomendado**: data sugerida + nota opcional; estado deriva se foi agendado/cumprido (retorno pendente).

### Opcionais

- Observações internas (não destinadas ao tutor).
- Tags simples ou classificação grossa (ex.: retorno, emergência, check-up), se couber sem inflar escopo.

### Auditoria

- Ao **editar** prontuário após salvo, registrar: quem editou, quando, e ideally **valores anteriores** ou diff resumido (nível mínimo: log de “edição ocorrida” com timestamp e usuário).

---

## 23. Papéis, permissões e auditoria

### Papéis (MVP)

| Papel       | Descrição resumida                                                                           |
| ----------- | -------------------------------------------------------------------------------------------- |
| `admin`     | Configura clínica, convida/gerencia usuários, acessa dashboard e relatórios simples futuros. |
| `reception` | CRUD tutores/pets, agenda, anexos operacionais, visualização de perfil do pet.               |
| `vet`       | Tudo que reception para leitura operacional + prontuário, vacinas, encerramento de consulta. |

Ajustes finos (ex.: reception não ver certo campo) podem ser simplificados no MVP desde que **prontuário completo** seja restrito a perfis clínicos e admin.

### Regras que não podem falhar

- Um usuário só acessa dados da **sua** `clinic_id`.
- Ações sensíveis (criar/editar prontuário, excluir anexo, alterar vacina) exigem papel adequado.

### Auditoria (MVP)

- Logs de autenticação básicos (opcional conforme stack).
- Registro de **criação/edição** em: prontuário, vacina, anexo vinculado a pet, e geração de IA.

---

## 24. Métricas de sucesso mensuráveis (alvos iniciais sugeridos)

Ajuste os números após primeira clínica piloto; servem como **direção**, não contrato.

- **Tempo até contexto**: em 80% dos acessos ao perfil do pet, o usuário chega ao resumo + timeline em **menos de 3 interações** (cliques/toques) a partir do dashboard ou busca global.
- **Cobertura de histórico**: entre pets com consulta no período piloto, **≥ 70%** com pelo menos um registro de prontuário não vazio nos campos obrigatórios.
- **Pendências visíveis**: **≥ 50%** dos retornos recomendados aparecem como pendência ou agendamento associado na primeira versão piloto (medido manualmente ou por query).
- **Uso da IA**: em **≥ 30%** das consultas encerradas, alguém abriu a função de resumo pelo menos uma vez (indica percepção de valor).
- **Qualidade percebida**: em entrevista pós-piloto (5 perguntas), nota média **≥ 4/5** em “facilitou o atendimento” e “confio no histórico exibido”.

---

## 25. Glossário rápido

- **Clínica (tenant)**: organização pagadora ou dona dos dados isolados.
- **Retorno recomendado**: data/orientação sugerida na consulta.
- **Retorno pendente**: retorno ainda não realizado ou não agendado, conforme regras do sistema.
- **Timeline**: visão cronológica de eventos derivados das ações da clínica e da IA (metadado).

---

## 26. Resumo executivo para desenvolvimento

Implementar primeiro o **caminho feliz completo** do fluxo da seção 11 com **tenant + RBAC + auditoria mínima + prontuário mínimo**; em seguida timeline e dashboard; por último IA com metadados e disclaimers. White label visual em paralelo quando o shell da aplicação estiver estável.

Documentos complementares: `docs/BACKLOG-execucao-MVP-ViverPets.md` e `docs/viverpets-stack-norte.md` (stack e decisões técnicas).
