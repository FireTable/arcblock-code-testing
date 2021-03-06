#!/usr/bin/env node

import ejs from 'ejs';
import boxen from 'boxen';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { cd, argv, fs, YAML, chalk, path } from 'zx';
import ora from 'ora';
import prompts from 'prompts';
import * as envfile from 'envfile';

import { echoBrand, echoDocument } from './lib/arcblock.js';
import { getUser } from './lib/index.js';
import { checkServerInstalled, checkServerRunning, checkSatisfiedVersion, getServerDirectory } from './lib/server.js';
import { toBlockletDid } from './lib/did.js';
import { initGitRepo } from './lib/git.js';

const { yellow, red, green, cyan, blue, bold } = chalk;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const cwd = process.cwd();

const TYPES = [
  {
    name: 'dapp',
    color: yellow,
    frameworks: [
      {
        name: 'react',
        display: 'react',
        color: yellow,
      },
      {
        name: 'vue',
        display: 'vue3 + vite',
        color: green,
      },
      {
        name: 'vue2',
        display: 'vue2 + @vue/cli',
        color: green,
      },
      {
        name: 'nextjs',
        display: 'next.js',
        color: blue,
      },
      {
        name: 'react-gun',
        display: 'react + gunjs',
        color: blue,
      }
    ],
  },
  {
    name: 'static',
    color: yellow,
    frameworks: [
      {
        name: 'react',
        display: 'react',
        color: yellow,
      },
      {
        name: 'vue',
        display: 'vue3 + vite',
        color: green,
      },
      {
        name: 'vue2',
        display: 'vue2 + @vue/cli',
        color: green,
      },
      {
        name: 'blocklet-page',
        display: 'blocklet page',
        color: blue,
      },
      {
        name: 'react-umijs',
        display: 'react-umijs',
        color: green,
      },
      {
        name: 'react-umijs-antdPro',
        display: 'react-umijs(Ant Design Pro)',
        color: blue,
      },
    ],
  },
  {
    name: 'api',
    color: yellow,
    frameworks: [
      {
        name: 'express',
        display: 'express',
        color: yellow,
      },
    ],
  },
];

const renameFiles = {
  _gitignore: '.gitignore',
  '_eslintrc.js': '.eslintrc.js',
  _eslintignore: '.eslintignore',
  _npmrc: '.npmrc',
  _editorconfig: '.editorconfig',
  _prettierrc: '.prettierrc',
};

async function init() {
  const { version } = await fs.readJSONSync(path.resolve(__dirname, 'package.json'));

  await echoBrand({ version });

  let targetDir = argv._[0] ? String(argv._[0]) : undefined;

  const defaultProjectName = !targetDir ? 'blocklet-project' : targetDir;

  let result = {};
  const authorInfo = await getUser();

  try {
    result = await prompts(
      [
        {
          type: targetDir ? null : 'text',
          name: 'projectName',
          message: 'Project name:',
          initial: defaultProjectName,
          onState: (state) => {
            targetDir = state.value.trim() || defaultProjectName;
          },
        },
        {
          type: () => (!fs.existsSync(targetDir) || isEmpty(targetDir) ? null : 'confirm'),
          name: 'overwrite',
          message: () =>
            `${
              targetDir === '.' ? 'Current directory' : `Target directory "${targetDir}"`
            } is not empty. Remove existing files and continue?`,
        },
        {
          type: (_, { overwrite } = {}) => {
            if (overwrite === false) {
              throw new Error(`${red('???')} Operation cancelled`);
            }
            return null;
          },
          name: 'overwriteChecker',
        },
        {
          type: () => (isValidPackageName(targetDir) ? null : 'text'),
          name: 'packageName',
          message: 'Package name:',
          initial: () => toValidPackageName(targetDir),
          validate: (dir) => isValidPackageName(dir) || 'Invalid package.json name',
        },
        {
          type: 'select',
          name: 'type',
          message: 'What type blocklet you want to create:',
          initial: 0,
          choices: TYPES.map((type) => {
            const TYPE_TITLE = {
              dapp: 'fullstack: webapp with backend code',
              static: 'webapp: browser only',
              api: 'api: backend only',
            };
            return {
              title: TYPE_TITLE[type.name],
              value: type.name,
            };
          }),
        },
        {
          type: (typeName) => {
            const type = TYPES.find((item) => item.name === typeName);
            return type && type.frameworks ? 'select' : null;
          },
          name: 'framework',
          message: 'Select a framework:',
          choices: (typeName) => {
            const type = TYPES.find((item) => item.name === typeName);
            return type.frameworks.map((framework) => {
              const frameworkColor = framework.color;
              return {
                title: frameworkColor(framework.display),
                value: framework.name,
              };
            });
          },
        },
        {
          type: 'text',
          name: 'authorName',
          message: 'Author name:',
          initial: authorInfo?.name || '',
          validate: (name) => (name ? true : 'Author name is required'),
        },
        {
          type: 'text',
          name: 'authorEmail',
          message: 'Author email:',
          initial: authorInfo?.email || '',
          validate: (email) => (email ? true : 'Author email is required'),
        },
      ],
      {
        onCancel: () => {
          throw new Error(`${red('???')} Operation cancelled`);
        },
      }
    );
  } catch (cancelled) {
    console.error(cancelled.message);
    return;
  }

  // user choice associated with prompts
  const { type, framework, overwrite, packageName, authorName, authorEmail } = result;

  await echoDocument();

  const root = path.join(cwd, targetDir);

  if (overwrite) {
    emptyDir(root);
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root);
  }

  const checkSpinner = ora({
    text: 'Checking blocklet server runtime environment\n',
  }).start();

  const isServerInstalled = await checkServerInstalled();
  const isSatisfiedVersion = await checkSatisfiedVersion();
  const isServerRunning = await checkServerRunning();
  checkSpinner.succeed('Done');

  console.log(`\nScaffolding project in ${cyan(root)}`);

  const scaffoldSpinner = ora('Creating project...').start();

  const templateDir = path.join(__dirname, `templates/${framework}-${type}`);
  const name = packageName || targetDir;

  // TODO: ????????? common file copy ??????????????????????????? template ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
  // copy common files
  (() => {
    const commonDir = path.join(__dirname, 'common');
    const commonFiles = fs.readdirSync(commonDir);
    for (const file of commonFiles) {
      if (!['react', 'react-gun'].includes(framework) && file === '_eslintrc.js') {
        // eslint-disable-next-line no-continue
        continue;
      }
      if (framework === 'blocklet-page' && ['_eslintignore', '.husky'].includes(file)) {
        // eslint-disable-next-line no-continue
        continue;
      }
      if (framework === 'express' && ['_eslintignore', '.husky'].includes(file)) {
        // eslint-disable-next-line no-continue
        continue;
      }
      const targetPath = renameFiles[file] ? path.join(root, renameFiles[file]) : path.join(root, file);
      copy(path.join(commonDir, file), targetPath);
    }
  })();

  // copy template files
  (() => {
    const files = fs.readdirSync(templateDir);
    for (const file of files) {
      write(file);
    }
  })();

  // correctName
  modifyPackage((pkg) => {
    pkg.name = name;
  });
  modifyBlockletYaml((yamlConfig) => {
    yamlConfig.name = name;
    yamlConfig.title = name;
  });
  modifyBlockletMd((md) => {
    return md.replace(/# template-react/g, `# ${name}`);
  });
  if (!['blocklet-page'].includes(framework)) {
    modifyEnv((env) => {
      if (['react'].includes(framework)) {
        env.REACT_APP_TITLE = name;
      } else if (['vue', 'blocklet-page'].includes(framework)) {
        env.VITE_APP_TITLE = name;
      } else {
        env.APP_TITLE = name;
      }
      return env;
    });
  }

  // patch blocklet author
  modifyBlockletYaml(async (yamlConfig) => {
    yamlConfig.author.name = authorName;
    yamlConfig.author.email = authorEmail;
  });

  // patch did
  (() => {
    const did = toBlockletDid(name);
    modifyBlockletYaml((yamlConfig) => {
      yamlConfig.did = did;
    });
    modifyPackage((pkg) => {
      if (type === 'dapp') {
        pkg.scripts['bundle:client'] = ejs.render(pkg.scripts['bundle:client'], { did });
      } else if (type === 'static') {
        pkg.scripts.bundle = ejs.render(pkg.scripts.bundle, { did });
      }
    });
    // disabled random logo
    // const pngIcon = toDidIcon(did, undefined, true);
    // fs.writeFileSync(path.join(root, 'logo.png'), pngIcon);
  })();

  scaffoldSpinner.succeed('???  Done. Now run:\n');

  const related = path.relative(cwd, root);

  // const pkgManager =
  //   // eslint-disable-next-line no-nested-ternary
  //   /pnpm/.test(process.env.npm_execpath) || /pnpm/.test(process.env.npm_config_user_agent)
  //     ? 'pnpm'
  //     : /yarn/.test(process.env.npm_execpath)
  //     ? 'yarn'
  //     : 'npm';
  try {
    // const { yes } = await prompts(
    //   {
    //     type: 'confirm',
    //     name: 'yes',
    //     initial: 'Y',
    //     message: 'Install and start it now?',
    //   },
    //   {
    //     onCancel: () => {
    //       throw new Error(`${red('???')} Operation cancelled`);
    //     },
    //   }
    // );
    const yes = false;
    let hasStart = false;

    await initGitRepo(root);

    let defaultAgent = 'npm';
    let agentList = ['npm', 'yarn', 'pnpm'];
    switch (framework) {
      case 'react':
      case 'blocklet-page':
        agentList = ['npm', 'yarn'];
        break;
      default:
        break;
    }
    if (yes) {
      const { agent } = await prompts({
        name: 'agent',
        type: 'select',
        message: 'Select npm client (package manager)',
        choices: agentList.map((i) => ({ value: i, title: i })),
      });

      if (!agent) {
        return;
      }
      defaultAgent = agent;

      await cd(root);
      execSync(`${agent} install`, { stdio: 'inherit' });
      if (isServerInstalled && isServerRunning && isSatisfiedVersion) {
        console.log(
          boxen(bold('blocklet dev'), {
            padding: 1,
            margin: 1,
            float: 'center',
          })
        );
        hasStart = true;
        execSync('blocklet dev', { stdio: 'inherit' });
      } else {
        console.log();
        console.log();
      }
    } else {
      console.log();
      console.log();
    }

    if (!isServerInstalled) {
      // ????????? blocklet server
      console.log(red('To run the blocklet, you need a running blocklet server instance on local machine.'), '\n');
      console.log(`Checkout ${green('README.md')} for more usage instructions.`);
      console.log('Now you should run:', '\n');
      console.log(cyan(`${defaultAgent} install -g @blocklet/cli`));
      console.log(cyan('blocklet server start -a'));
    } else if (!isSatisfiedVersion) {
      // ????????? blocklet server?????????????????????
      console.log(red('Your blocklet server version is outdate, please update it to the latest version.'));
      console.log('Now you should run:', '\n');
      if (isServerRunning) {
        // blocklet server ????????????
        const serverPath = await getServerDirectory();
        console.log(cyan(`cd ${serverPath}`));
        console.log(cyan('blocklet server stop'));
        console.log(cyan(`${defaultAgent} install -g @blocklet/cli`));
        console.log(cyan('blocklet server start'));
      } else {
        // blocklet server ?????????
        // TODO: ???????????????????????? blocklet server ???????????????
        console.log(cyan(`${defaultAgent} install -g @blocklet/cli`));
        console.log(cyan('blocklet server start -a'));
      }
    } else if (!isServerRunning) {
      // ???????????? blocklet server??????????????????????????? blocklet server ?????????
      console.log(red('You need to start your blocklet server before develop this blocklet.'));
      console.log('Now you should run:', '\n');
      // TODO: ???????????????????????? blocklet server ???????????????
      console.log(cyan('blocklet server start -a'));
    }

    if (!hasStart) {
      // console.log(dim('\n  start it later by:\n'));
      if (root !== cwd) console.log(blue(`  cd ${bold(related)}`));

      console.log(blue(`  ${defaultAgent === 'yarn' ? 'yarn' : `${defaultAgent} install`}`));
      console.log(cyan('blocklet dev'));
      console.log('\n', `Find more usage in ${green('README.md')}`, '\n');
    }
  } catch (cancelled) {
    console.error(cancelled.message);
  }

  // inside functions
  function write(file, content) {
    const targetPath = renameFiles[file] ? path.join(root, renameFiles[file]) : path.join(root, file);
    if (content) {
      fs.writeFileSync(targetPath, content);
    } else {
      copy(path.join(templateDir, file), targetPath);
    }
  }
  function read(file) {
    const targetPath = path.join(root, file);
    if (fs.existsSync(targetPath)) {
      return fs.readFileSync(targetPath, 'utf8');
    }
    return null;
  }

  function modifyPackage(modifyFn = () => {}) {
    const pkg = JSON.parse(read('package.json'));
    modifyFn(pkg);
    write('package.json', JSON.stringify(pkg, null, 2));
  }

  function modifyBlockletYaml(modifyFn = () => {}) {
    const blockletYaml = read('blocklet.yml');
    const yamlConfig = YAML.parse(blockletYaml);
    modifyFn(yamlConfig);
    write('blocklet.yml', YAML.stringify(yamlConfig, 2));
  }
  function modifyBlockletMd(modifyFn = (...args) => ({ ...args })) {
    const blockletMd = read('blocklet.md', 'utf8');
    const modifyMd = modifyFn(blockletMd);
    write('blocklet.md', modifyMd);
  }
  function modifyEnv(modifyFn = (...args) => ({ ...args })) {
    const envContent = read('.env');
    if (envContent) {
      const env = envfile.parse(envContent);
      modifyFn(env);
      write('.env', envfile.stringify(env));
    }
    // else {
    //   console.warn(`\n${yellow('No .env file found, please add one.')}`);
    // }
  }
}

// common functions
function copy(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

function isValidPackageName(projectName) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(projectName);
}

function toValidPackageName(projectName) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-');
}

function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}

function isEmpty(_path) {
  return fs.readdirSync(_path).length === 0;
}

function emptyDir(dir) {
  if (!fs.existsSync(dir)) {
    return;
  }
  for (const file of fs.readdirSync(dir)) {
    const abs = path.resolve(dir, file);
    // baseline is Node 12 so can't use rmSync :(
    if (fs.lstatSync(abs).isDirectory()) {
      emptyDir(abs);
      fs.rmdirSync(abs);
    } else {
      fs.unlinkSync(abs);
    }
  }
}

init().catch((e) => {
  console.error(e);
});
