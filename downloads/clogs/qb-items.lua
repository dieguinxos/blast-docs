-- Copy the blast_clogs entry into qb-core/shared/items.lua; do not replace that file.
return {
    ['blast_clogs'] = {
        name = 'blast_clogs', label = 'Custom clogs', weight = 500, type = 'item',
        image = 'blast_clogs.png', unique = true, useable = true, shouldClose = true,
        description = 'A unique pair of customized clogs.',
    },
}
