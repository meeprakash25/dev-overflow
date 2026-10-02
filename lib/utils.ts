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

export function getTechDescription(techName: string): string {
  const normalizedTech = techName.replace(/[ .]/g, "").toLowerCase()

  // Mapping technology names to descriptions
  const techDescriptionMap: { [key: string]: string } = {
    javascript: "JavaScript is a versatile language for building dynamic, interactive, and modern web applications",
    js: "JavaScript is a versatile language for building dynamic, interactive, and modern web applications",

    typescript: "TypeScript adds static typing and modern development features to JavaScript applications",
    ts: "TypeScript adds static typing and modern development features to JavaScript applications",

    python: "Python is a versatile programming language widely used for web development, automation, data, and AI",
    java: "Java is a robust object-oriented language used for enterprise, backend, and cross-platform applications",

    "c++":
      "C++ is a high-performance programming language used for systems, games, and performance-critical applications",
    cpp: "C++ is a high-performance programming language used for systems, games, and performance-critical applications",
    cplusplus:
      "C++ is a high-performance programming language used for systems, games, and performance-critical applications",

    "c#": "C# is a modern object-oriented language used for web, desktop, cloud, and game development",
    csharp: "C# is a modern object-oriented language used for web, desktop, cloud, and game development",

    c: "C is a foundational systems programming language known for performance, portability, and low-level control",

    go: "Go is a fast and efficient language designed for scalable backend, cloud, and concurrent applications",
    golang: "Go is a fast and efficient language designed for scalable backend, cloud, and concurrent applications",

    rust: "Rust is a memory-safe systems programming language focused on performance, reliability, and concurrency",

    ruby: "Ruby is a developer-friendly language known for elegant syntax and productive web development",
    rb: "Ruby is a developer-friendly language known for elegant syntax and productive web development",

    php: "PHP is a server-side language widely used for dynamic websites, APIs, and modern web applications",

    swift: "Swift is Apple's modern programming language for building fast and reliable iOS and macOS applications",

    kotlin: "Kotlin is a modern language used for Android, backend, and multiplatform application development",

    dart: "Dart is a modern programming language optimized for building cross-platform applications with Flutter",

    scala: "Scala combines object-oriented and functional programming for scalable JVM-based applications",

    perl: "Perl is a flexible scripting language commonly used for automation, text processing, and system administration",

    lua: "Lua is a lightweight scripting language commonly used in games, embedded systems, and applications",

    r: "R is a statistical programming language designed for data analysis, visualization, and research",

    elixir: "Elixir is a functional language built on the BEAM platform for scalable and fault-tolerant applications",

    haskell: "Haskell is a purely functional programming language focused on strong typing and reliable software",

    clojure: "Clojure is a functional Lisp-based language designed for concurrent and immutable applications",

    groovy: "Groovy is a dynamic JVM language commonly used for scripting, automation, and Java-based development",

    matlab: "MATLAB is a technical computing platform widely used for numerical analysis, engineering, and simulation",

    powershell: "PowerShell is a command-line shell and scripting language for automation and system administration",

    bash: "Bash is a Unix shell and scripting language widely used for automation and system administration",
    shell: "Shell scripting enables automation and system administration through command-line environments",

    // =========================
    // Frontend
    // =========================

    html: "HTML provides the structure and semantic foundation for websites and web applications",
    html5: "HTML5 provides modern semantic structure and multimedia capabilities for web applications",

    css: "CSS controls the visual presentation, layout, responsiveness, and styling of web applications",
    css3: "CSS3 provides modern styling, animations, layouts, and responsive design capabilities",

    sass: "Sass is a CSS preprocessor that adds variables, nesting, mixins, and reusable styling features",
    scss: "SCSS is a CSS-compatible Sass syntax that enables maintainable and reusable stylesheets",

    less: "Less is a CSS preprocessor that adds variables, mixins, functions, and reusable styling features",

    bootstrap: "Bootstrap is a popular frontend framework for building responsive and mobile-first interfaces",

    tailwind: "Tailwind CSS is a utility-first framework for rapidly building custom responsive user interfaces",
    tailwindcss: "Tailwind CSS is a utility-first framework for rapidly building custom responsive user interfaces",
    "tailwind css": "Tailwind CSS is a utility-first framework for rapidly building custom responsive user interfaces",

    materialui: "Material UI is a React component library implementing Google's Material Design system",
    "material ui": "Material UI is a React component library implementing Google's Material Design system",
    mui: "MUI provides reusable React components for building modern and accessible user interfaces",

    jquery: "jQuery is a JavaScript library that simplifies DOM manipulation, events, animations, and AJAX",

    webpack: "Webpack is a module bundler for optimizing and packaging modern web application assets",

    vite: "Vite is a fast modern frontend build tool providing rapid development and optimized production builds",
    vitejs: "Vite is a fast modern frontend build tool providing rapid development and optimized production builds",

    babel: "Babel is a JavaScript compiler that transforms modern JavaScript and JSX for broader compatibility",

    // =========================
    // JavaScript Frameworks
    // =========================

    react: "React is a component-based JavaScript library for building dynamic and interactive user interfaces",
    reactjs: "React is a component-based JavaScript library for building dynamic and interactive user interfaces",
    "react.js": "React is a component-based JavaScript library for building dynamic and interactive user interfaces",

    next: "Next.js is a React framework for building performant full-stack web applications with modern rendering",
    nextjs: "Next.js is a React framework for building performant full-stack web applications with modern rendering",
    "next.js": "Next.js is a React framework for building performant full-stack web applications with modern rendering",

    vue: "Vue is a progressive JavaScript framework for building reactive and component-based web interfaces",
    vuejs: "Vue is a progressive JavaScript framework for building reactive and component-based web interfaces",
    "vue.js": "Vue is a progressive JavaScript framework for building reactive and component-based web interfaces",

    angular: "Angular is a TypeScript-based framework for building structured and scalable web applications",
    angularjs: "AngularJS is an older JavaScript framework for building dynamic single-page web applications",

    svelte: "Svelte is a compiler-based framework for building fast and lightweight web applications",

    ember: "Ember is a convention-driven JavaScript framework for building ambitious web applications",

    astro: "Astro is a modern web framework focused on fast content-driven websites and optimized performance",

    // =========================
    // Node / JS Runtimes
    // =========================

    node: "Node.js is a JavaScript runtime for building scalable servers, APIs, tools, and backend applications",
    nodejs: "Node.js is a JavaScript runtime for building scalable servers, APIs, tools, and backend applications",
    "node.js": "Node.js is a JavaScript runtime for building scalable servers, APIs, tools, and backend applications",

    bun: "Bun is a fast JavaScript runtime and toolkit designed for modern web development",
    bunjs: "Bun is a fast JavaScript runtime and toolkit designed for modern web development",
    "bun.js": "Bun is a fast JavaScript runtime and toolkit designed for modern web development",

    deno: "Deno is a secure modern JavaScript and TypeScript runtime for server-side and web development",
    denojs: "Deno is a secure modern JavaScript and TypeScript runtime for server-side and web development",
    "deno.js": "Deno is a secure modern JavaScript and TypeScript runtime for server-side and web development",

    // =========================
    // Backend Frameworks
    // =========================

    express: "Express is a lightweight Node.js framework for building APIs and server-side web applications",
    expressjs: "Express is a lightweight Node.js framework for building APIs and server-side web applications",
    "express.js": "Express is a lightweight Node.js framework for building APIs and server-side web applications",

    nest: "NestJS is a structured Node.js framework for building scalable and maintainable server-side applications",
    nestjs: "NestJS is a structured Node.js framework for building scalable and maintainable server-side applications",
    "nest.js":
      "NestJS is a structured Node.js framework for building scalable and maintainable server-side applications",

    laravel: "Laravel is a modern PHP framework for building robust web applications, APIs, and SaaS platforms",

    symfony: "Symfony is a flexible PHP framework for building scalable and enterprise-grade web applications",

    codeigniter: "CodeIgniter is a lightweight PHP framework designed for fast and efficient web development",

    django: "Django is a high-level Python framework for building secure and scalable web applications",

    flask: "Flask is a lightweight Python framework for building web applications and APIs",

    rails: "Ruby on Rails is a convention-driven framework for rapidly building database-backed web applications",

    "ruby on rails":
      "Ruby on Rails is a convention-driven framework for rapidly building database-backed web applications",

    spring: "Spring is a Java framework for building scalable, secure, and enterprise-grade applications",
    "spring boot": "Spring Boot simplifies building production-ready Java applications with the Spring ecosystem",

    dotnet:
      ".NET is a cross-platform development platform for building modern web, desktop, cloud, and backend applications",
    ".net":
      ".NET is a cross-platform development platform for building modern web, desktop, cloud, and backend applications",

    "asp.net": "ASP.NET is a Microsoft framework for building modern, scalable, and secure web applications",
    aspnet: "ASP.NET is a Microsoft framework for building modern, scalable, and secure web applications",

    // =========================
    // Databases
    // =========================

    mysql: "MySQL is a popular relational database system for storing and managing structured application data",

    mariadb:
      "MariaDB is an open-source relational database compatible with MySQL and designed for reliable data management",

    postgresql:
      "PostgreSQL is a powerful open-source relational database known for reliability and advanced SQL features",
    postgres:
      "PostgreSQL is a powerful open-source relational database known for reliability and advanced SQL features",

    mongodb: "MongoDB is a flexible document-oriented database designed for scalable and modern applications",
    mongo: "MongoDB is a flexible document-oriented database designed for scalable and modern applications",

    redis:
      "Redis is a high-performance in-memory data store commonly used for caching, queues, and real-time applications",

    sqlite: "SQLite is a lightweight embedded relational database requiring minimal configuration and administration",

    oracle: "Oracle Database is an enterprise relational database platform designed for large-scale data management",

    firebase:
      "Firebase provides backend services including databases, authentication, hosting, and application infrastructure",

    dynamodb: "Amazon DynamoDB is a fully managed NoSQL database designed for highly scalable applications",

    cassandra:
      "Apache Cassandra is a distributed NoSQL database designed for high availability and massive scalability",

    couchdb: "CouchDB is a document-oriented NoSQL database designed for distributed and offline-first applications",

    neo4j: "Neo4j is a graph database designed for applications that need to model and query connected data",

    realm: "Realm is a mobile-focused database designed for local data storage and offline-first applications",

    // =========================
    // Cloud / AWS
    // =========================

    aws: "AWS is a comprehensive cloud platform providing scalable computing, storage, networking, and application services",
    "amazon web services":
      "AWS is a comprehensive cloud platform providing scalable computing, storage, networking, and application services",
    amazonaws:
      "AWS is a comprehensive cloud platform providing scalable computing, storage, networking, and application services",

    azure:
      "Microsoft Azure is a cloud platform offering computing, storage, databases, networking, and developer services",

    gcp: "Google Cloud provides scalable infrastructure, computing, storage, data, and machine learning services",
    "google cloud":
      "Google Cloud provides scalable infrastructure, computing, storage, data, and machine learning services",
    googlecloud:
      "Google Cloud provides scalable infrastructure, computing, storage, data, and machine learning services",

    heroku:
      "Heroku is a cloud application platform that simplifies application deployment and infrastructure management",

    vercel: "Vercel is a cloud platform optimized for deploying modern frontend and full-stack web applications",

    netlify: "Netlify is a cloud platform for building, deploying, and hosting modern web applications",

    digitalocean:
      "DigitalOcean provides simple cloud infrastructure including virtual machines, databases, storage, and networking",

    cloudflare: "Cloudflare provides web performance, security, DNS, CDN, and edge computing services",

    // =========================
    // DevOps / Containers
    // =========================

    docker: "Docker packages applications and their dependencies into portable containers for consistent deployment",

    kubernetes:
      "Kubernetes is an orchestration platform for deploying, scaling, and managing containerized applications",
    k8s: "Kubernetes is an orchestration platform for deploying, scaling, and managing containerized applications",

    terraform: "Terraform is an infrastructure-as-code tool for provisioning and managing cloud infrastructure",

    ansible:
      "Ansible is an automation platform for configuration management, deployment, and infrastructure orchestration",

    jenkins: "Jenkins is an automation server widely used for continuous integration and continuous delivery pipelines",

    prometheus: "Prometheus is an open-source monitoring and alerting system designed for cloud-native infrastructure",

    grafana: "Grafana is an observability platform for creating dashboards and visualizing metrics and monitoring data",

    nginx: "Nginx is a high-performance web server and reverse proxy commonly used for modern application deployments",

    apache: "Apache HTTP Server is a widely used open-source web server for hosting websites and applications",

    linux: "Linux is an open-source operating system widely used for servers, development, cloud, and infrastructure",

    ubuntu:
      "Ubuntu is a popular Linux distribution widely used for development, servers, cloud infrastructure, and desktops",

    debian: "Debian is a stable and community-driven Linux distribution widely used for servers and development",

    centos: "CentOS is a Linux distribution traditionally used for enterprise servers and production infrastructure",

    fedora: "Fedora is a modern Linux distribution known for current technologies and developer-focused features",

    // =========================
    // Version Control
    // =========================

    git: "Git is a distributed version control system for tracking changes and collaborating on software projects",

    github: "GitHub is a development platform for hosting repositories, collaboration, code review, and automation",

    gitlab: "GitLab is a DevOps platform combining source control, CI/CD, security, and project management",

    bitbucket: "Bitbucket is a Git-based code hosting platform providing collaboration and development workflow tools",

    // =========================
    // Package Managers
    // =========================

    npm: "npm is the default package manager for Node.js used to install, manage, and publish JavaScript packages",

    yarn: "Yarn is a JavaScript package manager designed for fast and reliable dependency management",

    pnpm: "pnpm is an efficient JavaScript package manager known for fast installations and disk-efficient dependencies",

    composer: "Composer is the dependency manager for PHP applications and the Laravel ecosystem",

    // =========================
    // Mobile
    // =========================

    android:
      "Android is a mobile operating system and development platform for building applications across diverse devices",

    ios: "iOS is Apple's mobile operating system and platform for building applications for iPhone and iPad",

    apple: "Apple provides platforms and technologies for developing applications across macOS, iOS, and other devices",

    flutter: "Flutter is Google's UI toolkit for building cross-platform applications from a single codebase",

    reactnative:
      "React Native enables developers to build cross-platform mobile applications using React and JavaScript",
    "react native":
      "React Native enables developers to build cross-platform mobile applications using React and JavaScript",

    ionic: "Ionic is a framework for building cross-platform mobile and web applications using web technologies",

    // =========================
    // Testing
    // =========================

    jest: "Jest is a JavaScript testing framework designed for fast and reliable unit and integration testing",

    mocha: "Mocha is a flexible JavaScript testing framework commonly used for Node.js applications",

    jasmine: "Jasmine is a behavior-driven JavaScript testing framework for writing clear and maintainable tests",

    cypress: "Cypress is an end-to-end testing framework designed for reliable testing of modern web applications",

    selenium: "Selenium is a browser automation framework widely used for automated web application testing",

    // =========================
    // API / Architecture
    // =========================

    graphql: "GraphQL is an API query language that enables clients to request exactly the data they need",

    rest: "REST is an architectural style for building scalable and interoperable HTTP-based APIs",

    grpc: "gRPC is a high-performance RPC framework designed for efficient communication between distributed services",

    // =========================
    // CMS
    // =========================

    wordpress: "WordPress is a popular content management system for building websites, blogs, and business platforms",

    drupal: "Drupal is a flexible open-source CMS designed for complex, scalable, and content-rich websites",

    joomla: "Joomla is an open-source CMS for building websites and content-driven web applications",

    // =========================
    // Tools / IDEs
    // =========================

    vscode: "Visual Studio Code is a lightweight and extensible code editor for modern software development",
    "visual studio code":
      "Visual Studio Code is a lightweight and extensible code editor for modern software development",

    visualstudio:
      "Visual Studio is a comprehensive IDE for building applications across multiple platforms and technologies",
    "visual studio":
      "Visual Studio is a comprehensive IDE for building applications across multiple platforms and technologies",

    intellij: "IntelliJ IDEA is a powerful IDE designed primarily for Java and JVM-based application development",
    "intellij idea":
      "IntelliJ IDEA is a powerful IDE designed primarily for Java and JVM-based application development",

    webstorm: "WebStorm is an IDE optimized for JavaScript, TypeScript, frontend, and modern web development",

    phpstorm: "PhpStorm is an IDE designed for PHP development with advanced support for Laravel and web technologies",

    pycharm: "PyCharm is an IDE designed for Python development, debugging, testing, and data science workflows",

    vim: "Vim is a highly configurable terminal-based text editor popular among developers and system administrators",

    emacs:
      "Emacs is a highly extensible text editor and development environment with powerful customization capabilities",

    // =========================
    // Design
    // =========================

    figma: "Figma is a collaborative design platform for creating user interfaces, prototypes, and design systems",

    photoshop: "Adobe Photoshop is a powerful tool for image editing, digital graphics, and visual design",

    illustrator:
      "Adobe Illustrator is a vector graphics tool for creating logos, illustrations, icons, and visual assets",

    // =========================
    // Data / AI / ML
    // =========================

    tensorflow: "TensorFlow is an open-source machine learning platform for developing and deploying AI models",

    pytorch: "PyTorch is an open-source machine learning framework widely used for deep learning and AI research",

    pandas: "Pandas is a Python library for data manipulation, analysis, cleaning, and structured data processing",

    numpy: "NumPy is a Python library providing efficient numerical computing and multidimensional array operations",

    jupyter:
      "Jupyter provides interactive notebooks for data analysis, visualization, experimentation, and development",

    anaconda:
      "Anaconda is a Python distribution and environment manager designed for data science and machine learning",

    opencv: "OpenCV is an open-source computer vision library for image processing, analysis, and machine learning",

    // =========================
    // Other popular technologies
    // =========================

    markdown: "Markdown is a lightweight markup language for creating formatted documentation and readable content",

    npmjs: "npm is a JavaScript package ecosystem for discovering, installing, managing, and publishing packages",

    threejs: "Three.js is a JavaScript 3D graphics library for creating interactive 3D experiences in the browser",

    three: "Three.js is a JavaScript 3D graphics library for creating interactive 3D experiences in the browser",

    electron: "Electron enables developers to build cross-platform desktop applications using web technologies",

    unity: "Unity is a game engine and development platform for creating interactive 2D, 3D, and immersive experiences",

    unreal: "Unreal Engine is a powerful real-time 3D engine used for games, simulations, and interactive experiences",

    unity3d:
      "Unity is a game engine and development platform for creating interactive 2D, 3D, and immersive experiences",
  }

  return (
    techDescriptionMap[normalizedTech] ||
    `${techName} is a technology or tool widely used in software development, providing valuable features and capabilities.`
  )
}

export const getTimeStamp = (createdAt: Date): string => {
  const date = new Date(createdAt)
  const now = new Date()

  const diffMilliseconds = now.getTime() - date.getTime()
  const diffSeconds = Math.round(diffMilliseconds / 1000)
  if (diffSeconds < 60) {
    return `${diffSeconds} seconds ago`
  }

  const diffMinutes = Math.round(diffSeconds / 60)
  if (diffMinutes < 60) {
    return `${diffMinutes} mins ago`
  }

  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) {
    return `${diffHours} hours ago`
  }

  const diffDays = Math.round(diffHours / 24)

  return `${diffDays} days ago`
}

export const formatNumber = (number: number) => {
  if (number >= 100000) {
    return (number/1000000).toFixed(1)+"M"
  } else if (number >= 1000) {
    return (number/1000).toFixed(1)+"K"
  } else {
    return number.toString()
  }
}