// Tag color coding system
// Automatically assigns colors to tags based on categories and keywords

export const TAG_CATEGORIES = {
  // Programming Languages
  javascript: {
    color: 'from-yellow-400 to-yellow-600',
    borderColor: 'border-yellow-500/50',
    textColor: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    keywords: ['javascript', 'js', 'es6', 'es2015', 'es2020', 'ecmascript', 'node', 'nodejs', 'npm', 'yarn', 'pnpm']
  },
  typescript: {
    color: 'from-blue-400 to-blue-600',
    borderColor: 'border-blue-500/50',
    textColor: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    keywords: ['typescript', 'ts', 'tsc', 'type', 'interface']
  },
  python: {
    color: 'from-blue-500 to-yellow-500',
    borderColor: 'border-blue-400/50',
    textColor: 'text-blue-300',
    bgColor: 'bg-blue-400/10',
    keywords: ['python', 'py', 'django', 'flask', 'fastapi', 'pandas', 'numpy', 'pip', 'conda']
  },
  java: {
    color: 'from-red-500 to-orange-500',
    borderColor: 'border-red-500/50',
    textColor: 'text-red-400',
    bgColor: 'bg-red-500/10',
    keywords: ['java', 'spring', 'springboot', 'maven', 'gradle', 'jvm', 'kotlin']
  },
  csharp: {
    color: 'from-purple-500 to-purple-700',
    borderColor: 'border-purple-500/50',
    textColor: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    keywords: ['csharp', 'c#', 'dotnet', '.net', 'asp.net', 'unity', 'xamarin']
  },
  go: {
    color: 'from-cyan-400 to-blue-500',
    borderColor: 'border-cyan-500/50',
    textColor: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    keywords: ['go', 'golang', 'goroutine', 'gin', 'fiber']
  },
  rust: {
    color: 'from-orange-600 to-red-600',
    borderColor: 'border-orange-500/50',
    textColor: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    keywords: ['rust', 'cargo', 'rustup', 'tokio', 'actix']
  },
  php: {
    color: 'from-indigo-400 to-purple-500',
    borderColor: 'border-indigo-500/50',
    textColor: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    keywords: ['php', 'laravel', 'symfony', 'wordpress', 'composer']
  },
  ruby: {
    color: 'from-red-500 to-red-700',
    borderColor: 'border-red-500/50',
    textColor: 'text-red-400',
    bgColor: 'bg-red-500/10',
    keywords: ['ruby', 'rails', 'rubyonrails', 'gem', 'bundler']
  },
  cpp: {
    color: 'from-blue-600 to-pink-600',
    borderColor: 'border-blue-500/50',
    textColor: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    keywords: ['cpp', 'c++', 'cmake', 'boost', 'qt']
  },

  // Frontend Frameworks
  react: {
    color: 'from-cyan-400 to-blue-500',
    borderColor: 'border-cyan-500/50',
    textColor: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    keywords: ['react', 'reactjs', 'jsx', 'hooks', 'redux', 'next', 'nextjs', 'gatsby']
  },
  vue: {
    color: 'from-green-400 to-teal-500',
    borderColor: 'border-green-500/50',
    textColor: 'text-green-400',
    bgColor: 'bg-green-500/10',
    keywords: ['vue', 'vuejs', 'vue3', 'nuxt', 'nuxtjs', 'vuex', 'pinia']
  },
  angular: {
    color: 'from-red-500 to-red-700',
    borderColor: 'border-red-500/50',
    textColor: 'text-red-400',
    bgColor: 'bg-red-500/10',
    keywords: ['angular', 'angularjs', 'ng', 'rxjs', 'ngrx']
  },
  svelte: {
    color: 'from-orange-500 to-red-500',
    borderColor: 'border-orange-500/50',
    textColor: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    keywords: ['svelte', 'sveltekit', 'svelte3']
  },

  // CSS & Styling
  css: {
    color: 'from-blue-400 to-blue-600',
    borderColor: 'border-blue-500/50',
    textColor: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    keywords: ['css', 'css3', 'scss', 'sass', 'less', 'postcss', 'styled-components', 'emotion']
  },
  tailwind: {
    color: 'from-teal-400 to-cyan-500',
    borderColor: 'border-teal-500/50',
    textColor: 'text-teal-400',
    bgColor: 'bg-teal-500/10',
    keywords: ['tailwind', 'tailwindcss', 'utility-first']
  },

  // Design & UX
  design: {
    color: 'from-pink-500 to-rose-500',
    borderColor: 'border-pink-500/50',
    textColor: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    keywords: ['design', 'ui', 'ux', 'figma', 'sketch', 'adobe', 'color', 'typography', 'icon', 'brand', 'logo', 'graphic']
  },

  // Backend & Databases
  database: {
    color: 'from-emerald-500 to-green-600',
    borderColor: 'border-emerald-500/50',
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    keywords: ['database', 'sql', 'nosql', 'mongodb', 'postgresql', 'postgres', 'mysql', 'sqlite', 'redis', 'cassandra', 'dynamodb', 'firestore']
  },
  api: {
    color: 'from-violet-500 to-purple-600',
    borderColor: 'border-violet-500/50',
    textColor: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
    keywords: ['api', 'rest', 'restful', 'graphql', 'grpc', 'websocket', 'webhook', 'microservice']
  },

  // AI & Machine Learning
  ai: {
    color: 'from-purple-500 to-violet-500',
    borderColor: 'border-purple-500/50',
    textColor: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    keywords: ['ai', 'ml', 'machine-learning', 'deep-learning', 'neural', 'chatgpt', 'gpt', 'llm', 'openai', 'anthropic', 'claude', 'gemini', 'copilot', 'artificial-intelligence', 'nlp', 'cv', 'computer-vision', 'tensorflow', 'pytorch', 'keras']
  },

  // Mobile Development
  mobile: {
    color: 'from-indigo-500 to-blue-500',
    borderColor: 'border-indigo-500/50',
    textColor: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    keywords: ['mobile', 'ios', 'android', 'flutter', 'react-native', 'swift', 'kotlin', 'app', 'native', 'hybrid', 'xamarin', 'cordova', 'capacitor']
  },

  // Cloud & DevOps
  cloud: {
    color: 'from-sky-400 to-blue-500',
    borderColor: 'border-sky-500/50',
    textColor: 'text-sky-400',
    bgColor: 'bg-sky-500/10',
    keywords: ['cloud', 'aws', 'azure', 'gcp', 'google-cloud', 'amazon', 'cloudflare', 's3', 'lambda', 'ec2', 'serverless']
  },
  devops: {
    color: 'from-orange-500 to-amber-600',
    borderColor: 'border-orange-500/50',
    textColor: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    keywords: ['devops', 'ci', 'cd', 'cicd', 'docker', 'kubernetes', 'k8s', 'jenkins', 'gitlab', 'github-actions', 'terraform', 'ansible']
  },

  // Security
  security: {
    color: 'from-red-500 to-rose-500',
    borderColor: 'border-red-500/50',
    textColor: 'text-red-400',
    bgColor: 'bg-red-500/10',
    keywords: ['security', 'auth', 'authentication', 'authorization', 'oauth', 'jwt', 'encryption', 'crypto', 'ssl', 'tls', 'https', 'vulnerability', 'xss', 'csrf', 'injection', 'pentest', 'hacking', 'cybersecurity']
  },

  // Testing
  testing: {
    color: 'from-teal-500 to-cyan-500',
    borderColor: 'border-teal-500/50',
    textColor: 'text-teal-400',
    bgColor: 'bg-teal-500/10',
    keywords: ['testing', 'test', 'jest', 'vitest', 'mocha', 'chai', 'cypress', 'playwright', 'selenium', 'unit', 'integration', 'e2e', 'tdd', 'bdd', 'qa', 'quality', 'coverage']
  },

  // Performance
  performance: {
    color: 'from-yellow-500 to-amber-500',
    borderColor: 'border-yellow-500/50',
    textColor: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    keywords: ['performance', 'optimization', 'speed', 'fast', 'cache', 'cdn', 'lazy', 'bundle', 'compression', 'minify', 'seo', 'lighthouse', 'metrics', 'benchmark', 'profiling']
  },

  // Content Types
  tutorial: {
    color: 'from-green-500 to-emerald-500',
    borderColor: 'border-green-500/50',
    textColor: 'text-green-400',
    bgColor: 'bg-green-500/10',
    keywords: ['tutorial', 'guide', 'how-to', 'learn', 'beginner', 'intro', 'introduction', 'getting-started', 'basics', 'fundamentals', 'course', 'lesson', 'workshop', 'training', 'walkthrough']
  },
  news: {
    color: 'from-orange-500 to-red-500',
    borderColor: 'border-orange-500/50',
    textColor: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    keywords: ['news', 'update', 'release', 'announcement', 'breaking', 'latest', 'new', 'fresh', 'trending', 'hot', 'now', '2024', '2025', '2026']
  },
  tips: {
    color: 'from-lime-500 to-green-500',
    borderColor: 'border-lime-500/50',
    textColor: 'text-lime-400',
    bgColor: 'bg-lime-500/10',
    keywords: ['tips', 'trick', 'hack', 'pro-tip', 'best-practice', 'advice']
  },

  // Tools & Editors
  tools: {
    color: 'from-gray-500 to-slate-500',
    borderColor: 'border-gray-500/50',
    textColor: 'text-gray-400',
    bgColor: 'bg-gray-500/10',
    keywords: ['tool', 'tools', 'vscode', 'ide', 'editor', 'cli', 'terminal', 'bash', 'shell', 'script', 'npm', 'yarn', 'pnpm', 'webpack', 'vite', 'rollup', 'parcel', 'eslint', 'prettier']
  },
  git: {
    color: 'from-orange-600 to-red-600',
    borderColor: 'border-orange-500/50',
    textColor: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    keywords: ['git', 'github', 'gitlab', 'bitbucket', 'version-control', 'vcs', 'commit', 'branch', 'merge', 'pull-request', 'pr']
  },

  // Architecture & Patterns
  architecture: {
    color: 'from-slate-500 to-gray-600',
    borderColor: 'border-slate-500/50',
    textColor: 'text-slate-400',
    bgColor: 'bg-slate-500/10',
    keywords: ['architecture', 'pattern', 'mvc', 'mvvm', 'clean', 'solid', 'ddd', 'microservices', 'monolith', 'design-pattern']
  },

  // Web Technologies
  web: {
    color: 'from-blue-500 to-cyan-500',
    borderColor: 'border-blue-500/50',
    textColor: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    keywords: ['web', 'html', 'html5', 'dom', 'browser', 'frontend', 'backend', 'fullstack', 'pwa', 'spa', 'ssr', 'ssg', 'jamstack']
  },

  // Data & Analytics
  data: {
    color: 'from-purple-400 to-violet-500',
    borderColor: 'border-purple-500/50',
    textColor: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    keywords: ['data', 'analytics', 'visualization', 'bigdata', 'etl', 'pipeline', 'warehouse', 'bi', 'datascience', 'analysis']
  },

  // Blockchain & Crypto
  blockchain: {
    color: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-500/50',
    textColor: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    keywords: ['blockchain', 'crypto', 'bitcoin', 'ethereum', 'web3', 'nft', 'smart-contract', 'defi', 'solidity']
  },

  // Gaming
  gaming: {
    color: 'from-fuchsia-500 to-pink-600',
    borderColor: 'border-fuchsia-500/50',
    textColor: 'text-fuchsia-400',
    bgColor: 'bg-fuchsia-500/10',
    keywords: ['gaming', 'game', 'gamedev', 'unity', 'unreal', 'godot', '3d', 'webgl', 'threejs']
  },

  // Business & Productivity
  business: {
    color: 'from-indigo-500 to-purple-600',
    borderColor: 'border-indigo-500/50',
    textColor: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    keywords: ['business', 'startup', 'entrepreneurship', 'productivity', 'management', 'agile', 'scrum', 'kanban', 'marketing']
  },

  // Default fallback
  default: {
    color: 'from-accent to-cyan-400',
    borderColor: 'border-accent/50',
    textColor: 'text-accent',
    bgColor: 'bg-accent/10',
    keywords: []
  }
};

/**
 * Get tag category based on tag name/slug
 */
export function getTagCategory(tagSlug: string): keyof typeof TAG_CATEGORIES {
  const normalized = tagSlug.toLowerCase().replace(/[_-]/g, '');

  for (const [category, config] of Object.entries(TAG_CATEGORIES)) {
    if (config.keywords.some(keyword =>
      normalized.includes(keyword.replace(/[_-]/g, '')) ||
      keyword.replace(/[_-]/g, '').includes(normalized)
    )) {
      return category as keyof typeof TAG_CATEGORIES;
    }
  }

  return 'default';
}

/**
 * Get color classes for a tag
 */
export function getTagColors(tagSlug: string) {
  const category = getTagCategory(tagSlug);
  return TAG_CATEGORIES[category];
}

/**
 * Get tag icon based on category
 */
export function getTagIcon(tagSlug: string): string {
  const category = getTagCategory(tagSlug);

  const icons: Record<string, string> = {
    tech: '💻',
    tutorial: '📚',
    news: '📰',
    design: '🎨',
    ai: '🤖',
    mobile: '📱',
    security: '🔒',
    performance: '⚡',
    testing: '🧪',
    tools: '🛠️',
    default: '🏷️'
  };

  return icons[category] || icons.default;
}

/**
 * Get all categories with their configs
 */
export function getAllCategories() {
  return Object.entries(TAG_CATEGORIES).map(([key, config]) => ({
    id: key,
    name: key.charAt(0).toUpperCase() + key.slice(1),
    icon: getTagIcon(key),
    ...config
  }));
}
