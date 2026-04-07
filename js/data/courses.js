// risePaisa — Course Catalog Data
const COURSES = [
  {
    id: 1,
    slug: 'nepse-stock-market-basics',
    title: 'NEPSE Stock Market Basics',
    shortDescription: 'Learn how the Nepal Stock Exchange works — from opening a DEMAT account to placing your first trade.',
    fullDescription: `This comprehensive beginner-friendly course covers everything you need to know about investing in Nepal's stock market. You'll learn how NEPSE operates, understand market indicators like NEPSE index and sub-indices, and gain practical skills for analyzing stocks listed on the exchange.\n\nWhether you're a complete beginner or someone who has dabbled in shares but wants a structured understanding, this course will give you the confidence to make informed investment decisions in the Nepali stock market.`,
    price: 1499,
    currency: 'NPR',
    instructor: 'Aakash Das',
    category: 'NEPSE & Investing',
    thumbnail: null,
    whatYouLearn: [
      'Understand how NEPSE (Nepal Stock Exchange) works',
      'Open and manage a DEMAT & Meroshare account',
      'Read and interpret stock market charts and indicators',
      'Analyze company fundamentals using financial reports',
      'Apply IPO and FPO through Meroshare',
      'Understand broker roles and trading mechanisms',
      'Build a diversified stock portfolio for long-term growth',
      'Identify common mistakes beginner investors make'
    ],
    curriculum: [
      {
        title: 'Module 1: Introduction to Stock Markets',
        lessons: ['What is a stock market?', 'History of NEPSE', 'Key terms every investor must know', 'Bull vs Bear markets explained']
      },
      {
        title: 'Module 2: Getting Started',
        lessons: ['Opening a DEMAT account', 'Setting up Meroshare', 'Choosing the right broker', 'Understanding brokerage fees & SEBON regulations']
      },
      {
        title: 'Module 3: Fundamental Analysis',
        lessons: ['Reading financial statements', 'Key ratios: P/E, EPS, Book Value', 'Sector analysis in NEPSE', 'Identifying undervalued stocks']
      },
      {
        title: 'Module 4: Technical Analysis Basics',
        lessons: ['Introduction to candlestick charts', 'Support and resistance levels', 'Volume analysis', 'Moving averages simplified']
      },
      {
        title: 'Module 5: Building Your Portfolio',
        lessons: ['Diversification strategies', 'Risk management basics', 'When to buy and when to sell', 'Long-term vs short-term investing']
      }
    ],
    targetAudience: 'Complete beginners who want to start investing in NEPSE, college students interested in finance, and anyone curious about how the stock market works in Nepal.',
    previewVideoUrl: null,
    featured: true
  },
  {
    id: 2,
    slug: 'personal-finance-masterclass',
    title: 'Personal Finance Masterclass',
    shortDescription: 'Master budgeting, saving, and building an emergency fund — all tailored for life in Nepal.',
    fullDescription: `Take control of your financial future with this practical personal finance course designed specifically for Nepalis. From creating your first budget to understanding the power of compound interest, this course breaks down complex financial concepts into simple, actionable steps.\n\nYou'll learn strategies that work with Nepali salaries, expenses, and financial products. Whether you earn NPR 20,000 or NPR 200,000 a month, these principles will help you save more, spend wisely, and build lasting wealth.`,
    price: 999,
    currency: 'NPR',
    instructor: 'Aakash Das',
    category: 'Personal Finance',
    thumbnail: null,
    whatYouLearn: [
      'Create a realistic monthly budget that works',
      'Build an emergency fund (कति र कसरी)',
      'Understand the difference between good debt and bad debt',
      'Set and achieve short-term and long-term financial goals',
      'Learn the 50/30/20 budgeting rule adapted for Nepal',
      'Understand Fixed Deposits, savings accounts, and interest rates in Nepal',
      'Protect yourself from common financial scams'
    ],
    curriculum: [
      {
        title: 'Module 1: Financial Foundations',
        lessons: ['Assessing your current financial health', 'Income vs expenses tracking', 'Setting SMART financial goals', 'The mindset of wealth building']
      },
      {
        title: 'Module 2: Budgeting Like a Pro',
        lessons: ['The 50/30/20 rule for Nepali incomes', 'Tracking expenses effectively', 'Using apps vs spreadsheets', 'Cutting unnecessary costs without sacrificing quality of life']
      },
      {
        title: 'Module 3: Saving & Emergency Fund',
        lessons: ['Why emergency funds matter', 'How much to save (3-6 months rule)', 'Best savings accounts in Nepal', 'Automating your savings']
      },
      {
        title: 'Module 4: Understanding Debt',
        lessons: ['Good debt vs bad debt', 'Managing loans and EMIs', 'Credit score basics', 'Strategies to become debt-free']
      },
      {
        title: 'Module 5: Growing Your Money',
        lessons: ['Introduction to investing options in Nepal', 'Power of compound interest', 'FDs, mutual funds, and shares overview', 'Planning for major life expenses']
      }
    ],
    targetAudience: 'Young professionals, fresh graduates, and anyone who wants to take charge of their finances in Nepal — no prior financial knowledge required.',
    previewVideoUrl: null,
    featured: true
  }
];

export default COURSES;
