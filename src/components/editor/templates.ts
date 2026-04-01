// Advanced formatting templates

export const CALLOUT_TEMPLATES = {
  info: `<div class="callout callout-info">
<div class="callout-icon">ℹ️</div>
<div class="callout-content">
**Information**

This is an informational callout. Replace with your content.
</div>
</div>`,

  warning: `<div class="callout callout-warning">
<div class="callout-icon">⚠️</div>
<div class="callout-content">
**Warning**

This is a warning message. Use it to highlight important cautions.
</div>
</div>`,

  success: `<div class="callout callout-success">
<div class="callout-icon">✅</div>
<div class="callout-content">
**Success**

This indicates a successful action or positive outcome.
</div>
</div>`,

  danger: `<div class="callout callout-danger">
<div class="callout-icon">🚫</div>
<div class="callout-content">
**Danger**

This is a critical warning. Proceed with caution.
</div>
</div>`,

  tip: `<div class="callout callout-tip">
<div class="callout-icon">💡</div>
<div class="callout-content">
**Pro Tip**

Here's a helpful tip to improve your workflow.
</div>
</div>`,

  note: `<div class="callout callout-note">
<div class="callout-icon">📝</div>
<div class="callout-content">
**Note**

An important note to keep in mind.
</div>
</div>`,
};

export const DIVIDER_TEMPLATES = {
  simple: `\n---\n`,
  gradient: `\n<div class="divider-gradient"></div>\n`,
  dotted: `\n<div class="divider-dotted"></div>\n`,
  stars: `\n<div class="divider-stars">⭐ ⭐ ⭐</div>\n`,
};

export const LAYOUT_TEMPLATES = {
  "two-col": `<div class="layout-two-col">
<div class="col">

## Column 1

Content for the first column goes here.

</div>
<div class="col">

## Column 2

Content for the second column goes here.

</div>
</div>`,

  "three-col": `<div class="layout-three-col">
<div class="col">

### Column 1
Content here.

</div>
<div class="col">

### Column 2
Content here.

</div>
<div class="col">

### Column 3
Content here.

</div>
</div>`,

  "sidebar-left": `<div class="layout-sidebar-left">
<aside class="sidebar">

### Sidebar
Quick links or info

- Link 1
- Link 2
- Link 3

</aside>
<main class="main-content">

## Main Content

Your main article content goes here.

</main>
</div>`,

  "sidebar-right": `<div class="layout-sidebar-right">
<main class="main-content">

## Main Content

Your main article content goes here.

</main>
<aside class="sidebar">

### Related
- Link 1
- Link 2
- Link 3

</aside>
</div>`,
};

export const BLOG_TEMPLATES = {
  tutorial: `# Tutorial: [Your Topic Here]

## 📋 Overview

**What you'll learn:**
- Key concept 1
- Key concept 2
- Key concept 3

**Prerequisites:**
- Requirement 1
- Requirement 2
- Requirement 3

**Estimated time:** 30 minutes

---

## Step 1: Setup

<div class="callout callout-info">
<div class="callout-icon">💡</div>
<div class="callout-content">
**Before you start**

Make sure you have all the prerequisites installed before proceeding.
</div>
</div>

First, you need to set up your environment:

\`\`\`bash
# Installation command
npm install package-name
\`\`\`

---

## Step 2: Configuration

Now let's configure the settings:

1. Open the configuration file
2. Update the settings
3. Save the changes

\`\`\`json
{
  "setting": "value",
  "option": "example"
}
\`\`\`

<div class="callout callout-tip">
<div class="callout-icon">💡</div>
<div class="callout-content">
**Pro Tip**

You can customize these settings based on your specific needs.
</div>
</div>

---

## Step 3: Implementation

Implement the main functionality:

\`\`\`javascript
function example() {
  // Your code here
  return "Hello World";
}
\`\`\`

---

## Step 4: Testing

Test your implementation:

- [ ] Test case 1
- [ ] Test case 2
- [ ] Test case 3

---

## 🎉 Conclusion

**What you learned:**
- Concept 1
- Concept 2
- Concept 3

**Next steps:**
- Try building something with what you learned
- Explore advanced features
- Join the community

**Resources:**
- [Documentation](#)
- [GitHub Repository](#)
- [Community Forum](#)`,

  review: `# Review: [Product/Service Name]

## 📊 Quick Summary

| Aspect | Rating | Notes |
|--------|--------|-------|
| **Overall** | ⭐⭐⭐⭐☆ 4/5 | Great product with minor issues |
| **Features** | ⭐⭐⭐⭐⭐ 5/5 | Comprehensive feature set |
| **Performance** | ⭐⭐⭐⭐☆ 4/5 | Fast and responsive |
| **Price** | ⭐⭐⭐☆☆ 3/5 | Slightly expensive |
| **Support** | ⭐⭐⭐⭐⭐ 5/5 | Excellent customer service |

**Verdict:** Recommended ✅

---

## 🎯 Overview

Brief introduction to what you're reviewing and why it matters.

**Key details:**
- **Version tested:** v2.0
- **Testing period:** 2 weeks
- **Use case:** [Your specific use case]
- **Price:** $X/month

---

## ✅ Pros

<div class="callout callout-success">
<div class="callout-icon">✅</div>
<div class="callout-content">

**What We Loved**

1. **Feature 1** - Explanation of why this is great
2. **Feature 2** - Why this stands out
3. **Feature 3** - What makes this impressive
4. **Feature 4** - Additional positive aspect

</div>
</div>

### Standout Features

- **Amazing UI/UX** - Clean, intuitive interface
- **Performance** - Lightning-fast response times
- **Integration** - Works seamlessly with other tools
- **Support** - Responsive and helpful team

---

## ❌ Cons

<div class="callout callout-warning">
<div class="callout-icon">⚠️</div>
<div class="callout-content">

**Areas for Improvement**

1. **Issue 1** - Description of the problem
2. **Issue 2** - What needs work
3. **Issue 3** - Minor annoyance
4. **Issue 4** - Suggested improvement

</div>
</div>

### Notable Limitations

- **Price point** - Could be more affordable
- **Learning curve** - Takes time to master
- **Documentation** - Could be more comprehensive
- **Mobile app** - Needs improvement

---

## 🔍 Detailed Analysis

### User Experience

Detailed paragraph about the user experience, interface design, and overall usability.

### Performance

Analysis of speed, reliability, and technical performance.

### Features

Deep dive into key features and functionality.

\`\`\`javascript
// Example code usage
const example = new Product();
example.doSomething();
\`\`\`

### Pricing

| Plan | Price | Features |
|------|-------|----------|
| Free | $0 | Basic features |
| Pro | $20/mo | All features + support |
| Enterprise | Custom | Custom solutions |

---

## 🆚 Comparison with Alternatives

| Feature | This Product | Alternative 1 | Alternative 2 |
|---------|--------------|---------------|---------------|
| Price | $$ | $$$ | $ |
| Features | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐☆ | ⭐⭐⭐☆☆ |
| Performance | Fast | Faster | Slow |
| Support | Excellent | Good | Average |

---

## 💡 Who Is This For?

<div class="callout callout-info">
<div class="callout-icon">👥</div>
<div class="callout-content">

**Ideal for:**
- User type 1
- User type 2
- User type 3

**Not recommended for:**
- User type A
- User type B

</div>
</div>

---

## 🎯 Final Verdict

**Overall Rating: ⭐⭐⭐⭐☆ 4/5**

Summary paragraph with your final thoughts and recommendation.

**Would I recommend it?** Yes/No, because...

**Best alternative:** [Alternative name] if this doesn't fit your needs.

---

## 📚 Additional Resources

- [Official website](#)
- [Documentation](#)
- [Community forum](#)
- [Tutorial videos](#)`,

  technical: `# Technical Guide: [Topic Name]

## 📖 Table of Contents

1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Implementation](#implementation)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)
9. [References](#references)

---

## 🎯 Introduction

Brief overview of what this guide covers and who it's for.

**What you'll learn:**
- Core concepts
- Architecture patterns
- Implementation details
- Best practices

**Target audience:** Intermediate to advanced developers

**Prerequisites:**
- Knowledge requirement 1
- Knowledge requirement 2
- Tool/technology 3

---

## 🏗️ Architecture Overview

### System Architecture

\`\`\`mermaid
graph TB
    A[Client] --> B[API Gateway]
    B --> C[Service 1]
    B --> D[Service 2]
    C --> E[Database]
    D --> E
\`\`\`

### Key Components

1. **Component 1** - Description and purpose
2. **Component 2** - Description and purpose
3. **Component 3** - Description and purpose

### Data Flow

\`\`\`mermaid
sequenceDiagram
    User->>Frontend: Request
    Frontend->>Backend: API Call
    Backend->>Database: Query
    Database->>Backend: Response
    Backend->>Frontend: JSON Data
    Frontend->>User: Render UI
\`\`\`

---

## 📦 Prerequisites

<div class="callout callout-info">
<div class="callout-icon">📋</div>
<div class="callout-content">

**Required:**
- Node.js v18+
- npm or yarn
- Database (PostgreSQL/MySQL)
- Code editor (VS Code recommended)

**Optional:**
- Docker
- Git

</div>
</div>

---

## 🚀 Installation

### Step 1: Clone the Repository

\`\`\`bash
git clone https://github.com/username/repo.git
cd repo
\`\`\`

### Step 2: Install Dependencies

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### Step 3: Environment Setup

Create a \`.env\` file:

\`\`\`bash
# .env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
API_KEY=your_api_key_here
SECRET_KEY=your_secret_key
\`\`\`

---

## ⚙️ Configuration

### Basic Configuration

\`\`\`typescript
// config.ts
export const config = {
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    name: process.env.DB_NAME,
  },
  api: {
    port: process.env.PORT || 3000,
    version: 'v1',
  },
};
\`\`\`

### Advanced Options

\`\`\`typescript
// Advanced configuration
export const advancedConfig = {
  cache: {
    enabled: true,
    ttl: 3600,
  },
  logging: {
    level: 'info',
    format: 'json',
  },
};
\`\`\`

---

## 💻 Implementation

### Core Implementation

\`\`\`typescript
// Example implementation
class Service {
  constructor(private config: Config) {}

  async processData(input: DataInput): Promise<DataOutput> {
    // Implementation logic
    const result = await this.transform(input);
    return this.validate(result);
  }

  private async transform(data: DataInput): Promise<DataOutput> {
    // Transformation logic
    return transformedData;
  }

  private validate(data: DataOutput): DataOutput {
    // Validation logic
    if (!data.isValid) {
      throw new Error('Invalid data');
    }
    return data;
  }
}
\`\`\`

### Error Handling

\`\`\`typescript
try {
  await service.processData(input);
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation errors
  } else if (error instanceof DatabaseError) {
    // Handle database errors
  } else {
    // Handle unknown errors
    console.error('Unexpected error:', error);
  }
}
\`\`\`

---

## ✨ Best Practices

<div class="callout callout-tip">
<div class="callout-icon">💡</div>
<div class="callout-content">

**Recommended Practices**

1. **Use TypeScript** for type safety
2. **Implement proper error handling** at all levels
3. **Write unit tests** for critical functionality
4. **Document your code** with JSDoc comments
5. **Follow the style guide** consistently

</div>
</div>

### Code Quality

- Use ESLint and Prettier
- Maintain test coverage above 80%
- Run security audits regularly
- Keep dependencies up to date

### Performance Optimization

- Implement caching strategically
- Use database indexes
- Optimize queries
- Monitor performance metrics

---

## 🐛 Troubleshooting

### Common Issues

<details>
<summary><strong>Issue 1: Connection errors</strong></summary>

**Problem:** Cannot connect to database

**Solution:**
\`\`\`bash
# Check database is running
docker ps | grep postgres

# Verify connection string
echo $DATABASE_URL
\`\`\`

</details>

<details>
<summary><strong>Issue 2: Performance problems</strong></summary>

**Problem:** Slow query performance

**Solution:**
- Add database indexes
- Optimize queries
- Implement caching

</details>

<details>
<summary><strong>Issue 3: Build failures</strong></summary>

**Problem:** TypeScript compilation errors

**Solution:**
\`\`\`bash
# Clear cache and rebuild
rm -rf dist node_modules
npm install
npm run build
\`\`\`

</details>

---

## 📚 References

- [Official Documentation](https://docs.example.com)
- [API Reference](https://api.example.com/docs)
- [GitHub Repository](https://github.com/example/repo)
- [Community Forum](https://forum.example.com)
- [Stack Overflow Tag](https://stackoverflow.com/questions/tagged/example)

### Related Guides

- [Getting Started Guide](#)
- [Advanced Topics](#)
- [Migration Guide](#)`,

  interview: `# Interview: [Interviewee Name]

## 👤 About the Interviewee

<div class="author-bio">

<div class="author-avatar">

![Interviewee Name](/path/to/avatar.jpg "Interviewee Name")

</div>

<div class="author-info">

**[Name]** is a [role/title] at [Company]. With [X] years of experience in [field], they have [notable achievement or expertise].

**Connect:**
- 🐦 Twitter: [@handle](https://twitter.com/handle)
- 💼 LinkedIn: [Profile](https://linkedin.com/in/profile)
- 🌐 Website: [website.com](https://website.com)

</div>

</div>

---

## 📝 Interview Highlights

<div class="callout callout-info">
<div class="callout-icon">⭐</div>
<div class="callout-content">

**Key Takeaways:**
- Important insight 1
- Important insight 2
- Important insight 3

</div>
</div>

---

## 💬 The Interview

### Q: Tell us about your background and how you got into [field]?

**[Name]:** Response here. Share the story of how they got started, key moments in their career, and what led them to their current position.

> "Memorable quote from the interviewee that captures their philosophy or approach."

---

### Q: What are you currently working on?

**[Name]:** Description of current projects, initiatives, or focus areas. Include specific details about technologies, methodologies, or approaches they're using.

**Key projects:**
- Project 1: Brief description
- Project 2: Brief description
- Project 3: Brief description

---

### Q: What challenges have you faced, and how did you overcome them?

**[Name]:** Discussion of specific challenges, the approach to solving them, and lessons learned.

<div class="callout callout-tip">
<div class="callout-icon">💡</div>
<div class="callout-content">

**Lesson Learned**

Key lesson or advice based on their experience with challenges.

</div>
</div>

---

### Q: What tools and technologies do you use daily?

**[Name]:** List and description of their tech stack, favorite tools, and why they prefer them.

**Tech Stack:**
- **Languages:** JavaScript, TypeScript, Python
- **Frameworks:** React, Next.js, Node.js
- **Tools:** VS Code, Git, Docker
- **Services:** AWS, Vercel, GitHub

---

### Q: What advice would you give to someone starting in [field]?

**[Name]:** Practical advice for beginners, including:

1. **Start with fundamentals** - Why basics matter
2. **Build projects** - Importance of hands-on experience
3. **Join communities** - Networking and learning from others
4. **Stay curious** - Continuous learning mindset
5. **Don't fear mistakes** - Learning from failures

<div class="callout callout-success">
<div class="callout-icon">🎯</div>
<div class="callout-content">

**Top Tip**

"Most important single piece of advice in quotes."

</div>
</div>

---

### Q: What trends are you excited about in [industry/field]?

**[Name]:** Discussion of emerging trends, technologies, or methodologies they find interesting:

- **Trend 1** - Why it matters and potential impact
- **Trend 2** - How it's changing the industry
- **Trend 3** - Future implications

---

### Q: How do you stay updated and continue learning?

**[Name]:** Their learning strategies and resources:

**Resources:**
- 📚 Books: [Title 1], [Title 2]
- 🎧 Podcasts: [Podcast 1], [Podcast 2]
- 📰 Blogs/Newsletters: [Source 1], [Source 2]
- 🎥 YouTube Channels: [Channel 1], [Channel 2]
- 👥 Communities: [Community 1], [Community 2]

---

### Q: What's your typical workday like?

**[Name]:** Description of their daily routine, work habits, and productivity strategies.

**Daily Schedule:**
- **Morning:** [Routine]
- **Afternoon:** [Work blocks]
- **Evening:** [Wrap-up activities]

---

### Q: What's next for you?

**[Name]:** Their goals, upcoming projects, and vision for the future.

**Future plans:**
- Short-term (next 6 months)
- Medium-term (1-2 years)
- Long-term vision

---

## 🎯 Rapid Fire Round

Quick questions with brief answers:

| Question | Answer |
|----------|--------|
| **Favorite programming language?** | [Answer] |
| **Text editor of choice?** | [Answer] |
| **Tabs or spaces?** | [Answer] |
| **Light or dark theme?** | [Answer] |
| **Coffee or tea?** | [Answer] |
| **Favorite dev tool?** | [Answer] |
| **Most overrated tech?** | [Answer] |
| **Most underrated tech?** | [Answer] |

---

## 🔗 Resources Mentioned

- [Resource 1](https://link1.com) - Description
- [Resource 2](https://link2.com) - Description
- [Resource 3](https://link3.com) - Description

---

## 🙏 Final Thoughts

Closing paragraph thanking the interviewee and summarizing the key insights from the interview.

**Want to learn more?** Follow [Name] on [social media] and check out their [website/projects].`,

  "step-by-step": `## Step-by-Step Tutorial

### Step 1: Setup

<div class="step-number">1</div>

First, you need to set up your environment. Here's what you'll need:

- Requirement 1
- Requirement 2
- Requirement 3

\`\`\`bash
# Installation command
npm install package-name
\`\`\`

---

### Step 2: Configuration

<div class="step-number">2</div>

Now let's configure the settings:

1. Open the configuration file
2. Update the settings
3. Save the changes

\`\`\`json
{
  "setting": "value"
}
\`\`\`

---

### Step 3: Implementation

<div class="step-number">3</div>

Implement the main functionality:

\`\`\`javascript
function example() {
  // Your code here
  return "Hello World";
}
\`\`\`

---

### Step 4: Testing

<div class="step-number">4</div>

Test your implementation:

- [ ] Test case 1
- [ ] Test case 2
- [ ] Test case 3

🎉 **Congratulations!** You've completed the tutorial.`,

  comparison: `## Feature Comparison

<div class="comparison-table">

| Feature | Option A | Option B | Winner |
|---------|----------|----------|--------|
| **Speed** | Fast ⚡ | Slow 🐌 | Option A |
| **Price** | $$$ | $ | Option B |
| **Ease of Use** | Simple ✅ | Complex ⚙️ | Option A |
| **Features** | Basic | Advanced 🚀 | Option B |
| **Support** | Community | Professional | Option B |

</div>

### Pros & Cons

#### Option A

**Pros:**
- ✅ Fast performance
- ✅ Easy to use
- ✅ Great documentation

**Cons:**
- ❌ Limited features
- ❌ Higher cost
- ❌ No professional support

#### Option B

**Pros:**
- ✅ Advanced features
- ✅ Lower cost
- ✅ Professional support

**Cons:**
- ❌ Slower performance
- ❌ Steeper learning curve
- ❌ Complex setup

### Verdict

<div class="callout callout-success">
<div class="callout-icon">⭐</div>
<div class="callout-content">
**Recommendation**: Choose Option B if you need advanced features and professional support. Choose Option A if speed and simplicity are your priorities.
</div>
</div>`,

  gallery: `## Image Gallery

<div class="image-gallery">

<div class="gallery-item">

![Image 1](/path/to/image1.jpg "Image 1 title")

**Title 1**

Description of the first image.

</div>

<div class="gallery-item">

![Image 2](/path/to/image2.jpg "Image 2 title")

**Title 2**

Description of the second image.

</div>

<div class="gallery-item">

![Image 3](/path/to/image3.jpg "Image 3 title")

**Title 3**

Description of the third image.

</div>

<div class="gallery-item">

![Image 4](/path/to/image4.jpg "Image 4 title")

**Title 4**

Description of the fourth image.

</div>

</div>

> 💡 **Tip**: Replace /path/to/imageX.jpg with your actual image URLs`,

  faq: `## Frequently Asked Questions

<details class="faq-item">
<summary><strong>Q: What is this about?</strong></summary>

**A:** This is a comprehensive answer to the question. You can include:

- Bullet points
- Code examples
- Links

</details>

<details class="faq-item">
<summary><strong>Q: How do I get started?</strong></summary>

**A:** Getting started is easy:

1. First step
2. Second step
3. Third step

</details>

<details class="faq-item">
<summary><strong>Q: What are the requirements?</strong></summary>

**A:** You'll need:

- Requirement 1
- Requirement 2
- Requirement 3

</details>

<details class="faq-item">
<summary><strong>Q: Is there a cost?</strong></summary>

**A:** Pricing information:

| Plan | Price | Features |
|------|-------|----------|
| Free | $0 | Basic features |
| Pro | $10/mo | All features |

</details>

<details class="faq-item">
<summary><strong>Q: How can I get support?</strong></summary>

**A:** Contact us through:

- Email: support@example.com
- Twitter: [@example](https://twitter.com/example)
- Discord: [Join our server](https://discord.gg/example)

</details>`,

  author: `---

<div class="author-bio">

<div class="author-avatar">

![Author Name](/path/to/avatar.jpg "Author Name")

</div>

<div class="author-info">

### About the Author

**John Doe** is a software engineer and technical writer with 10+ years of experience. He specializes in web development and loves sharing knowledge through blog posts and tutorials.

**Connect:**
- 🐦 Twitter: [@johndoe](https://twitter.com/johndoe)
- 💼 LinkedIn: [John Doe](https://linkedin.com/in/johndoe)
- 🌐 Website: [johndoe.com](https://johndoe.com)
- ✉️ Email: john@example.com

**Recent Posts:**
- [Post Title 1](/blog/post-1)
- [Post Title 2](/blog/post-2)
- [Post Title 3](/blog/post-3)

</div>

</div>

---`,

  timeline: `## Project Timeline

<div class="timeline">

<div class="timeline-item">
<div class="timeline-marker">📅</div>
<div class="timeline-content">

### Phase 1: Planning (Week 1-2)

**Status:** ✅ Completed

- Define requirements
- Create project plan
- Set milestones

</div>
</div>

<div class="timeline-item">
<div class="timeline-marker">⚙️</div>
<div class="timeline-content">

### Phase 2: Development (Week 3-6)

**Status:** 🚧 In Progress

- Build core features
- Implement UI/UX
- Write tests

**Progress:** 60%

</div>
</div>

<div class="timeline-item">
<div class="timeline-marker">🧪</div>
<div class="timeline-content">

### Phase 3: Testing (Week 7-8)

**Status:** ⏳ Upcoming

- Run test suites
- Fix bugs
- Performance optimization

</div>
</div>

<div class="timeline-item">
<div class="timeline-marker">🚀</div>
<div class="timeline-content">

### Phase 4: Launch (Week 9)

**Status:** ⏳ Upcoming

- Deploy to production
- Monitor performance
- Gather feedback

</div>
</div>

</div>`,
};

export function getTemplate(category: string, type: string): string {
  if (category === "callout") {
    return CALLOUT_TEMPLATES[type as keyof typeof CALLOUT_TEMPLATES] || "";
  }
  if (category === "divider") {
    return DIVIDER_TEMPLATES[type as keyof typeof DIVIDER_TEMPLATES] || "";
  }
  if (category === "layout") {
    return LAYOUT_TEMPLATES[type as keyof typeof LAYOUT_TEMPLATES] || "";
  }
  if (category === "blog") {
    return BLOG_TEMPLATES[type as keyof typeof BLOG_TEMPLATES] || "";
  }
  return "";
}
