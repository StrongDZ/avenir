#!/bin/sh
set -e

# Chạy init-db nếu env var RUN_INIT_DB được set (mặc định là true)
RUN_INIT_DB=${RUN_INIT_DB:-true}

if [ "$RUN_INIT_DB" = "true" ]; then
    echo "🔄 Running database initialization..."
    
    # Chạy seed script (tạo schema + seed data)
    if [ -f "build/src/scripts/seed.js" ]; then
        echo "📦 Seeding database..."
        node build/src/scripts/seed.js || {
            echo "⚠️  Seed script failed, but continuing..."
        }
    else
        echo "⚠️  Seed script not found, skipping..."
    fi
    
    # Chạy demo reset script
    if [ -f "build/src/scripts/demoReset.js" ]; then
        echo "🔄 Running demo reset..."
        node build/src/scripts/demoReset.js || {
            echo "⚠️  Demo reset script failed, but continuing..."
        }
    else
        echo "⚠️  Demo reset script not found, skipping..."
    fi
    
    echo "✅ Database initialization completed"
else
    echo "⏭️  Skipping database initialization (RUN_INIT_DB=false)"
fi

# Start server
echo "🚀 Starting server..."
exec node build/src/server.js

