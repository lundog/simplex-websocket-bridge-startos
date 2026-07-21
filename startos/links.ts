import { T } from '@start9labs/start-sdk'
import { T as SX } from '@simplex-chat/types'
import { i18n } from './i18n'

/**
 * Build result members for a SimpleX connection link (one-time invitation or
 * long-lived address). Both a short link (modern clients) and a full link
 * (older clients) are surfaced when present, each copyable and with a QR code.
 */
export function connLinkMembers(
  link: SX.CreatedConnLink,
): T.ActionResultMember[] {
  const members: T.ActionResultMember[] = []
  const short = link.connShortLink?.trim()
  const full = link.connFullLink?.trim()
  if (short) {
    members.push({
      type: 'single',
      name: i18n('Short Link (recommended)'),
      description: i18n(
        'Use this with modern SimpleX clients. Includes a QR code.',
      ),
      value: short,
      copyable: true,
      qr: true,
      masked: false,
    })
  }
  if (full) {
    members.push({
      type: 'single',
      name: i18n('Full Link (older clients)'),
      description: i18n(
        'Backup format for older SimpleX clients that do not understand short links.',
      ),
      value: full,
      copyable: true,
      qr: true,
      masked: false,
    })
  }
  return members
}
