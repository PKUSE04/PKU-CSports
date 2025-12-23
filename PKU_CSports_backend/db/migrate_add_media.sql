-- 为已有数据库添加 media 字段的迁移脚本
-- 仅适用于已存在的数据库，新数据库请直接使用 schema.sql

-- 检查并添加 media 字段
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'posts' 
        AND column_name = 'media'
    ) THEN
        ALTER TABLE posts ADD COLUMN media JSONB DEFAULT '[]'::JSONB;
        RAISE NOTICE '✓ media 字段已添加';
    ELSE
        RAISE NOTICE '✓ media 字段已存在';
    END IF;
END $$;

-- 检查并创建索引
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_indexes 
        WHERE tablename = 'posts' 
        AND indexname = 'idx_posts_media'
    ) THEN
        CREATE INDEX idx_posts_media ON posts USING GIN(media);
        RAISE NOTICE '✓ media 索引已创建';
    ELSE
        RAISE NOTICE '✓ media 索引已存在';
    END IF;
END $$;

