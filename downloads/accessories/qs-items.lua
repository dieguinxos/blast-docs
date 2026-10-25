-- QS on QB: merge into the item table used by your installed QS version.
-- QS on ESX: use the same fields only where the QS item schema accepts them.
-- These are item definitions, not an automatic inventory installer.
-- Copy INSTALL ME/images/*.png to your inventory image folder.
-- BLAST registers usable handlers. Do not add a second consuming handler.
['blast_charm'] = {name='blast_charm',label='Weapon charm',weight=50,type='item',image='blast_charm.png',unique=true,useable=true,shouldClose=true,description='Install on an equipped weapon'},
['blast_sling'] = {name='blast_sling',label='Weapon sling',weight=150,type='item',image='blast_sling.png',unique=true,useable=true,shouldClose=true,description='Install on an equipped long weapon'},
['blast_laser'] = {name='blast_laser',label='Weapon laser',weight=100,type='item',image='blast_laser.png',unique=true,useable=true,shouldClose=true,description='Install on an equipped weapon'},
['blast_banner'] = {name='blast_banner',label='Weapon banner',weight=80,type='item',image='blast_banner.png',unique=true,useable=true,shouldClose=true,description='Install a hanging cloth banner on an equipped weapon'},
