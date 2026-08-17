/** Browser entry for DeepSeek-office. */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import { createRoot } from 'react-dom/client'
import { OfficeApp } from './OfficeApp.tsx'
import styles from './Office.module.css'

export const inject = ['sessions']

type OfficeWindow = Window & {
  __deepseekOfficeCleanup?: () => void
}

export function apply(ctx: ClientContext): void {
  const officeWindow = window as OfficeWindow

  // Hot reloads / repeated plugin applies should never leave two offices mounted.
  // Calling the previous cleanup unmounts React cleanly before replacing the host.
  officeWindow.__deepseekOfficeCleanup?.()

  const staleHost = document.querySelector<HTMLElement>('[data-deepseek-office-host]')
  staleHost?.remove()

  const host = document.createElement('div')
  host.dataset.deepseekOfficeHost = ''
  host.className = styles.pluginHost ?? ''
  document.body.appendChild(host)

  const root = createRoot(host)
  root.render(<OfficeApp ctx={ctx} />)

  let cleaned = false
  const cleanup = () => {
    if (cleaned) return
    cleaned = true
    root.unmount()
    host.remove()
    if (officeWindow.__deepseekOfficeCleanup === cleanup) {
      delete officeWindow.__deepseekOfficeCleanup
    }
  }

  officeWindow.__deepseekOfficeCleanup = cleanup
  ctx.effect(() => cleanup, 'deepseek-office: visual office')
}
