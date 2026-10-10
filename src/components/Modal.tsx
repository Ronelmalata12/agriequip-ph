import { t } from '../lib/language'
import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { Icon } from './Icon'

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  useEffect(() => {
    const dialog = ref.current
    const previousOverflow = document.body.style.overflow
    dialog?.showModal()
    document.body.style.overflow = 'hidden'
    return () => { dialog?.close(); document.body.style.overflow = previousOverflow }
  }, [])
  return <dialog ref={ref} className="modal" aria-labelledby={titleId} onClose={() => { if (!ref.current?.open) onClose() }} onClick={(event) => {
    if (event.target !== event.currentTarget) return
    const rect = event.currentTarget.getBoundingClientRect()
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) ref.current?.close()
  }}>
    <div className="modal-header"><h2 id={titleId}>{title}</h2><button className="icon-button" aria-label={t("Close dialog")} onClick={() => ref.current?.close()}><Icon name="close" /></button></div>
    <div className="modal-content">{children}</div>
  </dialog>
}
