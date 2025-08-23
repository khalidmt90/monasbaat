process.env.TEST_MODE = 'true';
// Always force test DB (overwrite any existing)
process.env.DATABASE_URL = 'file:./prisma/test.db';

import { prisma } from '@/lib/prisma';

async function applyPragmas(){
	try { await prisma.$executeRawUnsafe('PRAGMA journal_mode=WAL;'); } catch{}
	try { await prisma.$executeRawUnsafe('PRAGMA foreign_keys=ON;'); } catch{}
}

async function pushSchema(){
	const { execSync } = await import('node:child_process');
	execSync('npx prisma db push',{ stdio:'inherit' });
}

async function seedOnce(){
	// Lightweight distributed lock so only one worker seeds (others wait/poll)
	let haveLock = false;
	try {
		await prisma.globalConfig.create({ data:{ key:'__seed_lock__', value:{ ts: Date.now() } } });
		haveLock = true;
	} catch { /* another worker won the race */ }
	if(!haveLock){
		// Poll until meta row appears or timeout
		for(let i=0;i<40;i++){
			const meta = await prisma.globalConfig.findUnique({ where:{ key:'__test_meta__' } });
			if(meta) return; // seeded
			await new Promise(r=>setTimeout(r,50));
		}
		return; // give up but avoid crashing
	}

	await prisma.$transaction(async (tx:any)=>{
		const userA = await tx.user.upsert({ where:{ email:'userA@test.local' }, update:{}, create:{ email:'userA@test.local', password:'x', role:'USER' } });
		const userB = await tx.user.upsert({ where:{ email:'userB@test.local' }, update:{}, create:{ email:'userB@test.local', password:'x', role:'USER' } });
		const superAdmin = await tx.user.upsert({ where:{ email:'super@test.local' }, update:{}, create:{ email:'super@test.local', password:'x', role:'SUPER_ADMIN' } });
		const hall = await tx.hall.upsert({ where:{ slug:'seed-hall' }, update:{}, create:{ slug:'seed-hall', name:'Seed Hall', city:'Riyadh', basePrice:1000, sessions:[], amenities:[], images:[], isVerified:true } });
		// Create a unique future slot; ignore conflict if exists
		try { await tx.hallSlot.create({ data:{ hallId: hall.id, date:new Date(Date.now()+86400000), startTime:'18:00', endTime:'22:00', status:'open' } }); } catch{}
		await tx.globalConfig.upsert({ where:{ key:'feature_flags' }, update:{ value:{ otp:true, services:true }}, create:{ key:'feature_flags', value:{ otp:true, services:true }} });
		await tx.globalConfig.upsert({ where:{ key:'bank.transfer.settings' }, update:{ value:{ beneficiary:'Company Name', iban:'SA00 TEST IBAN', bankName:'Sample Bank', instructions:'Pay with ref', deadlineHours:1, tolerancePercent:0 } }, create:{ key:'bank.transfer.settings', value:{ beneficiary:'Company Name', iban:'SA00 TEST IBAN', bankName:'Sample Bank', instructions:'Pay with ref', deadlineHours:1, tolerancePercent:0 } }});
		await tx.globalConfig.upsert({ where:{ key:'vat_percent' }, update:{ value:{ percent:15 }}, create:{ key:'vat_percent', value:{ percent:15 }} });
		for(const key of ['order_ref','invoice_no']){ await tx.counter.upsert({ where:{ key }, update:{}, create:{ key, value:0 } }); }
		await tx.globalConfig.upsert({ where:{ key:'__test_meta__' }, update:{ value:{ userA:userA.id, userB:userB.id, superAdmin:superAdmin.id, hall:hall.id } }, create:{ key:'__test_meta__', value:{ userA:userA.id, userB:userB.id, superAdmin:superAdmin.id, hall:hall.id } }});
	});
}

async function init(){
	await pushSchema();
	await applyPragmas();
	await seedOnce();
}
await init();

export async function getSeedIds(){
	const meta = await prisma.globalConfig.findUnique({ where:{ key:'__test_meta__' } });
	return (meta?.value||{}) as any;
}
