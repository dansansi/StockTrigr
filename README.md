# StockTrigr

Backend em NestJS que monitora uma lista de ativos da B3, calcula indicadores técnicos (Bollinger Bands e Fibo BB) em ciclos periódicos e envia alertas via Discord Webhook quando um gatilho é atingido.

## Stack

NestJS · TypeScript · Prisma · SQLite · Discord Webhook API

## Funcionalidades

Watchlist configurável de ativos da B3
 Cálculo de Bollinger Bands (desvios 2.0 e 4.8) e RSI.
 
 Job intraday a cada 15 minutos em horário de mercado.
 
 Job diário para persistência do candle de fechamento.
 
 Supressão de alertas por ativo/dia.
 
 Alertas enviados via Discord Webhook.

## Deploy

Projeto implantado com fins de estudo em duas clouds simultaneamente:

 **Azure** - Azure Container Apps + Azure Key Vault + GHCR
 
 **AWS** - ECS Fargate + ECR + SSM Parameter Store + IAM Role
 
 **Render** - Deploy final com Cron-job mantendo o container ativo somente em horario comercial.

CI/CD via GitHub Actions com build único e deploy paralelo para ambas as clouds.

## Status

Concluído.
