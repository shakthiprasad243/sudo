# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/f5797a7e-0cc5-4858-99ce-672d2ca790c1

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/f5797a7e-0cc5-4858-99ce-672d2ca790c1) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Backend as a Service)

## New Features

This version includes enhanced functionality for student-faculty interaction:

### Student Upload System
- Students can upload assignments with titles and descriptions
- Faculty member selection for each submission
- Submission history tracking with status updates (pending, approved, rejected)

### Faculty Dashboard
- Review submissions from assigned students
- Filter submissions by status or search by student name/title
- Approve or reject student submissions
- Detailed submission information display

### Database
- New `student_uploads` table for tracking assignments
- Faculty-student relationship management
- Status tracking for all submissions
- Row Level Security for data isolation

### Student Credentials
The system now uses the same student login approach as version2, where students use their registration number as both username and password.

**Student Accounts:**
Students log in using their registration number as both username and password. Some example registration numbers include:
- 22F41A0424 / 22F41A0424 (E CHARAN KUMAR REDDY)
- 22F41A0401 / 22F41A0401 (A AYESHA SIDDIKHA)
- 22F41A0402 / 22F41A0402 (AKASH G)
- 22F41A0403 / 22F41A0403 (ALAKAM JAGADEESH)
- 22F41A0404 / 22F41A0404 (ALAM HARSHITH ROYAL)
- ... (full list includes all students from version2)

**Faculty Accounts:**
- Faculty 1: faculty1 / faculty123 (Dr. Smith)
- Faculty 2: faculty2 / faculty456 (Prof. Johnson)

**Other Demo Accounts:**
- Admin: admin / admin123
- HOD: hod / hod123
- Government Authority: govt / govt123

## Implementation Details

For detailed information about the student-faculty assignment routing system, see [STUDENT_FACULTY_ROUTING.md](../STUDENT_FACULTY_ROUTING.md)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/f5797a7e-0cc5-4858-99ce-672d2ca790c1) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)