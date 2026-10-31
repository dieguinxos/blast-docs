-- ESX/Qbox: qs-inventory/shared/items.lua. QBCore: qb-core/shared/items.lua.
-- Copy only the blast_clogs entry; do not replace your existing registry.
return {
    ['blast_clogs'] = {
        name = 'blast_clogs', label = 'Custom clogs', weight = 500, type = 'item',
        image = 'blast_clogs.png', unique = true, useable = true, shouldClose = true,
        description = 'A unique pair of customized clogs.',
    },
}
