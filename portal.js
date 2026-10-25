/* Portal structure. Products own their guides and navigation. */
(() => {
const L=(en,es)=>({en,es});
const section=(id,en,es,bodyEn,bodyEs)=>({id,title:L(en,es),body:L(bodyEn,bodyEs)});
const guides=window.DOCS;
const guideIds=new Set(guides.map(page=>page.id));
for(const page of guides){
  page.product='boombox';
  for(const section of page.sections)for(const language of ['en','es'])
    section.body[language]=section.body[language].replace(/href="#([^"/]+)([^"]*)"/g,(match,id,tail)=>guideIds.has(id)?`href="#boombox/${id}${tail}"`:match);
}
const camera=window.CAMERA_DOCS;
const accessories=window.ACCESSORIES_DOCS;
window.PRODUCTS=[{id:'boombox',name:'Blast Boombox',icon:'speaker',version:'0.5.0',pages:guides},{id:'camera',name:'Blast Camera',icon:'camera',version:'0.1.0',pages:camera},{id:'accessories',name:'Blast Accessories',icon:'layers',version:'0.2.0-dev',pages:accessories}];
window.PORTAL_PAGES=[
 {id:'home',icon:'book',group:'general',title:L('Welcome to Blast Docs','Bienvenido a Blast Docs'),lead:L('Installation guides, configuration and answers for your Blast scripts. Choose a product to get started.','Guías de instalación, configuración y respuestas para tus scripts de Blast. Elige un producto para empezar.'),sections:[
  section('start','Find your guide','Encuentra tu guía',`<div class="cards"><a class="card" href="#getting-started"><span data-icon="download"></span><strong>Getting started</strong><p>Prepare your server, follow an installation guide and keep your resources up to date.</p></a><a class="card" href="#scripts"><span data-icon="code"></span><strong>Browse scripts</strong><p>Find the documentation for the product you are installing.</p></a></div>`,`<div class="cards"><a class="card" href="#getting-started"><span data-icon="download"></span><strong>Primeros pasos</strong><p>Prepara el servidor, sigue la instalación y mantén tus recursos actualizados.</p></a><a class="card" href="#scripts"><span data-icon="code"></span><strong>Explora los scripts</strong><p>Encuentra la documentación del producto que vas a instalar.</p></a></div>`),
  section('products','Script documentation','Documentación de scripts',`<div class="cards"><a class="card" href="#boombox/overview"><span data-icon="speaker"></span><strong>Blast Boombox</strong><p>Speakers, music, RadioCar and server administration. Explore all 15 guides.</p></a></div>`,`<div class="cards"><a class="card" href="#boombox/overview"><span data-icon="speaker"></span><strong>Blast Boombox</strong><p>Speakers, música, RadioCar y administración. Consulta sus 15 guías.</p></a></div>`),
  section('navigation','How to use these docs','Cómo usar estas docs','<p>Expand a script in the sidebar to see its guides. Use search to find a setting or feature across the documentation. Each guide has an index and copy buttons for code examples.</p><p>Use the language selector to switch between English and Spanish.</p>','<p>Despliega un script en el menú lateral para ver sus guías. Usa el buscador para encontrar un ajuste o función. Cada guía incluye un índice y botones para copiar los ejemplos.</p><p>Usa el selector de idioma para cambiar entre inglés y español.</p>')
 ]},
 {id:'getting-started',icon:'download',group:'general',title:L('Getting started','Primeros pasos'),lead:L('A few steps to prepare your server before installing a Blast resource.','Prepara tu servidor antes de instalar un recurso de Blast.'),sections:[
  section('choose','1. Choose your script','1. Elige tu script','<p>Open <a href="#scripts">Scripts</a> and select the product you own. Its installation guide lists the exact dependencies, startup order and integration steps for that resource.</p>','<p>Abre <a href="#scripts">Scripts</a> y selecciona tu producto. Su guía de instalación indica las dependencias, orden de inicio e integraciones concretas.</p>'),
  section('prepare','2. Prepare the server','2. Prepara el servidor','<p>Keep a backup of your server configuration and database. Identify the framework, inventory and versions installed on your server, then check the requirements in the selected script\'s guide.</p>','<p>Guarda una copia de la configuración y la base de datos. Identifica el framework, inventario y versiones que usas y comprueba los requisitos de la guía del script.</p>'),
  section('install','3. Follow the installation','3. Sigue la instalación','<p>Use the complete product distribution. Install the documented dependencies, add any inventory definitions and start resources in the specified order. Configure the public integration files according to the product guide.</p>','<p>Usa la distribución completa del producto. Instala las dependencias, añade las definiciones de inventario e inicia los recursos en el orden indicado. Configura las integraciones públicas según la guía.</p>'),
  section('check','4. Verify and get help','4. Comprueba y pide ayuda','<p>Complete the checks at the end of the installation guide. If something fails, open that script\'s troubleshooting page and include the version, reproduction steps and relevant console errors in your support request.</p><p>For a mistake in these docs, use the GitHub issue link below. Remove credentials and private tokens from shared logs.</p>','<p>Completa las comprobaciones de la guía. Si algo falla, consulta la solución de problemas del script e incluye versión, pasos y errores de consola al pedir soporte.</p><p>Para un error en las docs, usa el enlace de GitHub del pie. Retira las credenciales y tokens de los registros que compartas.</p>')
 ]},
 {id:'scripts',icon:'code',group:'general',title:L('Scripts','Scripts'),lead:L('Choose a Blast script to open its documentation. Each product has its own installation, features and configuration guides.','Elige un script de Blast. Cada producto tiene sus propias guías de instalación, funciones y configuración.'),sections:[
  section('available','Available documentation','Documentación disponible',`<div class="cards"><a class="card" href="#boombox/overview"><span data-icon="speaker"></span><strong>Blast Boombox</strong><p>Eight speaker models, vehicle audio and a complete music interface.</p><p><span class="bullet-tag">v0.5.0</span><span class="bullet-tag">15 guides</span></p></a></div><p>Expand a product under Scripts in the sidebar to open its guides.</p>`,`<div class="cards"><a class="card" href="#boombox/overview"><span data-icon="speaker"></span><strong>Blast Boombox</strong><p>Ocho modelos de speaker, audio en vehículos y una interfaz musical completa.</p><p><span class="bullet-tag">v0.5.0</span><span class="bullet-tag">15 guías</span></p></a></div><p>Despliega un producto dentro de Scripts en el menú lateral para abrir sus guías.</p>`)
 ]}
];
for(const page of window.PORTAL_PAGES){
  for(const part of page.sections){
    if(!((page.id==='home'&&part.id==='products')||(page.id==='scripts'&&part.id==='available')))continue;
    for(const language of ['en','es']){
      const copy=language==='en'?'Instant photography, physical prints, frames, boards and albums. Free resource.':'Fotografía instantánea, impresiones físicas, marcos, pizarras y álbumes. Recurso gratuito.';
      const card=`<a class="card" href="#camera/overview"><span data-icon="camera"></span><strong>Blast Camera</strong><p>${copy}</p><p><span class="bullet-tag">FREE</span><span class="bullet-tag">${language==='en'?'10 guides':'10 guías'}</span></p></a>`;
      part.body[language]=part.body[language].replace('</div>',card+'</div>');
    }
  }
}
for(const page of window.PORTAL_PAGES){
  for(const part of page.sections){
    if(!((page.id==='home'&&part.id==='products')||(page.id==='scripts'&&part.id==='available')))continue;
    for(const language of ['en','es']){
      const copy=language==='en'?'Weapon charms, slings, banners, lasers and an ingame creator.':'Charms, correas, banderillas, láseres y creador dentro del juego.';
      const card=`<a class="card" href="#accessories/overview"><span data-icon="layers"></span><strong>Blast Accessories</strong><p>${copy}</p><p><span class="bullet-tag">0.2.0-dev</span><span class="bullet-tag">${accessories.length} ${language==='en'?'guides':'guías'}</span></p></a>`;
      part.body[language]=part.body[language].replace('</div>',card+'</div>');
    }
  }
}
window.DOCS=[...window.PORTAL_PAGES,...guides,...camera,...accessories];
})();
