# Novo dashboard — mobile first, calmo e acionável

Mantém tudo o que o dashboard tem hoje (saudação, resumo semanal, score, hábitos do dia, notas recentes), mas reorganizado para o celular e com densidade baixa: menos números soltos, mais contexto e ação.

## Como fica no mobile (ordem da tela)

```text
┌──────────────────────────────┐
│ Boa noite, Lemxvos           │  saudação compacta (serif, 1 linha)
│ qua, 2 set · 3 dias de foco  │  data + streak em uma linha
├──────────────────────────────┤
│ HOJE                         │  card único de foco
│ ▢ Ler 20 páginas             │  hábitos/atividades toque-único
│ ▢ Treino                     │
│ + nova nota   → atividades   │  duas ações diretas
├──────────────────────────────┤
│ GRAVITY SCORE      7.42 ↑    │  sparkline larga, sem eixos
│ ~~~~~~~~~~~~~~~~~~~~~~~~     │
│ 3 notas · 2 entidades (7d)   │  o "resumo semanal" vira legenda
├──────────────────────────────┤
│ PROJETOS ATIVOS              │  novo bloco (máx. 3)
│ Continuum      4 notas · 2h  │
│ Estudos        2 notas       │
│ ver todos                    │
├──────────────────────────────┤
│ FLUXO RECENTE                │  notas recentes (5), sem scroll interno
│ Nota A                  hoje │
│ Nota B                  ontem│
└──────────────────────────────┘
```

Pontos-chave do mobile:
- Uma coluna, cards largura cheia, nada de scroll dentro de card (a página inteira rola).
- Alvos de toque com 44px de altura mínima; "concluir hábito" continua em um toque.
- Sem grid de 4 KPIs apertados: os números viram legenda dentro do card a que pertencem.
- Título menor no celular (evita quebrar em 3 linhas) e sem espaço morto no topo.
- Botão flutuante de nova nota mantido, mas afastado da bottom bar.

## Como fica no desktop

Dashboard clássico, aproveitando o mesmo conteúdo:
- Linha 1: header + resumo semanal (como hoje, mais enxuto).
- Linha 2: Score (8 colunas) + Hoje/hábitos (4 colunas).
- Linha 3: Fluxo recente (8 colunas) + Projetos ativos (4 colunas).

## O que muda no conteúdo

Mantido e melhorado:
- Saudação, resumo dos últimos 7 dias, score com evolução, hábitos de hoje, notas recentes.
- Resumo semanal deixa de ser uma faixa separada e passa a viver como legenda do score (menos ruído).

Novo — Projetos ativos:
- Até 3 entidades do tipo `PROJECT` com atividade mais recente.
- Cada linha: nome, nº de notas ligadas e tempo rastreado (quando existir), toque abre a entidade.
- Se não houver projeto, o card mostra um convite discreto para criar um (sem card vazio feio).

Ideias extras (posso incluir se você quiser, sem poluir):
- "Streak de foco" na linha da data em vez de card próprio.
- Uma única sugestão de Forgotten Gem por dia, como linha no fim do fluxo recente (não um bloco).
- Atalho "continuar onde parei" na última nota editada.

## Detalhes técnicos

- `src/pages/Dashboard.tsx`: reordena as seções, remove o `SummaryMetricRow` isolado, passa deltas para o card de score, cria a seção mobile em coluna única com `lg:grid-cols-12` só no desktop.
- `src/components/dashboard/ScoreEvolutionCard.tsx`: aceita as métricas de 7 dias como legenda; sparkline sem eixos no mobile.
- `src/components/dashboard/TodayHabitsCard.tsx`: vira o card "Hoje", com as duas ações rápidas no rodapé.
- Novo `src/components/dashboard/ActiveProjectsCard.tsx`: usa `entitiesApi.list()` filtrando `type === "PROJECT"`, ordenando por atualização; contagens vindas dos dados já carregados (sem endpoint novo).
- Skeleton do dashboard atualizado para o novo layout (uma coluna no mobile).
- Textos novos adicionados em `src/i18n/dashboard.ts` (en/es/pt/fr); zero string hardcoded.
- Estilo mantém os tokens atuais: `border-white/5`, `rounded-xl`, fonte serif nos títulos, mono nos rótulos.
