-- Copy the blast_clogs entry into ox_inventory/data/items.lua; do not replace that file.
return {
    ['blast_clogs'] = {
        label = 'Custom clogs', weight = 500, stack = false, close = true, consume = 0,
        server = { export = 'blast_clog_creator.UsePairItem' },
        buttons = {
            { label = 'Equip', action = function(slot) exports.blast_clog_creator:PairItemAction(slot, 'equip') end },
            { label = 'Customize charms', action = function(slot) exports.blast_clog_creator:PairItemAction(slot, 'customize') end },
            { label = 'Take off', action = function(slot) exports.blast_clog_creator:PairItemAction(slot, 'unequip') end },
        },
    },
}
