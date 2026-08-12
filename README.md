<div align="center">
  
  <!-- Animated Header -->
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=30&duration=3000&pause=500&color=6366F1&center=true&vCenter=true&width=500&lines=✨+MERCHY;From+Ideas+to+Merch;Build+and+Sell+Your+Merch"/>
  
  <br/>
  
  <a href="https://merchy-blond.vercel.app/">
    <img src="https://img.shields.io/badge/🚀-LIVE%20DEMO-6366F1?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo"/>
  </a>
  <a href="https://github.com/Cursey-Rahul/Merchy">
    <img src="https://img.shields.io/badge/📂-VIEW%20SOURCE-181717?style=for-the-badge&logo=github&logoColor=white" alt="View Source"/>
  </a>
  
  <br/>
  
  > ### **"From Ideas to Merch – Made Simple."**  
  > ### **アイデアからグッズへ―シンプルに。**

</div>

---

## 🎯 **What is Merchy?**

**Merchy** is a **creator-first e-commerce platform** that empowers content creators and influencers to **launch, display, and sell** their merchandise effortlessly. No technical expertise needed — launch products, showcase them with previews, and sell to customers worldwide.

### 🎨 **For Creators, By Creators**

<table>
  <tr>
    <td width="33%" align="center">
      <h3>🚀</h3>
      <p><strong>Launch Fast</strong><br/>List your merch<br/>in minutes</p>
    </td>
    <td width="33%" align="center">
      <h3>🎪</h3>
      <p><strong>Display Beautifully</strong><br/>Showcase products<br/>with 3D previews</p>
    </td>
    <td width="33%" align="center">
      <h3>💰</h3>
      <p><strong>Sell Globally</strong><br/>Secure payments<br/>via Stripe</p>
    </td>
  </tr>
</table>

---

## ✨ **Features**

### 🛍️ **Creator Dashboard**
- **Product Management**: Add, edit, and organize merchandise
- **Inventory Tracking**: Monitor stock levels in real-time
- **Order Management**: View and fulfill customer orders
- **Analytics**: Track sales and performance metrics

### 👤 **User Experience**
- **Creator Profiles**: Personalized storefronts with creator names
- **Product Discovery**: Browse and search for merch
- **Secure Authentication**: Google OAuth only (prevents bot attacks)
- **Responsive Design**: Perfect on desktop and mobile

### 🔒 **Security First**
- **Google Authentication Only**: Prevents bot attacks
- **Secure Payment Processing**: Stripe integration
- **Data Protection**: Prisma ORM with PostgreSQL
- **Image Security**: Cloudinary for safe media storage

---

## 🛠️ **Tech Stack**

<div align="center">

| **Category** | **Technology** | **Purpose** |
|--------------|---------------|-------------|
| **Framework** | Next.js 15 | React framework with App Router |
| **Language** | TypeScript 5 | Type-safe JavaScript |
| **Styling** | Tailwind CSS 4 + Shadcn | Modern UI components |
| **Database** | PostgreSQL | Relational database |
| **ORM** | Prisma 6 | Type-safe database access |
| **Auth** | NextAuth.js | Google OAuth authentication |
| **Payments** | Stripe 18 | Payment processing |
| **Media** | Cloudinary | Image storage & optimization |
| **DevOps** | Docker | Containerization |
| **Deployment** | Vercel | Hosting platform |

</div>

---

## 🚀 **Quick Start**

### 📦 **Prerequisites**

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (v14 or higher)
- Docker (optional, for containerized setup)

### 🔧 **Installation**

```bash
# Clone the repository
git clone https://github.com/Cursey-Rahul/Merchy.git
cd Merchy

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Set up database
npx prisma generate
npx prisma migrate dev

# Run development server
npm run dev
```

---

## ✅ What I changed

- Fixed a typo in the Quick Start (changed `cd MerchY` to `cd Merchy`).
- Replaced a truncated/garbled animated header line with a clean message.
- Ensured the installation code block is properly closed.

If you'd like additional updates (add contribution guidelines, license, or screenshots), tell me what to add and I'll update the README accordingly.
