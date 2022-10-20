const AdmZip = require("adm-zip");
const chalk = require("chalk");
const archiver = require("archiver");
const {
  existsSync,
  ensureFileSync,
  createWriteStream,
  removeSync,
// eslint-disable-next-line no-undef
} = require("fs-extra");
// eslint-disable-next-line no-undef
const fs = require("fs-extra");

const dist = "./dist";

async function createZipArchive() {
  const zip = new AdmZip();

  console.log(chalk.green(`Checking directory`));
  if (!fs.existsSync(dist)) {
    console.log(chalk.green(`creating dist directory`));
    fs.mkdirSync(dist);
  }

  console.log(chalk.green(`creating .zip file for Zoho Desk`));
  const outputFile = "dist/zoho-desk.zip";
  const archive = archiver('zip');
  const archivePath = outputFile;
  ensureFileSync(archivePath);
  const outputStream = createWriteStream(archivePath);
  archive.pipe(outputStream);
  archive.directory("./app", "app");
  archive.file('resources.json', { name: 'resources.json' });
  archive.file('plugin-manifest.json', { name: 'plugin-manifest.json' });
  await archive.finalize();
  archive.on('end', function () {
    resolve();
  });
  console.log(chalk.cyan(`Created successfully`));

}

createZipArchive();
