// node reset.test.js
// Tests token detection and form validation logic for reset.html
// Run with: node dashboard/reset.test.js

let passed = 0
let failed = 0

function assert(condition, label) {
  if (condition) {
    console.log(`  PASS  ${label}`)
    passed++
  } else {
    console.error(`  FAIL  ${label}`)
    failed++
  }
}

// ─── Simulate the URL parsing logic from reset.html ──────────────────────────
// Mirrors the production code: capture hash before createClient, then use
// accessToken + tokenType directly (not a boolean hasHashToken).

function parseUrl(search, hash) {
  const query       = new URLSearchParams(search)
  const hashParams  = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash)
  return {
    code:         query.get('code'),
    accessToken:  hashParams.get('access_token'),
    refreshToken: hashParams.get('refresh_token') || '',
    tokenType:    hashParams.get('type'),
  }
}

function resolveFlow({ code, accessToken, tokenType }) {
  if (code) return 'pkce'
  if (accessToken && tokenType === 'recovery') return 'implicit'
  return 'none'
}

// ─── Suite 1: Token detection — implicit flow ─────────────────────────────────

console.log('\nSuite 1: Token detection — hash URL (implicit flow)')

const implicitHash = '#access_token=eyJfoo&expires_at=9999999999&expires_in=3600&refresh_token=abc123&sb=&token_type=bearer&type=recovery'

const r1 = parseUrl('', implicitHash)
assert(r1.accessToken === 'eyJfoo',   'captures access_token from hash')
assert(r1.refreshToken === 'abc123',  'captures refresh_token from hash')
assert(r1.tokenType === 'recovery',   'captures type=recovery from hash')
assert(resolveFlow(r1) === 'implicit','resolves to implicit flow')

// Simulate what happens if hash is read AFTER Supabase clears it
const r2 = parseUrl('', '')
assert(resolveFlow(r2) === 'none',    'cleared hash → no flow detected (the old bug, now avoided by early capture)')

// ─── Suite 2: Token detection — PKCE flow ────────────────────────────────────

console.log('\nSuite 2: Token detection — query param URL (PKCE flow)')

const r3 = parseUrl('?code=abc123xyz', '')
assert(r3.code === 'abc123xyz',       'captures code from query string')
assert(resolveFlow(r3) === 'pkce',    'resolves to PKCE flow')

const r4 = parseUrl('', '')
assert(resolveFlow(r4) === 'none',    'bare URL → no token found')

// ─── Suite 3: type= value must equal 'recovery' exactly ──────────────────────

console.log('\nSuite 3: type= value must be exactly "recovery"')

assert(resolveFlow(parseUrl('', '#access_token=foo&type=signup'))  === 'none', 'type=signup → not recovery flow')
assert(resolveFlow(parseUrl('', '#access_token=foo'))              === 'none', 'missing type → not recovery flow')
assert(resolveFlow(parseUrl('', '#type=recovery'))                 === 'none', 'missing access_token → not recovery flow')

// ─── Suite 4: Form validation logic ──────────────────────────────────────────

console.log('\nSuite 4: Form validation')

function validateForm(pw, pw2, sessionReady) {
  if (!sessionReady) return 'Still verifying token, please wait a moment.'
  if (!pw || pw.length < 8) return 'Password must be at least 8 characters.'
  if (pw !== pw2) return 'Passwords do not match.'
  return null // valid
}

assert(validateForm('', '', false)             === 'Still verifying token, please wait a moment.', 'blocks submit before session ready')
assert(validateForm('short', 'short', true)    === 'Password must be at least 8 characters.',     'rejects password < 8 chars')
assert(validateForm('password1', 'password2', true) === 'Passwords do not match.',               'rejects mismatched passwords')
assert(validateForm('validpass', 'validpass', true) === null,                                    'accepts matching passwords ≥ 8 chars')
assert(validateForm('', '', true)              === 'Password must be at least 8 characters.',     'rejects empty password when session ready')

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log(`\n${'─'.repeat(50)}`)
console.log(`  ${passed} passed, ${failed} failed`)
if (failed > 0) {
  console.error(`  Tests failed.\n`)
  process.exit(1)
} else {
  console.log(`  All tests passed.\n`)
}
