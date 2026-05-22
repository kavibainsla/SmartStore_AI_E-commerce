import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env variables
dotenv.config({ path: join(__dirname, '../../.env') });

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartstore_ai';

async function runPerformanceCheck() {
  console.log('==================================================');
  console.log('       MONGODB PERFORMANCE DIAGNOSTICS            ');
  console.log('==================================================');
  console.log(`Connecting to: ${uri}...`);

  const startTime = Date.now();
  
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    
    const connectTime = Date.now() - startTime;
    console.log(`\n✅ Connection Successful in: ${connectTime}ms`);
    
    const db = mongoose.connection.db;
    
    // 1. Run a Ping command to check latency
    console.log('\n--- 1. Latency & Ping ---');
    const pingStart = Date.now();
    const pingResult = await db.admin().ping();
    const pingLatency = Date.now() - pingStart;
    console.log(`Ping Latency: ${pingLatency}ms`);
    console.log(`Ping Result:`, pingResult);

    // 2. Fetch Database Statistics
    console.log('\n--- 2. Database Stats ---');
    const stats = await db.stats();
    console.log(`Database Name: ${stats.db}`);
    console.log(`Collections Count: ${stats.collections}`);
    console.log(`Data Size (KB): ${(stats.dataSize / 1024).toFixed(2)}`);
    console.log(`Storage Size (KB): ${(stats.storageSize / 1024).toFixed(2)}`);
    console.log(`Indexes Count: ${stats.indexes}`);
    console.log(`Index Size (KB): ${(stats.indexSize / 1024).toFixed(2)}`);

    // 3. Inspect Collections and their Indexes
    console.log('\n--- 3. Collections & Index Analysis ---');
    const collections = await db.listCollections().toArray();
    
    for (const col of collections) {
      const colName = col.name;
      const colInstance = db.collection(colName);
      const indexes = await colInstance.indexes();
      const count = await colInstance.countDocuments();
      
      console.log(`\nCollection: "${colName}" (${count} documents)`);
      console.log(`Indexes defined:`);
      indexes.forEach(idx => {
        const keys = Object.keys(idx.key).map(k => `${k}: ${idx.key[k]}`).join(', ');
        console.log(`  - Name: ${idx.name} | Keys: { ${keys} }${idx.unique ? ' (UNIQUE)' : ''}`);
      });
      
      // Check for performance index alerts
      if (colName === 'products') {
        const hasTextIndex = indexes.some(idx => Object.values(idx.key).includes('text'));
        if (hasTextIndex) {
          console.log(`    💡 Optimization Tip: Text search indexes found. Search will be extremely fast!`);
        } else {
          console.log(`    ⚠️ Warning: No text index found on products. Global text search might be slower on large catalogs.`);
        }
      }
    }

    // 4. Benchmark Query Performance
    console.log('\n--- 4. Benchmark Query Simulation ---');
    const productsCollection = db.collection('products');
    const queryStart = Date.now();
    
    // Simulate fetching products with sorting/filtering
    const sampleProducts = await productsCollection.find({}).limit(20).toArray();
    const queryLatency = Date.now() - queryStart;
    
    console.log(`Sample fetch (20 products):`);
    console.log(`- Query Latency: ${queryLatency}ms`);
    console.log(`- Retrieved count: ${sampleProducts.length} items`);
    
    if (queryLatency < 10) {
      console.log('🚀 Performance Status: EXCELLENT (<10ms)');
    } else if (queryLatency < 50) {
      console.log('⚡ Performance Status: GOOD (<50ms)');
    } else {
      console.log('⚠️ Performance Status: SLOW (>50ms) - Consider indexing or optimizing!');
    }

    console.log('\n==================================================');
    console.log('✅ Diagnostics completed successfully!');
    console.log('==================================================');

  } catch (error) {
    console.error('\n❌ Diagnostics failed:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

runPerformanceCheck();
