import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
export const runtime = 'nodejs'
export const alt = 'Cozy Health ? care that stays with you'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export default async function Image() {
 const logo = await readFile(join(process.cwd(), 'public/logo.png'))
 return new ImageResponse(<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 80, width: '100%', height: '100%', background: '#f4f7fc', color: '#034dae' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: 42 }}><img src={'data:image/png;base64,' + logo.toString('base64')} width="90" height="90" alt="" />Cozy Health</div>
 <div style={{ fontSize: 76, fontWeight: 700, marginTop: 40, lineHeight: 1.1 }}>Care that stays with you.</div>
 <div style={{ fontSize: 28, marginTop: 32 }}>Reflect. Track your mood. Connect with care.</div>
 </div>, size)
}
