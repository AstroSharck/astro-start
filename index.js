#!/usr/bin/env node

const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const { execSync, exec } = require('child_process');
const ora = require('ora').default;


(async () => {
    console.log('🔵 Bienvenue dans ton Starter ElectronJS !');

    const { projectName } = await inquirer.prompt([
        {
            type: 'input',
            name: 'projectName',
            message: 'Quel est le nom de ton projet ?',
            validate: (input) => input ? true : 'Le nom est obligatoire',
        }
    ]);

    const projectDir = path.join(process.cwd(), projectName);

    if (fs.existsSync(projectDir)) {
        console.error('❌ Un dossier avec ce nom existe déjà.');
        process.exit(1);
    }

    console.log(`📁 Création du dossier "${projectName}"...`);
    fs.mkdirSync(projectDir);
    fs.mkdirSync(path.join(projectDir, 'src'));
    fs.mkdirSync(path.join(projectDir, 'src/assets'));
    fs.mkdirSync(path.join(projectDir, 'src/assets/css'));
    fs.mkdirSync(path.join(projectDir, 'src/assets/js'));

    process.chdir(projectDir);
    execSync('npm init -y', { stdio: 'ignore' });

    // Ton Watermark
    const watermark = `// Créé avec ❤️ par AstroSharck\n\n`;

    // Fichier principal Electron
    fs.writeFileSync(path.join(projectDir, 'index.js'), watermark + `
const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { nodeIntegration: true }
  });
  win.loadFile('src/index.html');
}

app.whenReady().then(createWindow);
  `);

    // Index HTML simple
    fs.writeFileSync(path.join(projectDir, 'src/index.html'), `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${projectName}</title>
</head>
<body>
  <h1>Bienvenue sur ${projectName} !</h1>
</body>
</html>
  `);

    const packageJsonPath = path.join(projectDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.scripts.start = "electron .";
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // Installer Electron
    const spinner = ora('📦 Installation de Electron...').start();
    await exec('npm install electron', { cwd: projectDir }, (error, stdout, stderr) => {
        if (error) {
            spinner.fail('❌ Échec de l\'installation de Electron.');
            console.error(error);
            process.exit(1);
        } else {
            spinner.succeed(`✅ Projet "${projectName}" créé avec succès !`);
            console.log(`\n`);
            console.log(`--------------------------------------------------`);
            console.log(`\n`);
            console.log('Pour démarrer le projet, exécutez la commande ci-dessous.');
            console.log(`cd ${projectName} && npm start`);
        }
    });
})();
