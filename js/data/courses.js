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
    previewVideoUrl: 'https://youtu.be/vqKypJh0xxo',
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
        title: 'Module 0: Course Introduction',
        lessons: ['What this course will help you achieve (clear financial roadmap)', 'How money actually works in Nepal (reality vs assumptions)', 'How to use this course for maximum results']
      },
      {
        title: 'Module 1: Financial Reality & Foundations',
        lessons: ['The real financial condition of Nepali households', 'How a responsible person manages money (income → expenses → investment)', 'Inflation explained (why money loses value over time)', 'Why saving in bank alone is not enough']
      },
      {
        title: 'Module 2: Emergency & Financial Stability',
        lessons: ['What is an emergency fund and why it is critical', 'How much emergency fund you actually need (Nepal context)', 'Where to keep your emergency fund safely', 'Common mistakes people make with savings']
      },
      {
        title: 'Module 3: Insurance & Family Protection',
        lessons: ['Insurance explained (life, health, term vs endowment)', 'Which insurance you actually need in Nepal', 'How insurance agents mislead you (hidden reality)', 'How to choose the right insurance plan']
      },
      {
        title: "Module 4: Securing Your Child's Future",
        lessons: ['Real cost of education in Nepal (future projection)', 'How to build long-term funds for your child', 'Insurance vs investment for child planning (what actually works)']
      },
      {
        title: 'Module 5: Loans, EMI & Debt Control',
        lessons: ['What is EMI and how loans actually work', 'EMI amortization explained simply', 'Good debt vs bad debt (Nepal examples)', 'How to use loan calculators properly']
      },
      {
        title: 'Module 6: Rent vs Buying a House',
        lessons: ['Rent vs buy: complete financial comparison', 'How much salary you need to buy a house', 'Real estate reality in Kathmandu & Nepal', 'Hidden costs of owning a house']
      },
      {
        title: 'Module 7: Investing Fundamentals',
        lessons: ['What is investing and how wealth is created', 'Types of investments available in Nepal', 'Risk vs return explained clearly', 'Why most people fail in investing']
      },
      {
        title: 'Module 8: Mutual Funds & SIP (Practical Investing)',
        lessons: ['Mutual funds explained (complete beginner guide)', 'Open-ended vs closed-ended mutual funds', 'SIP explained (how it builds wealth over time)', 'How to use SIP calculators (practical demo)']
      },
      {
        title: 'Module 9: Nepal-Specific Financial Risks',
        lessons: ['Sahakari (cooperative) system explained', 'Risks, scams, and failures in Nepal', 'How to protect your money from fraud']
      },
      {
        title: 'Module 10: Wealth Mindset & Youth Reality',
        lessons: ['Why saving alone won\'t make you rich', 'Skill vs degree (what actually creates income)', 'Who succeeds financially and why (real patterns)', 'The illusion of being "smart" without execution']
      },
      {
        title: 'Module 11: Business Basics (Advanced Level)',
        lessons: ['What is a business and how it works', 'How to start a business in Nepal (basic steps)', 'Company registration and tax basics', 'Common mistakes beginners make in business']
      }
    ],
    targetAudience: 'Anyone who wants to take full control of their finances; People dealing with loans, responsibilities, and future planning; Individuals who want to invest correctly and avoid financial mistakes; Anyone serious about building long-term wealth in Nepal',
    previewVideoUrl: 'https://youtu.be/vqKypJh0xxo',
    featured: true
  }
];

export default COURSES;
