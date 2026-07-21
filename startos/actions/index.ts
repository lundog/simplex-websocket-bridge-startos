import { sdk } from '../sdk'
import { configureClient } from './configureClient'
import { createInvitation } from './create-invitation'
import { viewAddress } from './view-address'
import { apiKeys } from './api-keys'
import { resetClient } from './reset-client'
import { resetAddress } from './reset-address'

export const actions = sdk.Actions.of()
  .addAction(configureClient)
  .addAction(createInvitation)
  .addAction(viewAddress)
  .addAction(apiKeys)
  .addAction(resetClient)
  .addAction(resetAddress)
