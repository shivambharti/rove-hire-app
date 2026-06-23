

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```



Hosting
The application is hosted as a serverless deployment on the Vercel Platform. It utilizes serverless functions to handle API requests and routing, ensuring high availability, automatic scaling, and zero-configuration infrastructure management


Tech Stack and Justification
Frontend: Built with Next.js and Tailwind CSS. Next.js was chosen for its integrated API routing and server-side rendering capabilities, which streamline development, while Tailwind provides a rapid utility-first workflow for consistent UI components.

Backend: Leverages Next.js API Routes (Node.js/TypeScript). Using a unified framework for both frontend and backend minimizes context switching and keeps the codebase DRY (Don't Repeat Yourself).

Database: MongoDB. Given the document-based nature of recruitment data (candidates, job openings, and dynamic forms), a NoSQL approach provides the flexibility needed to iterate on data schemas without complex migrations.

PDF Generation Approach
Technique: I utilized @react-pdf/renderer to define document structures using React components. This allows for declarative, component-based PDF construction, which integrates seamlessly into the existing React/Next.js codebase. After generation, the resulting binary stream is uploaded to Vercel Blob to store the document persistently and generate a unique, accessible URL.

Why: Using @react-pdf/renderer provides a consistent developer experience by allowing the use of React primitives to layout documents. It effectively bridges the gap between web UI components and formal corporate documents, ensuring that styling remains maintainable and aligned with the application’s design system.


Future Roadmap (Next 48 Hours)
If given two more days, I would prioritize:

Authentication/RBAC: Implementing role-based access control to ensure only authorized recruiters can view sensitive candidate salary data or close job openings.

Template Customization: Creating a UI that allows users to edit offer letter templates directly in the browser rather than hard-coding the layout.

Dashboard Analytics: Visualizing the "Time-to-Fill" and "Candidate Conversion" metrics on the home screen, which were cut for time.


Production Readiness Considerations
There are two areas I would address before a production launch:

Error Handling: The current error handling is rudimentary. I would add centralized logging (e.g., Sentry) and more graceful user-facing error states for failed file generations or database timeouts.

Security of Generated Assets: Currently, the system relies on transient URLs. In production, I would implement signed URLs that expire after a short duration to ensure that access to sensitive offer letters remains strictly controlled and private.
