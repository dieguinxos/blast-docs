-- Copy these entries INSIDE ox_inventory/data/items.lua, not as a replacement file.
-- Copy INSTALL ME/images/*.png to ox_inventory/web/images/.
-- BLAST consumes only after confirmed installation. Designs require BLAST-issued metadata.
['blast_charm'] = {label='Weapon charm',weight=50,stack=false,close=true,consume=0,allowArmed=true,client={image='blast_charm.png'},server={export='blast_accessories.UseAccessory'}},
['blast_sling'] = {label='Weapon sling',weight=150,stack=false,close=true,consume=0,allowArmed=true,client={image='blast_sling.png'},server={export='blast_accessories.UseAccessory'}},
['blast_laser'] = {label='Weapon laser',weight=100,stack=false,close=true,consume=0,allowArmed=true,client={image='blast_laser.png'},server={export='blast_accessories.UseAccessory'}},
['blast_banner'] = {label='Weapon banner',weight=80,stack=false,close=true,consume=0,allowArmed=true,client={image='blast_banner.png'},server={export='blast_accessories.UseAccessory'}},
