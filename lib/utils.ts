import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getDeviconClassName = (techName: string) => {
  const normalizedTechName = techName.toLowerCase().replace(/[ .]/g, "")

  // Dictionary mapping possible technology names / aliases to Devicon class names
  const techMap: { [key: string]: string } = {
    // =========================
    // Languages
    // =========================

    javascript: "devicon-javascript-plain",
    js: "devicon-javascript-plain",

    typescript: "devicon-typescript-plain",
    ts: "devicon-typescript-plain",

    python: "devicon-python-plain",

    java: "devicon-java-plain",

    "c++": "devicon-cplusplus-plain",
    cpp: "devicon-cplusplus-plain",
    cplusplus: "devicon-cplusplus-plain",

    "c#": "devicon-csharp-plain",
    csharp: "devicon-csharp-plain",

    c: "devicon-c-plain",

    go: "devicon-go-original-wordmark",
    golang: "devicon-go-original-wordmark",

    rust: "devicon-rust-original",

    ruby: "devicon-ruby-plain",
    rb: "devicon-ruby-plain",

    php: "devicon-php-plain",

    swift: "devicon-swift-plain",

    kotlin: "devicon-kotlin-plain",

    dart: "devicon-dart-plain",

    scala: "devicon-scala-plain",

    perl: "devicon-perl-plain",

    lua: "devicon-lua-plain",

    r: "devicon-r-plain",

    elixir: "devicon-elixir-plain",

    haskell: "devicon-haskell-plain",

    clojure: "devicon-clojure-plain",

    groovy: "devicon-groovy-plain",

    matlab: "devicon-matlab-plain",

    powershell: "devicon-powershell-plain",

    bash: "devicon-bash-plain",
    shell: "devicon-bash-plain",

    // =========================
    // Frontend
    // =========================

    html: "devicon-html5-plain",
    html5: "devicon-html5-plain",

    css: "devicon-css3-plain",
    css3: "devicon-css3-plain",

    sass: "devicon-sass-plain",
    scss: "devicon-sass-plain",

    less: "devicon-less-plain",

    bootstrap: "devicon-bootstrap-plain",

    tailwind: "devicon-tailwindcss-original",
    tailwindcss: "devicon-tailwindcss-original",
    "tailwind css": "devicon-tailwindcss-original",

    materialui: "devicon-materialui-plain",
    "material ui": "devicon-materialui-plain",
    mui: "devicon-materialui-plain",

    jquery: "devicon-jquery-plain",

    webpack: "devicon-webpack-plain",

    vite: "devicon-vitejs-plain",
    vitejs: "devicon-vitejs-plain",

    babel: "devicon-babel-plain",

    // =========================
    // JavaScript Frameworks
    // =========================

    react: "devicon-react-original",
    reactjs: "devicon-react-original",
    "react.js": "devicon-react-original",

    next: "devicon-nextjs-plain",
    nextjs: "devicon-nextjs-plain",
    "next.js": "devicon-nextjs-plain",

    vue: "devicon-vuejs-plain",
    vuejs: "devicon-vuejs-plain",
    "vue.js": "devicon-vuejs-plain",

    angular: "devicon-angular-plain",
    angularjs: "devicon-angularjs-plain",

    svelte: "devicon-svelte-plain",

    ember: "devicon-ember-original-wordmark",

    astro: "devicon-astro-plain",

    // =========================
    // Node / JS Runtimes
    // =========================

    node: "devicon-nodejs-plain",
    nodejs: "devicon-nodejs-plain",
    "node.js": "devicon-nodejs-plain",

    bun: "devicon-bun-plain",
    bunjs: "devicon-bun-plain",
    "bun.js": "devicon-bun-plain",

    deno: "devicon-denojs-original",
    denojs: "devicon-denojs-original",
    "deno.js": "devicon-denojs-original",

    // =========================
    // Backend Frameworks
    // =========================

    express: "devicon-express-original",
    expressjs: "devicon-express-original",
    "express.js": "devicon-express-original",

    nest: "devicon-nestjs-plain",
    nestjs: "devicon-nestjs-plain",
    "nest.js": "devicon-nestjs-plain",

    laravel: "devicon-laravel-original",

    symfony: "devicon-symfony-original",

    codeigniter: "devicon-codeigniter-plain",

    django: "devicon-django-plain",

    flask: "devicon-flask-original",

    rails: "devicon-rails-plain",

    "ruby on rails": "devicon-rails-plain",

    spring: "devicon-spring-original",
    "spring boot": "devicon-spring-original",

    dotnet: "devicon-dotnetcore-plain",
    ".net": "devicon-dotnetcore-plain",

    "asp.net": "devicon-dot-net-plain",
    aspnet: "devicon-dot-net-plain",

    // =========================
    // Databases
    // =========================

    mysql: "devicon-mysql-plain",

    mariadb: "devicon-mariadb-original",

    postgresql: "devicon-postgresql-plain",
    postgres: "devicon-postgresql-plain",

    mongodb: "devicon-mongodb-plain",
    mongo: "devicon-mongodb-plain",

    redis: "devicon-redis-plain",

    sqlite: "devicon-sqlite-plain",

    oracle: "devicon-oracle-original",

    firebase: "devicon-firebase-plain",

    dynamodb: "devicon-dynamodb-plain",

    cassandra: "devicon-cassandra-plain",

    couchdb: "devicon-couchdb-plain",

    neo4j: "devicon-neo4j-plain",

    realm: "devicon-realm-plain",

    // =========================
    // Cloud / AWS
    // =========================

    aws: "devicon-amazonwebservices-original",
    "amazon web services": "devicon-amazonwebservices-original",
    amazonaws: "devicon-amazonwebservices-original",

    azure: "devicon-azure-plain",

    gcp: "devicon-googlecloud-plain",
    "google cloud": "devicon-googlecloud-plain",
    googlecloud: "devicon-googlecloud-plain",

    heroku: "devicon-heroku-plain",

    vercel: "devicon-vercel-original",

    netlify: "devicon-netlify-plain",

    digitalocean: "devicon-digitalocean-plain",

    cloudflare: "devicon-cloudflare-plain",

    // =========================
    // DevOps / Containers
    // =========================

    docker: "devicon-docker-plain",

    kubernetes: "devicon-kubernetes-plain",
    k8s: "devicon-kubernetes-plain",

    terraform: "devicon-terraform-plain",

    ansible: "devicon-ansible-plain",

    jenkins: "devicon-jenkins-line",

    prometheus: "devicon-prometheus-original",

    grafana: "devicon-grafana-plain",

    nginx: "devicon-nginx-original",

    apache: "devicon-apache-plain",

    linux: "devicon-linux-plain",

    ubuntu: "devicon-ubuntu-plain",

    debian: "devicon-debian-plain",

    centos: "devicon-centos-plain",

    fedora: "devicon-fedora-plain",

    // =========================
    // Version Control
    // =========================

    git: "devicon-git-plain",

    github: "devicon-github-original",

    gitlab: "devicon-gitlab-plain",

    bitbucket: "devicon-bitbucket-original",

    // =========================
    // Package Managers
    // =========================

    npm: "devicon-npm-original-wordmark",

    yarn: "devicon-yarn-plain",

    pnpm: "devicon-pnpm-plain",

    composer: "devicon-composer-line",

    // =========================
    // Mobile
    // =========================

    android: "devicon-android-plain",

    ios: "devicon-apple-original",

    apple: "devicon-apple-original",

    flutter: "devicon-flutter-plain",

    reactnative: "devicon-react-original",
    "react native": "devicon-react-original",

    ionic: "devicon-ionic-original",

    // =========================
    // Testing
    // =========================

    jest: "devicon-jest-plain",

    mocha: "devicon-mocha-plain",

    jasmine: "devicon-jasmine-plain",

    cypress: "devicon-cypressio-plain",

    selenium: "devicon-selenium-original",

    // =========================
    // API / Architecture
    // =========================

    graphql: "devicon-graphql-plain",

    rest: "devicon-fastapi-plain",

    grpc: "devicon-grpc-plain",

    // =========================
    // CMS
    // =========================

    wordpress: "devicon-wordpress-plain",

    drupal: "devicon-drupal-plain",

    joomla: "devicon-joomla-plain",

    // =========================
    // Tools / IDEs
    // =========================

    vscode: "devicon-vscode-plain",
    "visual studio code": "devicon-vscode-plain",

    visualstudio: "devicon-visualstudio-plain",
    "visual studio": "devicon-visualstudio-plain",

    intellij: "devicon-intellij-plain",
    "intellij idea": "devicon-intellij-plain",

    webstorm: "devicon-webstorm-plain",

    phpstorm: "devicon-phpstorm-plain",

    pycharm: "devicon-pycharm-plain",

    vim: "devicon-vim-plain",

    emacs: "devicon-emacs-plain",

    // =========================
    // Design
    // =========================

    figma: "devicon-figma-plain",

    photoshop: "devicon-photoshop-plain",

    illustrator: "devicon-illustrator-plain",

    // =========================
    // Data / AI / ML
    // =========================

    tensorflow: "devicon-tensorflow-original",

    pytorch: "devicon-pytorch-plain",

    pandas: "devicon-pandas-plain",

    numpy: "devicon-numpy-plain",

    jupyter: "devicon-jupyter-plain",

    anaconda: "devicon-anaconda-original",

    opencv: "devicon-opencv-plain",

    // =========================
    // Other popular technologies
    // =========================

    markdown: "devicon-markdown-original",

    npmjs: "devicon-npm-original-wordmark",

    threejs: "devicon-threejs-original",

    three: "devicon-threejs-original",

    electron: "devicon-electron-original",

    unity: "devicon-unity-plain",

    unreal: "devicon-unrealengine-original",

    unity3d: "devicon-unity-plain",
  }

  return techMap[normalizedTechName] ? `${techMap[normalizedTechName]} colored` : `devicon-devicon-plain`
}
