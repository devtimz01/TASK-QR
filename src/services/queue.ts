import {Queue} from 'bullmq'

export const inviteQueue= new Queue('checkInvite',{connection:{
             host:'127.0.0.1' as string,
             port: 6379 as number
         }});

/*(async () => {
  try {
    // Test low-level connection
    const client = await inviteQueue.client;
    console.log('✅ Redis connected:', client.status);

  } catch (err) {
    console.error('❌ Redis connection or queue error:', err);
  }
})();*/
