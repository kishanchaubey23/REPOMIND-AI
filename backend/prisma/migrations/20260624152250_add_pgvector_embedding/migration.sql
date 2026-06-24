-- Enable the pgvector extension (Supabase already ships pgvector, just needs enabling)
CREATE EXTENSION IF NOT EXISTS vector;

-- Add the embedding column to the table Prisma already created
ALTER TABLE "ChunkEmbedding"
ADD COLUMN "embedding" vector(768);

-- Index for fast similarity search (cosine distance)
CREATE INDEX ON "ChunkEmbedding" USING ivfflat ("embedding" vector_cosine_ops);