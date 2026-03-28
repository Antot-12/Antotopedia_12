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
  tutorial: `## Step-by-Step Tutorial

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
