-- CreateTable
CREATE TABLE "motoristas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "placa_veiculo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ATIVO'
);

-- CreateTable
CREATE TABLE "entregas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descricao" TEXT NOT NULL,
    "origem" TEXT NOT NULL,
    "destino" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CRIADA',
    "motorista_id" INTEGER,
    CONSTRAINT "entregas_motorista_id_fkey" FOREIGN KEY ("motorista_id") REFERENCES "motoristas" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "eventos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "descricao" TEXT NOT NULL,
    "entrega_id" INTEGER NOT NULL,
    CONSTRAINT "eventos_entrega_id_fkey" FOREIGN KEY ("entrega_id") REFERENCES "entregas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "motoristas_cpf_key" ON "motoristas"("cpf");
