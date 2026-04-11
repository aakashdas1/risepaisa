// risePaisa — Resources Catalog Data
const RESOURCES = [
  {
    id: 1,
    slug: 'notion-finance-tracker',
    title: 'Notion Finance Tracker',
    shortDescription: 'A complete Notion template to track your income, expenses, savings goals, and investments — built for Nepali financial habits.',
    fullDescription: `Take full control of your personal finances with this beautifully designed Notion template. Track every rupee coming in and going out, set savings goals, monitor your investments, and visualize your financial health — all in one place.\n\nDesigned specifically for Nepalis managing their money across bank accounts, eSewa, Khalti, and cash. Whether you earn NPR 20,000 or NPR 200,000, this tracker adapts to your lifestyle and helps you build wealth systematically.`,
    price: 299,
    currency: 'NPR',
    creator: 'Aakash Das',
    category: 'Notion',
    thumbnail: null,
    previewVideoUrl: 'https://www.youtube-nocookie.com/embed/dbWxH9C5cBE?rel=0&modestbranding=1&controls=1&showinfo=0',
    imageUrl: 'assets/images/resource-notion-preview.png',
    whatYouLearn: [
      'Track all income sources in one dashboard',
      'Categorize and monitor daily expenses',
      'Set and track monthly savings goals',
      'Visualize spending patterns with built-in charts',
      'Monitor investments and portfolio growth',
      'Auto-calculate remaining budget each month',
      'Manage multiple accounts (bank, eSewa, Khalti, cash)',
      'Get a clear snapshot of your net worth'
    ],
    whatsIncluded: [
      'Monthly budget dashboard',
      'Income & expense tracker with categories',
      'Savings goal tracker with progress bars',
      'Investment portfolio overview',
      'Net worth calculator',
      'Transaction log with search & filters',
      'Pre-built expense categories for Nepal',
      'Setup guide & video walkthrough'
    ],
    targetAudience: 'Young professionals who want to organize their finances, students learning to budget, and anyone who uses Notion and wants a ready-made finance system tailored for Nepal.',
    featured: true
  },
  {
    id: 2,
    slug: 'budget-planner-system',
    title: 'Budget Planner System',
    shortDescription: 'A powerful spreadsheet-based budget planner with automated calculations, visual charts, and Nepal-specific expense categories.',
    fullDescription: `Stop guessing where your money goes. This comprehensive budget planner spreadsheet gives you a complete financial command center with automated formulas, visual charts, and categories designed for life in Nepal.\n\nWorks with Google Sheets — no software installation needed. Just duplicate, fill in your numbers, and watch your financial picture come alive. Includes the 50/30/20 budgeting framework adapted for Nepali incomes and expenses.`,
    price: 399,
    currency: 'NPR',
    creator: 'Aakash Das',
    category: 'Finance Tools',
    thumbnail: null,
    previewVideoUrl: 'https://www.youtube-nocookie.com/embed/lRlK0qY46Ns?rel=0&modestbranding=1&controls=1&showinfo=0',
    imageUrl: 'assets/images/resource-budget-preview.png',
    whatYouLearn: [
      'Master the 50/30/20 budgeting rule for Nepal',
      'Track fixed vs variable expenses automatically',
      'Set realistic savings targets based on your income',
      'Identify spending leaks and cut unnecessary costs',
      'Plan for major expenses (festivals, rent, EMIs)',
      'Build an emergency fund systematically'
    ],
    whatsIncluded: [
      'Monthly budget template with auto-calculations',
      'Expense category breakdown (Nepal-specific)',
      'Income tracker for multiple sources',
      'Savings goal planner with visual progress',
      'Spending analysis charts (pie + bar)',
      'Annual financial summary dashboard',
      'Setup instructions & walkthrough video'
    ],
    targetAudience: 'Anyone who wants a simple but powerful budgeting tool, fresh graduates starting their first job, and families managing household finances in Nepal.',
    featured: true
  }
];

export default RESOURCES;
