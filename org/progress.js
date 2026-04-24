// ============================================================
//  DevTrackr — Progress Data
//  Update this file every day with your learning progress!
//  Each domain has: overall %, topic checklist, and daily logs
// ============================================================

const DEVTRACKR_DATA = {

  meta: {
    name: "Arman Ahemad Khan",           // ← Change this
    title: "Full Stack Dev in Progress",
    github: "arman080325",      // ← Change this
    startDate: "2025-01-01",
    goal: "Become a job-ready Full Stack Developer + Security Analyst by Dec 2025"
  },

  domains: [
    {
      id: "webdev",
      name: "Web Development",
      icon: "⬡",
      color: "#00f5ff",
      progress: 35,
      streak: 7,
      totalHours: 42,
      weeklyTarget: 10,
      deadline: "2025-06-30",
      status: "active",
      topics: [
        { name: "HTML5 Semantics",     done: true },
        { name: "CSS Flexbox",         done: true },
        { name: "CSS Grid",            done: true },
        { name: "Responsive Design",   done: true },
        { name: "JavaScript ES6+",     done: false },
        { name: "DOM Manipulation",    done: false },
        { name: "Fetch API / AJAX",    done: false },
        { name: "React Basics",        done: false },
        { name: "React Hooks",         done: false },
        { name: "Node.js Basics",      done: false },
        { name: "Express.js",          done: false },
        { name: "REST API Design",     done: false },
      ],
      logs: [
        {
          date: "2025-04-16",
          learned: "CSS Grid layout system — named grid areas, auto-fill vs auto-fit, minmax()",
          nextTarget: "Build a responsive dashboard layout using CSS Grid",
          hours: 2.5,
          resources: ["css-tricks.com/snippets/css/complete-guide-grid/"],
          mood: "🔥",
          notes: "Grid is so much cleaner than flexbox for 2D layouts. Finally clicked!"
        },
        {
          date: "2025-04-15",
          learned: "CSS Flexbox deep dive — align-items, justify-content, flex-wrap, gap",
          nextTarget: "Start CSS Grid module",
          hours: 3,
          resources: ["flexboxfroggy.com"],
          mood: "💪",
          notes: "Flexbox froggy game helped a lot. Completed all 24 levels."
        },
        {
          date: "2025-04-14",
          learned: "HTML5 semantic elements — header, nav, main, article, section, footer",
          nextTarget: "CSS Flexbox deep dive",
          hours: 2,
          resources: ["developer.mozilla.org"],
          mood: "😊",
          notes: "Accessibility matters. Semantic HTML is the foundation."
        }
      ]
    },

    {
      id: "javadsa",
      name: "Java DSA",
      icon: "◈",
      color: "#ff6b35",
      progress: 22,
      streak: 5,
      totalHours: 28,
      weeklyTarget: 8,
      deadline: "2025-08-31",
      status: "active",
      topics: [
        { name: "Java Basics & OOP",     done: true },
        { name: "Arrays & Strings",      done: true },
        { name: "Linked Lists",          done: false },
        { name: "Stacks & Queues",       done: false },
        { name: "Trees & BST",           done: false },
        { name: "Graphs",                done: false },
        { name: "Sorting Algorithms",    done: false },
        { name: "Searching Algorithms",  done: false },
        { name: "Dynamic Programming",   done: false },
        { name: "Recursion",             done: false },
      ],
      logs: [
        {
          date: "2025-04-16",
          learned: "Two pointer technique — solved 5 LeetCode problems (easy/medium)",
          nextTarget: "Sliding window technique + 3 more problems",
          hours: 2,
          resources: ["leetcode.com", "neetcode.io"],
          mood: "🧠",
          notes: "Two sum variants are everywhere. Pattern recognition is key."
        },
        {
          date: "2025-04-15",
          learned: "Array manipulation — prefix sums, kadane's algorithm",
          nextTarget: "Two pointer problems",
          hours: 2.5,
          resources: ["neetcode.io/roadmap"],
          mood: "😤",
          notes: "Kadane's was tricky but makes sense now. O(n) is elegant."
        }
      ]
    },

    {
      id: "fullstack",
      name: "Java Full Stack",
      icon: "⬟",
      color: "#a855f7",
      progress: 15,
      streak: 3,
      totalHours: 18,
      weeklyTarget: 8,
      deadline: "2025-10-31",
      status: "active",
      topics: [
        { name: "Spring Boot Basics",    done: true },
        { name: "Spring MVC",            done: false },
        { name: "Spring Security",       done: false },
        { name: "JPA & Hibernate",       done: false },
        { name: "MySQL / PostgreSQL",    done: false },
        { name: "React Frontend",        done: false },
        { name: "REST API Integration",  done: false },
        { name: "Docker Basics",         done: false },
        { name: "Deployment",            done: false },
      ],
      logs: [
        {
          date: "2025-04-15",
          learned: "Spring Boot project setup — Maven, application.properties, @SpringBootApplication",
          nextTarget: "Build first REST controller with Spring MVC",
          hours: 2,
          resources: ["spring.io/guides"],
          mood: "🚀",
          notes: "Spring Boot auto-configuration is magic. So much less boilerplate than plain Spring."
        }
      ]
    },

    {
      id: "cybersec",
      name: "CyberSecurity",
      icon: "⬡",
      color: "#0fd526",
      progress: 0,
      streak: 0,
      totalHours: 0,
      weeklyTarget: 0,
      deadline: "2026-04-30",
      status: "active",
      topics: [
        { name: "Networking Fundamentals", done: true },
        { name: "Linux CLI Basics",        done: false },
        { name: "OWASP Top 10",            done: false },
        { name: "SQL Injection",           done: false },
        { name: "XSS & CSRF",             done: false },
        { name: "Burp Suite",              done: false },
        { name: "Nmap & Recon",            done: false },
        { name: "CTF Challenges",          done: false },
        { name: "TryHackMe Paths",         done: false },
      ],
      logs: [
        {
          date: "2025-04-14",
          learned: "OSI model layers, TCP/IP stack, common ports (80, 443, 22, 3306)",
          nextTarget: "Linux file system and basic CLI commands",
          hours: 2,
          resources: ["tryhackme.com", "professor messer"],
          mood: "🔐",
          notes: "Understanding networking is the bedrock of everything in security."
        }
      ]
    }
  ]
};
