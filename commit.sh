#!/bin/bash

clear

# --- CONFIGURAÇÃO DE CORES ---
VERDE='\033[0;32m'
CIANO='\033[0;36m'
AMARELO='\033[1;33m'
VERMELHO='\033[0;31m'
NC='\033[0m'

# --- VERSÃO ATUAL ---
# VERSION: 5.35

ULTIMA_V=$(grep "^# VERSION:" "$0" | cut -d ' ' -f 3)

# 4. Se chegou aqui, tem mudança! Pergunta a versão.
echo -e "\n${AMARELO}--------------------------------------${NC}"
echo -e "Última versão registrada: ${VERDE}$ULTIMA_V${NC}"
read -p "Nova versão detectada! Digite o número: " NOVA_V
echo -e "${AMARELO}--------------------------------------${NC}\n"

# 5. Commit e Push
echo -e "${CIANO}Subindo alterações para Produção...${NC}"
git add .
git commit -m "v$NOVA_V" -q
git push -q
cd ..

# 6. O script se atualiza apenas se houve sucesso
sed -i "s/^# VERSION: $ULTIMA_V/# VERSION: $NOVA_V/" "$0"

echo -e "\n${VERDE}✔ Sucesso! Versão $NOVA_V lançada e script atualizado.${NC}"