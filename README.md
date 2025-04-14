# Acessar o banco

docker exec -it postgres-dev psql -U seu_usuario -d seu_banco

# Ver estrutura da tabela

\d escalas

# Verificar Registros na tabela

SELECT \* FROM escalas;
id | nome | turno | data | status | created_at | updated_at
