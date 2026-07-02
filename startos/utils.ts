import { sdk } from './sdk'

export const port = 5225

/**
 * The `main` volume is mounted wholly at /data (HOME). Everything SimpleX lives
 * under /data/.simplex: the profile database and `store.json`, plus the image's
 * file dirs — `files` (received, `--files-folder`), `tmp` (`--temp-folder`), and
 * `outbound` (consumer-written, for the bridge to send). They are all siblings
 * on one filesystem, so simplex-chat's atomic tmp->files rename can't hit EXDEV.
 *
 * The file exchange contract (see README) is asymmetric:
 *
 *   inbound  — the WS reports received files by name only, which a consumer
 *              resolves against its own view of `.simplex/files`, so no shared
 *              path is required; the consumer mounts that subpath read-only.
 *   outbound — on send the consumer passes a path the bridge resolves *here*, so
 *              it must be valid in this container. We expose only the
 *              `.simplex/outbound` subpath at a neutral `/tmp/simplex-outbound`,
 *              so a consumer mounting the same path can pass
 *              `/tmp/simplex-outbound/...` verbatim without colliding with its
 *              own /data. The same neutral path is used by the standalone Docker
 *              image's docs, so a consumer's `outboundFolder` is identical in
 *              both deployments. The physical bytes still live at the
 *              `.simplex/outbound` subpath (backed up); `/tmp` is only the
 *              shared mountpoint, and suits transient staged sends.
 */
export const mainMounts = sdk.Mounts.of()
  .mountVolume({
    volumeId: 'main',
    subpath: null,
    mountpoint: '/data',
    readonly: false,
  })
  .mountVolume({
    volumeId: 'main',
    subpath: '.simplex/outbound',
    mountpoint: '/tmp/simplex-outbound',
    readonly: false,
  })
