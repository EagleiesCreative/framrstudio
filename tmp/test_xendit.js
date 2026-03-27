const fetch = require('node-fetch');

async function test() {
  const encodedKey = Buffer.from('xnd_development_roE9qFwGQtkzi9SFVOBBkZ5b5aEXbnYtCIOkpsMap5B15D9I0EOjKBe4IKw' + ':').toString('base64');
  try {
    const res = await fetch('https://api.xendit.co/recurring/plans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${encodedKey}`
      },
      body: JSON.stringify({
        reference_id: `test-sub-1234-${Date.now()}`,
        recurring_action: 'PAYMENT',
        currency: 'IDR',
        amount: 15000,
        schedule: {
          reference_id: `test-schedule-1234-${Date.now()}`,
          interval: 'MONTH',
          interval_count: 4,
          total_retry: 3
        },
        immediate_action_type: 'PAYMENT',
        success_return_url: 'https://example.com/success',
        failure_return_url: 'https://example.com/failure'
        // ignoring customer_id or items just to see what the general response shape is
      })
    });
    
    const text = await res.text();
    console.log("Xendit status:", res.status);
    console.log("Xendit JSON:", text);
  } catch (err) {
    console.error(err);
  }
}

test();
