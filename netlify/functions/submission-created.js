/**
 * Customer auto-reply.
 *
 * Netlify Forms handles the farm's copy of the email on its own (Site settings > Forms >
 * Form notifications). It cannot, however, reply to whoever submitted the form — so this
 * function hooks Netlify's `submission-created` event and sends the customer a receipt
 * through Resend.
 *
 * The filename is the contract: Netlify fires a function named `submission-created` after
 * every verified (non-spam) form submission. Renaming it turns the auto-reply off.
 *
 * Env vars (Site settings > Environment variables):
 *   RESEND_API_KEY  required — no key, no auto-reply (the submission itself still goes through)
 *   MW_FROM_EMAIL   optional — defaults to Resend's shared test sender, which can only
 *                   deliver to your own Resend account address. Set this to an address on a
 *                   domain verified in Resend before going live.
 */

const FARM_EMAIL = 'millerwagyu@gmail.com';
const FARM_PHONE = '608.386.4670';
const DEFAULT_FROM = 'Miller Wagyu Farms <onboarding@resend.dev>';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const esc = (s) =>
  String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Returns 200 in every path: a failed auto-reply must never look like a failed order. */
const ok = (body) => ({ statusCode: 200, body });

exports.handler = async (event) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return ok('RESEND_API_KEY not set — skipping auto-reply');

  let data;
  try {
    data = (JSON.parse(event.body).payload || {}).data || {};
  } catch (err) {
    console.error('Unparseable submission payload', err);
    return ok('bad payload');
  }

  const to = String(data.email || '').trim();
  if (!EMAIL_RE.test(to)) return ok('no usable email on submission — skipping auto-reply');

  const first = String(data['first-name'] || '').trim() || 'there';
  const interest = String(data.interest || '').trim();
  const message = String(data.message || '').trim();
  const boxItems = String(data['box-items'] || '').trim();
  const boxTotal = String(data['box-total'] || '').trim();

  const itemsHtml = boxItems
    ? `<p style="margin:24px 0 8px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#8a6a2f">What you asked about</p>
       <ul style="margin:0;padding-left:20px;color:#2f2f2f;line-height:1.8">
         ${boxItems.split('\n').map((l) => `<li>${esc(l)}</li>`).join('')}
       </ul>
       ${boxTotal ? `<p style="margin:10px 0 0;color:#2f2f2f"><strong>Estimated total: ${esc(boxTotal)}</strong><br>
       <span style="font-size:13px;color:#6b6b6b">Final pricing is by actual weight.</span></p>` : ''}`
    : '';

  const html = `
  <div style="font-family:Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#2f2f2f">
    <p style="margin:0 0 4px;font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#8a6a2f">Miller Wagyu Farms</p>
    <h1 style="margin:0 0 18px;font-size:26px;font-weight:600">Thanks, ${esc(first)}!</h1>
    <p style="line-height:1.7;margin:0 0 14px">
      We got your message and it's sitting in our inbox right now. Steve or Catherine will get
      back to you personally — usually within a day or two.
    </p>
    ${interest ? `<p style="margin:0 0 6px"><strong>Interested in:</strong> ${esc(interest)}</p>` : ''}
    ${itemsHtml}
    ${message ? `<p style="margin:24px 0 8px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#8a6a2f">Your message</p>
      <blockquote style="margin:0;padding:12px 16px;border-left:3px solid #c99440;background:#faf7f1;white-space:pre-wrap;line-height:1.7">${esc(message)}</blockquote>` : ''}
    <p style="line-height:1.7;margin:26px 0 0">
      Need us sooner? Reply to this email or call Steve at ${FARM_PHONE}.
    </p>
    <p style="margin:26px 0 0;font-size:13px;color:#6b6b6b;line-height:1.7">
      Miller Wagyu Farms &middot; W3402 Jungen Rd, La Crosse, WI 54601<br>
      Family raised American Wagyu from the coulee region.
    </p>
  </div>`;

  const text = [
    `Thanks, ${first}!`,
    '',
    "We got your message and it's sitting in our inbox right now. Steve or Catherine will get back to you personally — usually within a day or two.",
    interest ? `\nInterested in: ${interest}` : '',
    boxItems ? `\nWhat you asked about:\n${boxItems}` : '',
    boxTotal ? `Estimated total: ${boxTotal} (final pricing is by actual weight)` : '',
    message ? `\nYour message:\n${message}` : '',
    `\nNeed us sooner? Reply to this email or call Steve at ${FARM_PHONE}.`,
    '',
    'Miller Wagyu Farms · W3402 Jungen Rd, La Crosse, WI 54601'
  ].filter(Boolean).join('\n');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.MW_FROM_EMAIL || DEFAULT_FROM,
        to: [to],
        reply_to: FARM_EMAIL,
        subject: 'We got your message — Miller Wagyu Farms',
        html,
        text
      })
    });
    if (!res.ok) {
      console.error('Resend rejected the auto-reply:', res.status, await res.text());
      return ok('auto-reply failed');
    }
  } catch (err) {
    console.error('Auto-reply request threw', err);
    return ok('auto-reply errored');
  }

  return ok('auto-reply sent');
};
