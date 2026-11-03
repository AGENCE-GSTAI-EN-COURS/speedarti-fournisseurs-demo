const {test,expect}=require('@playwright/test');
test('produit, stock, archive et restauration', async ({page})=>{
  await page.goto('/');
  await page.locator('[data-action="enter-demo"]').click();
  await expect(page.getByText('Bonjour, votre espace fournisseur')).toBeVisible();
  await page.locator('.nav [data-page="Produits"]').click();
  await page.locator('[data-action="new-product"]').click();
  await page.locator('#edit-form input[name="ref"]').fill('E2E-TEST-001');
  await page.locator('#edit-form textarea[name="name"]').fill('Produit test automatisé');
  await page.locator('#trade-select').selectOption('__legacy__');
  await page.locator('#edit-form select[name="category"]').selectOption('Quincaillerie');
  await page.locator('#edit-form select[name="brand"]').selectOption('Démo');
  await page.locator('#edit-form input[name="price"]').fill('12,50');
  await page.locator('#edit-form button[type="submit"]').click();
  await expect(page.getByText('E2E-TEST-001')).toBeVisible();
  let row=page.locator('tr').filter({hasText:'E2E-TEST-001'});
  await row.locator('[data-action="plus"]').click();
  row=page.locator('tr').filter({hasText:'E2E-TEST-001'});
  await expect(row.locator('.step b')).toHaveText('1');
  await row.locator('[data-action="mode"]').click();
  row=page.locator('tr').filter({hasText:'E2E-TEST-001'});
  await expect(row.getByText('Par statut')).toBeVisible();
  await row.locator('select[data-action="status"]').selectOption('in_stock');
  row=page.locator('tr').filter({hasText:'E2E-TEST-001'});
  await expect(row.locator('select[data-action="status"]')).toHaveValue('in_stock');
  page.once('dialog',d=>d.accept());
  await row.locator('[data-action="archive"]').click();
  await expect(page.getByText('E2E-TEST-001')).toHaveCount(0);
  await page.locator('.nav [data-page="Archives"]').click();
  await expect(page.getByText('E2E-TEST-001')).toBeVisible();
  await page.locator('tr').filter({hasText:'E2E-TEST-001'}).getByRole('button',{name:'Restaurer'}).click();
  await expect(page.getByText('E2E-TEST-001')).toHaveCount(0);
  await page.locator('.nav [data-page="Produits"]').click();
  await expect(page.getByText('E2E-TEST-001')).toBeVisible();
});
test('fiche entreprise avec génération de code et remise',async ({page})=>{
 await page.goto('/');
 await page.locator('[data-action="enter-demo"]').click();
 await page.locator('.nav [data-page="Clients professionnels"]').click();
 await page.locator('[data-action="new-client"]').click();
 await page.locator('#edit-form input[name="name"]').fill('Test Entreprise Démo');
 await page.locator('#edit-form input[name="email"]').fill('test@example.invalid');
 await page.locator('#edit-form [data-action="code"]').click();
 await expect(page.locator('#edit-form input[name="code"]')).not.toHaveValue('');
 await page.locator('#edit-form button[type="submit"]').click();
 await expect(page.getByText('Test Entreprise Démo')).toBeVisible();
 await page.locator('.nav [data-page="Remises"]').click();
 await page.locator('[data-action="new-discount"]').click();
 await page.locator('#edit-form input[name="name"]').fill('Remise automatique 5 %');
 await page.locator('#edit-form button[type="submit"]').click();
 await expect(page.getByText('Remise automatique 5 %')).toBeVisible();
});
test('statistiques explicites et non simulées sur mobile',async ({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/');
 await page.locator('[data-action="enter-demo"]').click();
 await page.locator('[data-action="menu"]').click();
 await page.locator('.nav [data-page="Statistiques"]').click();
 await expect(page.getByText('Statistiques NON BRANCHÉES')).toBeVisible();
 await page.locator('[data-action="period"][data-days="30"]').click();
 await expect(page.getByText('Statistiques NON BRANCHÉES')).toBeVisible();
});

test('marque obligatoire, nouvelle marque, unité et fichiers liés',async ({page})=>{
 await page.goto('/');
 await page.locator('[data-action="enter-demo"]').click();
 await page.locator('.nav [data-page="Produits"]').click();
 await page.locator('[data-action="new-product"]').click();
 await page.locator('#edit-form input[name="ref"]').fill('DOC-E2E-001');
 await page.locator('#edit-form textarea[name="name"]').fill('Produit PDF et photo');
 await page.locator('#edit-form input[name="price"]').fill('22,40');
 await expect(page.locator('#edit-form select[name="category"]')).toHaveValue('');
 await expect(page.locator('#edit-form select[name="brand"]')).toHaveValue('');
 await page.locator('#trade-select').selectOption('__legacy__');
 await page.locator('#edit-form select[name="category"]').selectOption('Couverture');
 await page.locator('#edit-form select[name="brand"]').selectOption('__new__');
 await page.locator('#edit-form input[name="brandNew"]').fill('Marque Nouvelle E2E');
 await page.locator('#edit-form select[name="unit"]').selectOption('m2');
 await page.locator('#photo-file').setInputFiles({name:'photo.png',mimeType:'image/png',buffer:Buffer.from('89504e470d0a1a0a0000000d49484452','hex')});
 await page.locator('#docs-file').setInputFiles({name:'notice-test.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\n')});
 await page.locator('#edit-form button[type="submit"]').click();
 await expect(page.locator('tr').filter({hasText:'DOC-E2E-001'})).toContainText('Marque Nouvelle E2E');
 await page.locator('tr').filter({hasText:'DOC-E2E-001'}).locator('[data-action="edit-product"]').click();
 await expect(page.getByAltText('Photo du produit')).toBeVisible();
 await expect(page.getByText('notice-test.pdf')).toBeVisible();
 await page.locator('[data-action="close"]').first().click();
 await page.locator('.nav [data-page="Documents"]').click();
 await expect(page.getByText('notice-test.pdf')).toBeVisible();
 await expect(page.getByText('DOC-E2E-001')).toBeVisible();
 await page.locator('[data-action="document-search"]').click();
});

test('independent login is visible and never accepts credentials in public demo',async({page})=>{
 await page.goto('/');
 await expect(page.getByText('Bienvenue dans votre espace fournisseur')).toBeVisible();
 await expect(page.locator('.nav [data-page="Produits"]')).toHaveCount(0);
 await page.locator('#supplier-login input[name="email"]').fill('fournisseur@example.invalid');
 await page.locator('#supplier-login input[name="password"]').fill('not-a-real-password');
 await page.locator('#supplier-login button[type="submit"]').click();
 await expect(page.getByText('Connexion réelle NON BRANCHÉE')).toBeVisible();
 await page.locator('[data-action="enter-demo"]').click();
 await expect(page.locator('.nav [data-page="Produits"]')).toBeVisible();
 await page.locator('[data-action="logout-demo"]').click();
 await expect(page.locator('.nav [data-page="Produits"]')).toHaveCount(0);
});

test('supplier link request requires artisan confirmation and remains pending',async({page})=>{
 await page.goto('/');
 await page.locator('[data-action="enter-demo"]').click();
 await page.locator('.nav [data-page="Connexions SpeedArti"]').click();
 await expect(page.getByText('Demande de liaison')).toBeVisible();
 await expect(page.getByText('Connexion SpeedArti : NON BRANCHÉE')).toBeVisible();
 await page.locator('[data-action="new-link"]').click();
 await expect(page.locator('.alert')).toContainText('Choisir une entreprise cliente');
 await page.locator('#link-company').selectOption('c0');
 await page.locator('[data-action="new-link"]').click();
 await expect(page.getByText('En attente de validation artisan')).toBeVisible();
 await page.locator('[data-action="revoke-link"]').click();
 await expect(page.getByText('Révoquée',{exact:true})).toBeVisible();
});

test('PWA can be installed with a scoped manifest and both icon sizes',async({page,request})=>{
 await page.goto('/');
 await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href','./manifest.webmanifest');
 const r=await request.get('/manifest.webmanifest');
 expect(r.ok()).toBeTruthy();
 const manifest=await r.json();
 expect(manifest.display).toBe('standalone');
 expect(manifest.start_url).toBe('./');
 expect(manifest.scope).toBe('./');
 expect(manifest.icons.map(i=>i.sizes)).toContain('192x192');
 expect(manifest.icons.map(i=>i.sizes)).toContain('512x512');
 for(const i of manifest.icons){expect((await request.get('/'+i.src.replace('./',''))).ok()).toBeTruthy();}
 expect((await request.get('/sw.js')).ok()).toBeTruthy();
 expect((await request.get('/offline.html')).ok()).toBeTruthy();
});

test('stocks par agence : changement local sans altérer le stock du dépôt principal',async({page})=>{
 await page.goto('/');await page.locator('[data-action="enter-demo"]').click();
 await page.locator('.nav [data-page="Stocks par agence"]').click();
 await expect(page.getByRole('heading',{name:'Stocks par agence'})).toBeVisible();
 await page.locator('#agency-select').selectOption('DAX');
 const row=page.locator('tbody tr').first();
 await expect(row).toContainText('Non communiquée');
 await row.locator('[data-action="agency-adjust"][data-change="1"]').click();
 await expect(page.locator('tbody tr').first()).toContainText('1');
 await page.locator('#agency-select').selectOption('DEPOT-01');
 await expect(page.locator('tbody tr').first()).toContainText('32');
});
test('simule un premier transfert complet puis des deltas sans envoyer de données',async({page})=>{
 await page.goto('/');await page.locator('[data-action="enter-demo"]').click();
 await page.locator('.nav [data-page="Synchronisations"]').click();
 await expect(page.getByText('SIMULATION — NON BRANCHÉ')).toBeVisible();
 await page.locator('[data-action="sync-preview"]').click();
 await expect(page.getByText('6 modification(s), 1 lot(s)')).toBeVisible();
 await page.locator('[data-action="sync-preview"]').click();
 await expect(page.getByText('0 modification(s), 0 lot(s)')).toBeVisible();
 await expect(page.getByText(/Aucun envoi à SpeedArti/)).toBeVisible();
});

test('création et modification avec métier étendu, catégorie personnelle et désignation large',async({page})=>{
 await page.goto('/');
 await page.locator('[data-action="enter-demo"]').click();
 await page.locator('.nav [data-page="Produits"]').click();
 await page.locator('[data-action="new-product"]').click();
 const description=page.locator('#edit-form textarea[name="name"]');
 await expect(description).toHaveAttribute('rows','4');
 const height=await description.evaluate(el=>el.getBoundingClientRect().height);
 expect(height).toBeGreaterThan(110);
 await expect(page.locator('#trade-select option')).toHaveCount(38);
 await page.locator('#edit-form input[name="ref"]').fill('V3-CAT-E2E');
 await description.fill('Tableau électrique complet avec protections, caractéristiques techniques et équipements de fixation');
 await page.locator('#trade-select').selectOption('Électricité');
 await page.locator('#category-select').selectOption('Électricité / Tableaux électriques');
 await page.locator('#edit-form select[name="brand"]').selectOption('Démo');
 await page.locator('#edit-form input[name="price"]').fill('159,90');
 await page.locator('#edit-form button[type="submit"]').click();
 const row=page.locator('tr').filter({hasText:'V3-CAT-E2E'});
 await expect(row).toBeVisible();
 await row.locator('[data-action="edit-product"]').click();
 await expect(page.locator('#trade-select')).toHaveValue('Électricité');
 await expect(page.locator('#category-select')).toHaveValue('Électricité / Tableaux électriques');
 await page.locator('#category-select').selectOption('__custom__');
 await expect(page.locator('#custom-category')).toBeVisible();
 await page.locator('#custom-category').fill('Coffrets spéciaux');
 await page.locator('#edit-form button[type="submit"]').click();
 await row.locator('[data-action="edit-product"]').click();
 await expect(page.locator('#trade-select')).toHaveValue('Électricité');
 await expect(page.locator('#category-select')).toHaveValue('__custom__');
 await expect(page.locator('#custom-category')).toHaveValue('Coffrets spéciaux');
});

test('référence automatique facultative sur nouvelle fiche',async({page})=>{
 await page.goto('/');
 await page.locator('[data-action="enter-demo"]').click();
 await page.locator('.nav [data-page="Produits"]').click();
 await page.locator('[data-action="new-product"]').click();
 await expect(page.locator('#edit-form input[name="ref"]')).toHaveValue('');
 await page.locator('[data-action="generate-ref"]').click();
 await expect(page.locator('#edit-form input[name="ref"]')).toHaveValue('MAT-000001');
 await page.locator('#edit-form input[name="ref"]').fill('MA-REFERENCE-MANUELLE');
 await expect(page.locator('#edit-form input[name="ref"]')).toHaveValue('MA-REFERENCE-MANUELLE');
});

test('import CSV : apercu, references generees, confirmation explicite, aucune synchronisation',async({page})=>{
 await page.goto('/');
 await page.locator('[data-action="enter-demo"]').click();
 await page.locator('.nav [data-page="Produits"]').click();
 await page.locator('[data-action="import-toggle"]').click();
 await expect(page.getByText('Importer des produits en masse')).toBeVisible();
 const file='Référence;Désignation;Prix HT;Marque;Catégorie;Stock\n'+
  ';Chevron pour test;12,50;Marque X;Charpente;5\n'+
  'REF-EXCEL-CSV;Tuile pour test;2,75;Marque Y;Couverture;13\n';
 await page.locator('#import-file').setInputFiles({name:'catalogue.csv',mimeType:'text/csv',buffer:Buffer.from(file,'utf8')});
 await expect(page.getByText(/2 ligne\(s\) chargées/)).toBeVisible();
 await page.locator('[data-action="import-preview"]').click();
 await expect(page.locator('.import-summary')).toContainText('À créer : 2');
 await expect(page.getByText('MAT-000001')).toBeVisible();
 await page.locator('[data-action="import-confirm"]').click();
 await expect(page.locator('tr').filter({hasText:'MAT-000001'})).toBeVisible();
 await expect(page.locator('tr').filter({hasText:'REF-EXCEL-CSV'})).toBeVisible();
 await expect(page.getByText(/démo en mémoire uniquement/).first()).toBeVisible();
});

test('boutons import Excel et nouveau produit séparés sur PC et mobile',async({page})=>{
 for(const width of [390,760,1024,1440]){
  await page.setViewportSize({width,height:900});
  await page.goto('/');await page.locator('[data-action="enter-demo"]').click();
  if(width<=760)await page.locator('[data-action="menu"]').click();
  await page.locator('.nav [data-page="Produits"]').click();
  const importButton=page.locator('[data-action="import-toggle"]');
  const newButton=page.locator('[data-action="new-product"]');
  await expect(importButton).toBeVisible();await expect(newButton).toBeVisible();
  const a=await importButton.boundingBox(),b=await newButton.boundingBox();
  expect(a).not.toBeNull();expect(b).not.toBeNull();
  const overlapX=Math.max(0,Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x));
  const overlapY=Math.max(0,Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y));
  expect(overlapX*overlapY).toBe(0);
  await importButton.click();
  await expect(page.getByRole('heading',{name:'Importer des produits en masse'})).toBeVisible();
  await expect(page.locator('#import-file')).toHaveAttribute('accept','.xlsx,.csv,.tsv,.txt');
 }
});
test('stock-only file refresh preserves price and schedule is never activated',async({page})=>{
 await page.goto('/');await page.locator('[data-action="enter-demo"]').click();
 await page.locator('.nav [data-page="Stocks par agence"]').click();
 await expect(page.getByRole('heading',{name:'Programmer les mises à jour'})).toBeVisible();
 await expect(page.locator('#stock-refresh-cadence option[value="hourly"]')).toHaveAttribute('disabled','');
 await page.locator('#stock-refresh-source').selectOption('hosted_xlsx');
 await page.locator('#stock-refresh-cadence').selectOption('half_day');
 await page.locator('[data-action="stock-refresh-save"]').click();
 await expect(page.getByText(/Aucune exécution automatique active/)).toBeVisible();
 await page.locator('#stock-refresh-file').setInputFiles({name:'stocks.csv',mimeType:'text/csv',buffer:Buffer.from('Référence;Stock\nDEMO-BOIS-001;41\n','utf8')});
 await expect(page.getByText(/1 lignes lues/)).toBeVisible();
 await page.locator('[data-action="stock-refresh-apply"]').click();
 await expect(page.getByText(/1 stock\(s\) actualisés en mémoire/)).toBeVisible();
 await expect(page.locator('tbody tr').first()).toContainText('41');
 await page.locator('.nav [data-page="Produits"]').click();
 await expect(page.locator('tr').filter({hasText:'DEMO-BOIS-001'}).locator('input[data-action="price"]')).toHaveValue('9,80');
});

test('une référence déjà utilisée conserve tous les champs et affiche une erreur visible',async({page})=>{
 await page.goto('/');await page.locator('[data-action="enter-demo"]').click();
 await page.locator('.nav [data-page="Produits"]').click();
 await page.locator('[data-action="new-product"]').click();
 const form=page.locator('#edit-form');
 await form.locator('[name="ref"]').fill('DEMO-BOIS-001');
 await form.locator('textarea[name="name"]').fill('Désignation longue à conserver après erreur');
 await page.locator('#trade-select').selectOption('Couverture');
 await page.locator('#category-select').selectOption('Couverture / Tuiles terre cuite');
 await form.locator('[name="brand"]').selectOption('Démo');
 await form.locator('[name="price"]').fill('13,80');
 await form.locator('[type="submit"]').click();
 await expect(form.locator('#form-save-error')).toContainText('référence existe déjà');
 await expect(form.locator('[name="ref"]')).toHaveValue('DEMO-BOIS-001');
 await expect(form.locator('textarea[name="name"]')).toHaveValue('Désignation longue à conserver après erreur');
 await expect(page.locator('#trade-select')).toHaveValue('Couverture');
 await expect(page.locator('#category-select')).toHaveValue('Couverture / Tuiles terre cuite');
 await expect(form.locator('[name="price"]')).toHaveValue('13,80');
 await form.locator('[name="ref"]').fill('TEST-CORRIGE-01');
 await form.locator('[type="submit"]').click();
 await expect(form).toHaveCount(0);
 await expect(page.locator('tr').filter({hasText:'TEST-CORRIGE-01'})).toBeVisible();
 await expect(page.locator('.alert')).toContainText('Produit ajouté au catalogue');
});

test('un produit ajouté reste visible même avec un ancien filtre de recherche',async({page})=>{
 await page.goto('/');await page.locator('[data-action="enter-demo"]').click();
 await page.locator('.nav [data-page="Produits"]').click();
 await page.locator('#search').fill('RÉFÉRENCE-ABSENTE-DU-CATALOGUE');
 await page.locator('[data-action="search"]').click();
 await expect(page.getByText('Aucun produit correspondant.')).toBeVisible();
 await page.locator('[data-action="new-product"]').click();
 const form=page.locator('#edit-form');
 await form.locator('[name="ref"]').fill('TEST-VISIBLE-2026');
 await form.locator('textarea[name="name"]').fill('Produit enregistré et visible');
 await page.locator('#trade-select').selectOption('__legacy__');
 await page.locator('#category-select').selectOption('Quincaillerie');
 await form.locator('[name="brand"]').selectOption('Démo');
 await form.locator('[name="price"]').fill('12,50');
 await form.locator('[type="submit"]').click();
 await expect(page.locator('#search')).toHaveValue('');
 await expect(page.locator('tr').filter({hasText:'TEST-VISIBLE-2026'})).toBeVisible();
 await expect(page.locator('.alert')).toContainText('ajouté au catalogue');
});

test('saisie directe des stocks, boutons plus moins conservés, prix inchangé',async({page})=>{
 await page.goto('/');await page.locator('[data-action="enter-demo"]').click();
 await page.locator('.nav [data-page="Produits"]').click();
 let row=page.locator('tr').filter({hasText:'DEMO-BOIS-001'});
 await expect(row.locator('input[data-action="quantity"]')).toHaveValue('32');
 await row.locator('input[data-action="quantity"]').fill('137');
 await row.locator('input[data-action="quantity"]').blur();
 row=page.locator('tr').filter({hasText:'DEMO-BOIS-001'});
 await expect(row.locator('input[data-action="quantity"]')).toHaveValue('137');
 await row.locator('[data-action="plus"]').click();
 row=page.locator('tr').filter({hasText:'DEMO-BOIS-001'});
 await expect(row.locator('input[data-action="quantity"]')).toHaveValue('138');
 await row.locator('[data-action="minus"]').click();
 row=page.locator('tr').filter({hasText:'DEMO-BOIS-001'});
 await expect(row.locator('input[data-action="quantity"]')).toHaveValue('137');
 await expect(row.locator('input[data-action="price"]')).toHaveValue('9,80');
});
test('suppression photo et PDF par croix, avec annulation possible avant enregistrement',async({page})=>{
 await page.goto('/');await page.locator('[data-action="enter-demo"]').click();
 await page.locator('.nav [data-page="Produits"]').click();
 await page.locator('[data-action="new-product"]').click();
 const form=page.locator('#edit-form');
 await form.locator('[name="ref"]').fill('TEST-MEDIA-001');
 await form.locator('textarea[name="name"]').fill('Produit média avec photo et notices');
 await page.locator('#trade-select').selectOption('__legacy__');
 await page.locator('#category-select').selectOption('Couverture');
 await form.locator('[name="brand"]').selectOption('Démo');
 await form.locator('[name="price"]').fill('15,50');
 await page.locator('#photo-file').setInputFiles({name:'image.png',mimeType:'image/png',buffer:Buffer.from('89504e470d0a1a0a0000000d49484452','hex')});
 await page.locator('#docs-file').setInputFiles([
  {name:'fiche-test-a.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\n')},
  {name:'fiche-test-b.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\n2 0 obj\n<<>>\nendobj\n')}
 ]);
 await expect(page.locator('#selected-doc-chips .file-chip')).toHaveCount(2);
 await page.locator('#selected-doc-chips .file-chip').first().locator('[data-action="remove-selected-doc"]').click();
 await expect(page.locator('#selected-doc-chips .file-chip')).toHaveCount(1);
 await form.locator('[type="submit"]').click();
 let row=page.locator('tr').filter({hasText:'TEST-MEDIA-001'});
 await row.locator('[data-action="edit-product"]').click();
 await expect(page.getByAltText('Photo du produit')).toBeVisible();
 await expect(page.locator('.linked-docs .file-chip')).toHaveCount(1);
 await page.locator('[data-action="remove-photo"]').click();
 await page.locator('.linked-docs [data-action="remove-document"]').click();
 await expect(page.locator('.linked-docs .file-chip')).toHaveCount(0);
 await page.locator('#edit-form [data-action="close"]').click();
 row=page.locator('tr').filter({hasText:'TEST-MEDIA-001'});
 await row.locator('[data-action="edit-product"]').click();
 await expect(page.getByAltText('Photo du produit')).toBeVisible();
 await expect(page.locator('.linked-docs .file-chip')).toHaveCount(1);
 await page.locator('[data-action="remove-photo"]').click();
 await page.locator('.linked-docs [data-action="remove-document"]').click();
 await page.locator('#edit-form button[type="submit"]').click();
 row=page.locator('tr').filter({hasText:'TEST-MEDIA-001'});
 await row.locator('[data-action="edit-product"]').click();
 await expect(page.getByAltText('Photo du produit')).toHaveCount(0);
 await expect(page.locator('.linked-docs .file-chip')).toHaveCount(0);
});
test('création de client sans code, code automatiquement attribué et erreur conservant les données',async({page})=>{
 await page.goto('/');await page.locator('[data-action="enter-demo"]').click();
 await page.locator('.nav [data-page="Clients professionnels"]').click();
 await page.locator('[data-action="new-client"]').click();
 const form=page.locator('#edit-form');
 await form.locator('input[name="name"]').fill('Fournisseur Essai Pro');
 await form.locator('input[name="email"]').fill('essai@example.invalid');
 await expect(form.locator('input[name="code"]')).toHaveValue('');
 await form.locator('button[type="submit"]').click();
 await expect(page.locator('tr').filter({hasText:'Fournisseur Essai Pro'})).toBeVisible();
 await expect(page.locator('tr').filter({hasText:'Fournisseur Essai Pro'})).toContainText('FOURNISSE');
 await expect(page.locator('.alert')).toContainText('Client professionnel enregistré');
 await page.locator('[data-action="new-client"]').click();
 const form2=page.locator('#edit-form');
 await form2.locator('input[name="name"]').fill('Deuxième société test');
 await form2.locator('input[name="email"]').fill('autre@example.invalid');
 await form2.locator('input[name="code"]').fill('FOURNISSE');
 await form2.locator('button[type="submit"]').click();
 await expect(form2.locator('#form-save-error')).toContainText('code client est déjà utilisé');
 await expect(form2.locator('input[name="name"]')).toHaveValue('Deuxième société test');
 await expect(form2.locator('input[name="email"]')).toHaveValue('autre@example.invalid');
 await form2.locator('input[name="code"]').fill('CODE-DEUXIEME');
 await form2.locator('button[type="submit"]').click();
 await expect(page.locator('tr').filter({hasText:'Deuxième société test'})).toBeVisible();
});
test('simulation statistiques explicite et chiffres variables selon période',async({page})=>{
 await page.goto('/');await page.locator('[data-action="enter-demo"]').click();
 await page.locator('.nav [data-page="Statistiques"]').click();
 await expect(page.getByText('SIMULATION — DONNÉES FICTIVES')).toBeVisible();
 await expect(page.getByText('Statistiques NON BRANCHÉES',{exact:false})).toBeVisible();
 await expect(page.locator('.stats-kpi')).toHaveCount(4);
 await expect(page.locator('.stats-chart-col')).toHaveCount(7);
 await page.locator('[data-action="period"][data-days="30"]').click();
 await expect(page.locator('.stats-chart-col')).toHaveCount(4);
 await expect(page.locator('.stats-kpi').first()).toContainText('2 140');
});
test('import de cent lignes fictives : références et quantités',async({page})=>{
 await page.goto('/');await page.locator('[data-action="enter-demo"]').click();
 await page.locator('.nav [data-page="Produits"]').click();
 await page.locator('[data-action="import-toggle"]').click();
 const rows=Array.from({length:100},(_,i)=>'TEST-LOT-'+String(i+1).padStart(4,'0')+';Produit fictif '+(i+1)+';'+(2+i/10).toFixed(2).replace('.',',')+';TEST;Charpente;'+(i%21));
 const csv=['Référence;Désignation;Prix HT;Marque;Catégorie;Stock',...rows].join('\n');
 await page.locator('#import-file').setInputFiles({name:'100-produits.csv',mimeType:'text/csv',buffer:Buffer.from(csv,'utf8')});
 await expect(page.getByText('100 ligne(s) chargées',{exact:false})).toBeVisible();
 await page.locator('[data-action="import-preview"]').click();
 await expect(page.locator('.import-summary')).toContainText('À créer : 100');
 await page.locator('[data-action="import-confirm"]').click();
 const count=await page.locator('tbody tr').count();
 expect(count).toBe(106);
 await expect(page.locator('tr').filter({hasText:'TEST-LOT-0100'}).locator('input[data-action="quantity"]')).toHaveValue(String(99%21));
 await expect(page.locator('tr').filter({hasText:'TEST-LOT-0001'}).locator('input[data-action="price"]')).toHaveValue('2,00');
});
