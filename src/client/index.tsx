/** Browser entry for DeepSeek-office. */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import { createRoot } from 'react-dom/client'
import { OfficeApp } from './OfficeApp.tsx'
import styles from './Office.module.css'

export const inject = ['sessions']

export function apply(ctx: ClientContext): void {
  const host = document.createElement('div')
  host.dataset.deepseekOfficeHost = ''
  host.className = styles.pluginHost ?? ''
  document.body.appendChild(host)
  const root = createRoot(host)
  root.render(<OfficeApp ctx={ctx} />)
  ctx.effect(() => () => {
    root.unmount()
    host.remove()
  }, 'deepseek-office: visual office')
}
