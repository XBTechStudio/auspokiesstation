-- Add registerUrl_2 column to brands table in both databases
-- 
-- IMPORTANT: Execute these commands separately for each database
--
-- Method 1: Using MySQL command line
-- 
-- For WildGroup database (xbtech14):
-- mysql -h 45.32.122.230 -u xbtech14 -p xbtech14 -e "ALTER TABLE brands ADD COLUMN registerUrl_2 VARCHAR(500) NULL AFTER register_url;"
--
-- For 88Group database (xbtech17):
-- mysql -h 45.32.122.230 -u xbtech17 -p xbtech17 -e "ALTER TABLE brands ADD COLUMN registerUrl_2 VARCHAR(500) NULL AFTER register_url;"
--
-- Method 2: Using Node.js script (recommended)
-- Run: node scripts/add-registerUrl_2.js

-- SQL for WildGroup (xbtech14):
ALTER TABLE brands ADD COLUMN registerUrl_2 VARCHAR(500) NULL AFTER register_url;

-- SQL for 88Group (xbtech17):
-- ALTER TABLE brands ADD COLUMN registerUrl_2 VARCHAR(500) NULL AFTER register_url;
