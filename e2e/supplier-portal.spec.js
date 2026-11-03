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
 await page.locator('#edit-form textarea[name="name"]').fill('Test Entreprise Démo');
 await page.locator('#edit-form input[name="email"]').fill('test@example.invalid');
 await page.locator('#edit-form [data-action="code"]').click();
 await expect(page.locator('#edit-form input[name="code"]')).not.toHaveValue('');
 await page.locator('#edit-form button[type="submit"]').click();
 await expect(page.getByText('Test Entreprise Démo')).toBeVisible();
 await page.locator('.nav [data-page="Remises"]').click();
 await page.locator('[data-action="new-discount"]').click();
 await page.locator('#edit-form textarea[name="name"]').fill('Remise automatique 5 %');
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
