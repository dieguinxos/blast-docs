# BLAST Clog Creator — API 1.0.0

Server and client exports live on `exports.blast_clog_creator`. API versioning is
independent of the resource version. Existing grant/equip/transfer calls remain
compatible. `GrantAccessory` remains as a deprecated export and returns
`catalog_included`: charms belong to the saved design, not separate inventory items.

`ProductionMode=true` is the default. It disables AdminTestAccess, public creation
and diagnostic tools even when legacy SQL settings requested them. Startup persists
safe access settings with revision checking, preserving shops/prices/pairs. Admin
settings/API cannot reopen test access or diagnostics (`production_locked`); an owner
must explicitly change config.lua for an isolated test server. This access mode
does not certify the remaining commercial, compatibility or processed-Escrow gates.

## Start here

```lua
local api = exports.blast_clog_creator
local info = api:GetApiInfo()
if not info.ok or not info.data.ready then return end
local opened = api:OpenShop(playerSource)
```

Results are `{ok=true,data=...}` or `{ok=false,code='stable_code',message=...}`.
Only `ok` and `code` are contractual on errors; do not parse log text. All exports
can fail. Check `ok` before reading `data`. Calls that read/write SQL may yield.
Server exports are privileged APIs for trusted resources, not client endpoints.
Never proxy arbitrary export names, grants, settings or callbacks to NUI/net events.

Declare `dependency 'blast_clog_creator'` and start the framework/inventory first.
Exports become available when the resource scripts load; the database can still
be initializing. Check `GetApiInfo().data.ready` or listen to the **local server**
event `blast_clogs:apiReady`. Register adapters again when the Creator restarts.
The optional resource in `INSTALL ME/examples/blast_clog_bridge` demonstrates this.

## Read APIs (server)

- `GetApiInfo()` — version, readiness, export names, registered adapter capabilities
  and registry/page limits. Does not expose callback functions or credentials.
- `GetCapabilities()` — detected framework, inventory, ownership mode and actual
  release/compatibility status. Development readiness is not a sale certification.
- `GetCatalog()` — copied public catalog entries and actual tint/emission capabilities.
- `GetPublicSettings()` — the public settings whitelist. No permission secrets.
- `GetShops()` — a copy of configured shop locations and access restrictions.
- `GetPairs(source, {limit=20, offset=0})` — paginated SQL-owned pair summaries:
  `items={id,revision,createdAt,pending}`, `offset`, `hasMore`, optional `nextOffset`.
  Limit is 1–50, offset 0–100000. No image payloads or item tokens in list results.
  A listed pair may have a missing inventory item; use `GetPair`/`OwnsPair` to
  check current possession and pending reservations before offering an action.
- `GetPair(source, pairId)` — `{id,revision,design,pending,createdAt}` after current
  ownership, inventory metadata and reservation checks. No item security token.
- `OwnsPair(source, pairId)` — `{owned=true/false,reason=...}`. A failed possession
  or reservation check produces `owned=false`; malformed input produces an error.
- `GetEquippedPair(source)` — `{equipped=false}` or
  `{equipped=true,pair=<GetPair DTO>,renderRevision=...}`. This is the server's
  authorized equipment; local clothing-editor visibility can differ.
- `GetOperation(source, requestId)` — the current character's operation ID, request
  ID, action, state, stage, saved result and updated time. No raw operation payload,
  character identifier or token. A missing row returns `operation_not_found`.
- `ValidateDesign(design)` — normalized `{design=...}` using the real catalog and
  PNG limits. This validates format/content, not ownership or shop permission.

Every source is a connected integer player source. Ownership resolves through the
current stable character ID. Do not store the temporary player source as an owner.
Returned DTOs are detached from internal state. Do not call SQL-backed reads per
frame; fetch on menu open, on demand or after relevant events.

## Editor entry points (server)

- `OpenCustomizer(source, {pairId=optional,mode='customize'})` — rearrangement editor.
- `OpenShop(source, {pairId=optional})` — shopping flow with current location rules.
- `OpenAdmin(source)` — the single three-option admin panel, with normal permissions.
- `CloseCustomizer(source)` — requests normal animated close and input cleanup.
- `RefreshPlayer(source)` — restores equipment for the current character from SQL.
- `ClearPlayerState(source)` — closes the editor and clears replicated equipment
  and session only. Does not delete pairs or unequip the saved SQL character.
  Use on character logout, then `RefreshPlayer` after the new character is ready.

`OpenCustomizer` additionally accepts `mode='shop'` or `'admin_hub'` with the same
permission checks as their dedicated entry points. Optional pair IDs must be owned.
An open/close result `{requested=true}` acknowledges delivery of the request;
FiveM may reject opening if the player is dead, in a vehicle or already editing.
The client `GetCustomizerState` reports the actual local editor state.
Opening the shop does not charge, grant access remotely or bypass job/radius rules.

## Mutations (server)

Mutations require a unique `requestId` of 8–80 alphanumeric/underscore/hyphen
characters. Reuse the **same ID and same input** after a transport interruption.
Reusing an ID with different input returns `request_conflict`.

```lua
local granted = api:GrantPair(playerSource, {
    requestId = 'quest_reward_1234', -- durable business ID, never a frame counter
    design = optionalValidatedDesign,
})
if not granted.ok then return end
local equipped = api:EquipPair(playerSource, {
    pairId = granted.data.pairId, requestId = 'quest_equip_1234',
})
```

- `GrantPair(source, {requestId,design?})` — trusted free grant, creates unique SQL
  pair/item. Does not charge. Does not automatically equip; use `EquipPair` after success.
- `PurchasePair(source, {requestId,design?})` — same creation with current configured
  server price, account, shop checks and payment. Client-supplied prices are ignored.
  Returns `{pairId,revision}`. Replays retain the originally recorded price even
  after a configuration change. It does not automatically equip.
- `EquipPair(source, {pairId,requestId})` — validates ownership and current item token.
- `UnequipPair(source, {requestId})` — unequips the current saved character.
- `TransferPair(source, targetSource, {pairId,requestId})` — inventory mode only;
  transfers ownership/composition and rotates the token. Call **before** physically
  moving the item; the operation performs the inventory effects itself. Server
  callers must enforce their own proximity, recipient-consent and business rules.
- `QuoteDesign(source, {pairId,design})` — normalized quote with server amount,
  currency, current revision, pair ID and design; does not mutate or reserve money.
- `SaveDesign(source, {pairId,revision,design,amount,requestId})` — pass the exact
  quote fields plus requestId. Revalidates current rules and revision before saving.
  Normal shop/outside-shop edit restrictions remain in force. No admin bypass.

```lua
local quote = api:QuoteDesign(source, {pairId=id, design=editedDesign})
if not quote.ok then return end
local payload = quote.data
payload.requestId = 'edit_transaction_1234'
local saved = api:SaveDesign(source, payload)
```

Opening a real shop creates its normal session. With no configured locations, a
server script that needs shopping edits should open `OpenShop`, not fabricate a
session or call a grant in place of a purchase. Outside-shop editing still only
rearranges/orients installed charms according to the player's rules.

An `operation_pending` result means an external effect might have succeeded without
a reliable acknowledgement. Preserve the operation; inspect `GetOperation`. Do not
retry with a new ID, deliver replacement items or refund automatically. There is
intentionally no unrestricted API to mark pending operations completed or delete SQL.
A rejected hook is also recorded: retrying the same denied ID replays that denial.

## Settings, catalog and images (server)

- `GetAdminSettings(source)` — current revision, editable schema, values, detected
  integrations and fields that require restart. Requires normal admin permission.
- `SaveSettings(source, {revision,patch,requestId})` — same validated revision-checked
  path as the admin UI. Only schema keys, Shops and Catalog are writable. Structural
  locks and the real-ACE check when disabling test mode still apply. Does not restart.
- `UpdateCatalogEntry(source, {revision,id,entry={enabled,name,collection},requestId})`
  — same permission/revision checks as the panel. Hiding preserves existing designs.
- `ImportImage(source, url)` — uses the existing secure URL downloader, cache,
  frequency/size/resolution limits. Requires shop/creator access. Returns `{image}`
  as the accepted PNG data URI for a design; it does not publish a charm model.

```lua
local current = api:GetAdminSettings(adminSource)
if current.ok then
    local saved = api:SaveSettings(adminSource, {
        revision=current.data.revision,
        patch={PairPrice=250}, requestId='price_update_1234',
    })
end
```

Changes remain subject to schema maxima. A revision conflict requires reloading
and reviewing new settings; never silently overwrite another administrator's work.
The API does not accept SQL fragments, arbitrary file paths, hashes or shaders.
Custom charm compilation/publication continues through the admin creator flow.

## Runtime adapters (server)

`RegisterAdapter(name, callbacks)` adds selected integration overrides from another
resource. `UnregisterAdapter(name)` removes only that resource's named adapter.
Callbacks are direct server Lua functions (JS exports can supply function refs).
They cannot be installed through a network event. Registration is atomic: one
provider per callback key, no silent override of another resource. Conflicts return
`adapter_conflict`. Registered providers take precedence over editable
`integrations/custom.lua`; unspecified callbacks retain existing built-in behavior.

Recognized callback contracts:

- `identity(source) -> stableCharacterString or nil`. The resource prefixes it with
  `custom:`. Keep it stable across reconnects/restarts, unique per character and
  at most 153 bytes. Never derive it from client state or return an empty value.
- `framework() -> 'qb'|'qbx'|'esx'|'standalone'|'custom'`.
- `inventory() -> 'ox'|'qb'|'qs'|'none'|'custom'`. Return `custom`, not `none`, for a
  custom inventory in inventory ownership mode. Setting this alone is not a bridge.
- `job(source) -> jobName, integerMinimumGrade`.
- `balance(source, account) -> number`.
- `debit(source, account, amount, operationId) -> true|false|nil`.
- `items(source) -> table of inventory slot items`.
- `slot(source, slotNumber) -> inventorySlotItem or nil`.
- `canCarry(source,itemName,metadata) -> true|false|nil`.
- `add(source,itemName,metadata) -> true|false|nil` (one unique pair).
- `remove(source,inventorySlotItem) -> true|false|nil` (one unique pair).
- `setMetadata(source,inventorySlotItem,metadata) -> true|false|nil`.
- `registerPairUse(itemName,callback) -> true`. Register your inventory's server
  usable-item handler; invoke `callback(source,{slot=actualSlot})` only after a real
  use. Creator rereads the server slot and validates its current pairId/token.
  Repeated registration should replace the previous handler, not stack listeners.
- `canShop(source) -> boolean`, `isAdmin(source) -> boolean`,
  `isCreator(source) -> boolean` — trusted policy overrides. Return strict booleans.
  `canShop` replaces built-in shop access, so enforce jobs, distance and player
  access yourself if overriding it. The real-admin ACE gate is never overridden.

Slot items require `name`, `slot`, and either `metadata` or `info`. Keep `pairId`
and `token` intact. A custom inventory normally needs inventory, items, slot,
canCarry, add, remove, setMetadata and registerPairUse together. Use the operation
ID in external ledgers when possible. Effects must return true only after confirmed
success, false on rejection and nil/throw on uncertain outcome. Never convert an
unknown result into success or silently retry money/inventory effects.

```lua
-- Adapt these to your inventory's REAL server API; this is a contract skeleton.
local result = api:RegisterAdapter('my_inventory', {
    inventory=function() return 'custom' end,
    items=myInventoryItems, slot=myInventorySlot,
    canCarry=myCanCarry, add=myAddUniquePair, remove=myRemoveUniquePair,
    setMetadata=mySetMetadata, registerPairUse=myRegisterUsableItem,
})
if not result.ok then print(result.code) end
```

Up to 8 adapters per resource, 64 total. Callback lookup is cached; no polling or
per-frame registration. Adapters/hooks are removed automatically when their owning
resource stops. Unregister also removes them explicitly. Providers must clean up
their own inventory callbacks. Re-register after Creator restarts. Register your
character identity before exposing players to the product. Replacing the identity
scheme on existing SQL data requires an explicit data migration; stopping a provider
can fall back to built-ins and temporarily make custom-owned pairs unavailable.

## Hooks and local server events

`RegisterHook('beforeOperation'|'afterOperation', callback)` returns `{hookId}`.
`RemoveHook(hookId)` can remove only a hook registered by the calling resource.
There are at most 8 hooks per resource / 64 total. Hooks run in registration order.
Each receives its own copy of:

```lua
{source, action, requestId, operationId, pairId?, amount?, result?}
```

No image blobs, security token, destination identity or raw character identifier
is included. Resolve additional business data inside your trusted server resource.

- **beforeOperation** runs after idempotency/replay checks and before effects. Return
  false to deny (`integration_denied`); nil/true allows. Exceptions fail closed
  (`integration_error`). It runs under the character lock: keep it fast, do not
  yield, perform network I/O, mutate context or recursively start another operation.
- **afterOperation** runs asynchronously after the durable outcome is written (or
  left pending). `result` is the actual outcome, not an assumption of success.
  Return values cannot roll back the operation. Errors are logged without changing
  it. Events are **not replayed** for an already completed request.

Hooks are notifications/policies, not durable exactly-once job delivery. A process
crash can occur between commit and notification. Use operation IDs for deduplicating
webhooks or rewards; reconcile through `GetOperation`, never use a notification as
proof that an unrelated payment succeeded. The async notification queue has one worker and a maximum of 128 waiting outcomes.
Overflow drops new notifications, logs a warning and increments the counter exposed
by GetApiInfo; the persisted operation is unaffected. It is not a persistent message
broker. Keep callbacks short and forward slow work to your own bounded job queue.

```lua
local hook = api:RegisterHook('beforeOperation', function(ctx)
    if ctx.action=='purchase_pair' then return IsPlayerAceAllowed(ctx.source,'myshop.buy') end
end)
```

Local events (listen with `AddEventHandler`, not `RegisterNetEvent`):

- `blast_clogs:apiReady({apiVersion,resource})` — SQL/settings/catalog ready.
- `blast_clogs:operationFinished(context)` — same asynchronous outcome notification.
- `blast_clogs:equippedChanged({source,pairId?,equipped,revision})` — replicated
  equipment changes, including restore/clear. Not proof of a new purchase.
- `blast_clogs:adapterChanged(resource,name?)` — provider registry changed.

Hooks cover operations using the durable service, including grants, purchases,
equip/unequip, transfer, confirmation and admin settings/catalog saves. They do not
intercept read exports, compiler internals or arbitrary events in other resources.

## Client API and appearance editors

- `GetCustomizerState()` — `{open,mode?,closing,selectingLocation}`.
- `CloseCustomizer()` — normal animated close with cleanup; no server mutation.
- `GetLocalClogs()` — `{equipped,hidden,state?}` copied authorized descriptor. It
  does not attest ownership and may differ from locally visible clothing.
- `SetClogsHidden(boolean)` — hides the local player's normal clog props for the
  calling resource only, without changing ownership/equipment on the server.
  Multiple resources can hold a hide request; all must release it to show the pair.
  Requests are automatically released if their resource stops. The editor preview
  is independent. This is client-local and does not hide clogs for other players.
- `RefreshClogs()` — requests local renderer refresh and clears the suppression
  caused by a clothing change. Use only if the player's outfit should retain clogs;
  calling it after they deliberately chose other shoes would override that choice.

```lua
-- In the appearance editor resource, around its actual lifecycle:
exports.blast_clog_creator:SetClogsHidden(true)
-- ... the player edits clothes ...
exports.blast_clog_creator:SetClogsHidden(false)
-- Optional only if retaining clogs:
exports.blast_clog_creator:RefreshClogs()
```

Client API has no grant, money, identity, admin or arbitrary-model authority.
No callbacks, entities or render loops are added for inactive integrations.

## Errors and verification

Integration-specific codes: `invalid_adapter`, `adapter_exists`, `adapter_limit`,
`adapter_conflict`, `adapter_not_found`, `invalid_hook`, `hook_limit`,
`hook_not_found`, `integration_denied`, `integration_error`, `operation_not_found`.
Existing codes include `database_unavailable`, `character_unavailable`, `not_owned`,
`pair_item_missing`, `operation_pending`, `operation_busy`, `invalid_request_id`,
`request_conflict`, `revision_conflict`, `insufficient_funds`, `quote_changed`,
`inventory_full`, `invalid_design`, `invalid_image`, `forbidden`, `shop_access`.

Automated tests use simulated SQL/inventories/FiveM natives. A custom bridge must
be checked against its installed version: two distinct pair items, failed/unknown
inventory result, insufficient funds, retry with the same ID, character switch,
provider/Creator restart, transfer and full inventory. Neither a method's existence
nor a successful mock certifies every third-party inventory/framework combination.
